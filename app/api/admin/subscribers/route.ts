import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { preLaunchSignups } from "@/db/schema";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey || key !== adminKey) return unauthorized();

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  const rows = await db
    .select()
    .from(preLaunchSignups)
    .orderBy(desc(preLaunchSignups.createdAt));

  const format = request.nextUrl.searchParams.get("format");

  if (format === "csv") {
    const header = "id,email,segment,locale,interested_customer,interested_welper,comment,created_at";
    const csvRows = rows.map((r) =>
      [
        r.id,
        `"${r.email.replace(/"/g, '""')}"`,
        r.segment,
        r.locale,
        r.interestedCustomer,
        r.interestedWelper,
        r.comment ? `"${r.comment.replace(/"/g, '""').replace(/\n/g, " ")}"` : "",
        r.createdAt.toISOString(),
      ].join(",")
    );
    const csv = [header, ...csvRows].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({ subscribers: rows, total: rows.length });
}
