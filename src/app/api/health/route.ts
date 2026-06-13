import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Basic DB check
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json(
      { 
        status: "ok", 
        timestamp: new Date().toISOString(),
        service: "trade-journal-api"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Database connection failed" 
      },
      { status: 503 }
    );
  }
}
