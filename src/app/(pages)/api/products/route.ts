import { NextResponse } from "next/server";
import { account } from "@/appwrite/config";
export async function GET() {
  return NextResponse.json({ message: account });
}
