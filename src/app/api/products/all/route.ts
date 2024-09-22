import { NextRequest, NextResponse } from "next/server";
import { runQuery } from "@/services/neo4jDriver";
import neo4j from "neo4j-driver";

export async function GET(request: NextRequest) {
  try {
    const query = `
  MATCH (p:Product)
   OPTIONAL MATCH (p)-[:BELONGS_TO]->(c:Category)
   WITH p, c
   RETURN DISTINCT {
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

    const result = await runQuery(query, {});

    // Convert Neo4j integers and handle jsonData parsing for each product
    const products = result.map((row: any) => {
      const product = row.product;

      // Convert Neo4j integers to regular JavaScript numbers
      if (neo4j.isInt(product.id)) {
        product.id = product.id.toNumber();
      }
      if (neo4j.isInt(product.ratingCount)) {
        product.ratingCount = product.ratingCount.toNumber();
      }

      // Parse jsonData if it exists
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

      return product;
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching all products from Neo4j:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
