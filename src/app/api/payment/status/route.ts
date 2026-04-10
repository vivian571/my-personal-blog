import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
	try {
		const orderId = req.nextUrl.searchParams.get("orderId");

		if (!orderId) {
			return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
		}

		// Query Postgres using Drizzle ORM for the current order status
		const orderRecord = await db.select({ status: orders.status })
			.from(orders)
			.where(eq(orders.id, orderId))
			.limit(1);

		if (orderRecord.length === 0) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		const currentStatus = orderRecord[0].status;

		return NextResponse.json({
			orderId,
			status: currentStatus, // e.g. "pending", "paid", "failed"
			isPaid: currentStatus === "paid",
		});

	} catch (error) {
		console.error("[PAYMENT_STATUS_ERROR]", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
