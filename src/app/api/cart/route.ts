import { NextRequest, NextResponse } from "next/server";
import { runQuery } from "@/services/neo4jDriver";
import neo4j from "neo4j-driver";

// Helper function to convert Neo4j integers
function convertNeo4jIntegers(obj: any) {
  for (const key in obj) {
    if (neo4j.isInt(obj[key])) {
      obj[key] = obj[key].toNumber();
    } else if (typeof obj[key] === "object") {
      convertNeo4jIntegers(obj[key]);
    }
  }
  return obj;
}

// Get cart contents
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("user-id"); // Assume user ID is sent in headers
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const query = `
      MATCH (u:User {id: $userId})-[:HAS_CART]->(c:Cart)-[r:CONTAINS]->(p:Product)
      RETURN p.id AS productId, p.name AS name, p.price AS price, r.quantity AS quantity
    `;

    const result = await runQuery(query, { userId });
    const cartItems = result.map((row: any) => convertNeo4jIntegers(row));

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart contents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const { userId, productId, quantity } = await request.json();

    if (!userId || !productId || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const query = `
      MERGE (u:User {id: $userId})
      MERGE (u)-[:HAS_CART]->(c:Cart)
      MERGE (p:Product {id: $productId})
      MERGE (c)-[r:CONTAINS]->(p)
      ON CREATE SET r.quantity = $quantity
      ON MATCH SET r.quantity = r.quantity + $quantity
      RETURN p.id AS productId, p.name AS name, p.price AS price, r.quantity AS quantity
    `;

    const result = await runQuery(query, { userId, productId, quantity });
    const addedItem = convertNeo4jIntegers(result[0]);

    return NextResponse.json(addedItem);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update item quantity in cart
export async function PUT(request: NextRequest) {
  try {
    const { userId, productId, quantity } = await request.json();

    if (!userId || !productId || quantity === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const query = `
      MATCH (u:User {id: $userId})-[:HAS_CART]->(c:Cart)-[r:CONTAINS]->(p:Product {id: $productId})
      SET r.quantity = $quantity
      RETURN p.id AS productId, p.name AS name, p.price AS price, r.quantity AS quantity
    `;

    const result = await runQuery(query, { userId, productId, quantity });
    if (result.length === 0) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    const updatedItem = convertNeo4jIntegers(result[0]);
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating item quantity in cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { userId, productId } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const query = `
      MATCH (u:User {id: $userId})-[:HAS_CART]->(c:Cart)-[r:CONTAINS]->(p:Product {id: $productId})
      DELETE r
      RETURN p.id AS productId
    `;

    const result = await runQuery(query, { userId, productId });
    if (result.length === 0) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
