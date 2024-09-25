import { NextRequest, NextResponse } from "next/server";
import { runQuery } from "@/services/neo4jDriver";
import neo4j from "neo4j-driver";

export async function POST(request: NextRequest) {
  const product = await request.json();

  if (!product.id || !product.name || !product.price || !product.category) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const query = `
    CREATE (p:Product {
      id: $id,
      name: $name,
      price: $price,
      rating: $rating,
      ratingCount: $ratingCount,
      description: $description,
      category: $category,
      features: $features,
      images: $images
      })
      WITH p
      MATCH (c:Category {name: $category})
      MERGE (p)-[:BELONGS_TO]->(c)
      RETURN p AS product
      `;

  const params = {
    id: product.id,
    name: product.name,
    price: parseFloat(product.price),
    rating: product.rating ? parseFloat(product.rating) : null,
    ratingCount: product.ratingCount
      ? neo4j.types.Integer.fromNumber(parseInt(product.ratingCount))
      : null,
    description: product.description,
    category: product.category,
    features: product.features,
    images: product.images,
  };

  try {
    const result = await runQuery(query, params);
    return NextResponse.json(
      { message: "Product created successfully", product: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product in Neo4j:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
