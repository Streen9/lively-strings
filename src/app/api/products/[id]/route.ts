import { NextRequest, NextResponse } from "next/server";
import { runQuery } from "@/services/neo4jDriver";
import neo4j from "neo4j-driver";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const query = `
      MATCH (p:Product {id: $id})
      OPTIONAL MATCH (p)-[:BELONGS_TO]->(c:Category)
      RETURN {
        id: p.id,
        name: p.name,
        price: p.price,
        rating: p.rating,
        ratingCount: p.ratingCount,
        description: p.description,
        features: p.features,
        category: c.name,
        images: p.images
      } AS product
    `;

    const result = await runQuery(query, { id });

    if (result.length > 0) {
      const product = result[0].product;

      // Convert Neo4j integers to regular JavaScript numbers
      if (neo4j.isInt(product.id)) {
        product.id = product.id.toNumber();
      }
      if (neo4j.isInt(product.ratingCount)) {
        product.ratingCount = product.ratingCount.toNumber();
      }

      // Parse the jsonData field if it exists
      if (product.jsonData) {
        product.jsonData = JSON.parse(product.jsonData);

        // Convert Neo4j integers inside jsonData
        if (neo4j.isInt(product.jsonData.id)) {
          product.jsonData.id = product.jsonData.id.toNumber();
        }
        if (neo4j.isInt(product.jsonData.ratingCount)) {
          product.jsonData.ratingCount =
            product.jsonData.ratingCount.toNumber();
        }
      }

      return NextResponse.json(product);
    } else {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching product from Neo4j:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const updatedProduct = await request.json();

  const query = `
    MATCH (p:Product {id: $id})
    SET p += $properties
    RETURN p
  `;

  const updatedParams = {
    id: id,
    properties: updatedProduct,
  };

  try {
    const result = await runQuery(query, updatedParams);
    console.log(request);
    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Product updated successfully",
      product: result,
    });
  } catch (error) {
    console.error("Error updating product in Neo4j:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const query = `
    MATCH (p:Product {id: $id})
    DETACH DELETE p
  `;

  try {
    await runQuery(query, { id });
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product from Neo4j:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
