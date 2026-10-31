import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "loot.json");

export async function GET() {
  if (!fs.existsSync(filePath)) return NextResponse.json([]);
  const data = fs.readFileSync(filePath, "utf8");
  return NextResponse.json(JSON.parse(data || "[]"));
}

export async function DELETE() {
  fs.writeFileSync(filePath, JSON.stringify([], null, 2));
  return NextResponse.json({ success: true });
}
