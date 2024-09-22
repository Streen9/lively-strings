import { NextRequest, NextResponse } from "next/server";
import { runQuery } from "@/services/neo4jDriver";

export async function POST(request: NextRequest) {
  const { email, userId, name } = await request.json();

  if (!email || !userId || !name) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const query = `
  MERGE (u:User {id: $userId, email: $email, name: $name})
  RETURN u
  `;

  try {
    const result = await runQuery(query, { userId, email, name });
    return NextResponse.json(
      { message: "User created in Neo4j", user: result },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating user in Neo4j", error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { userId, phoneNumber } = await request.json();

  if (!userId || !phoneNumber) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const query = `
  MATCH (u:User {id: $userId})
  SET u.phoneNumber = $phoneNumber
  RETURN u
  `;

  try {
    const result = await runQuery(query, { userId, phoneNumber });
    return NextResponse.json(
      { message: "User updated in Neo4j", user: result },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating user in Neo4j", error },
      { status: 500 }
    );
  }
}
