import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { createGatewayOrder } from "@/lib/payment";

export async function POST(req: NextRequest) {
	try {
		const { articleId, amountInCents, sessionId, guestEmail, userId } = await req.json();

		if (!articleId || !amountInCents) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		// 1. Generate internal Order ID
		const internalOrderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

		// 2. Call the abstract Sign-Free Gateway (Hupijiao/XPay)
		const gatewayResult = await createGatewayOrder(internalOrderId, {
			articleId,
			amountInCents,
			sessionId,
			guestEmail,
			userId
		});

		// 3. Save "pending" order to database using Drizzle ORM
		await db.insert(orders).values({
			id: internalOrderId,
			gatewayOrderId: gatewayResult.gatewayOrderId,
			amount: amountInCents.toString(),
			status: "pending",
			articleId,
			sessionId: sessionId || null,
			guestEmail: guestEmail || null,
			userId: userId || null,
			payUrl: gatewayResult.payUrl,
			gatewayData: JSON.stringify(gatewayResult.rawResponse),
		});

		// 4. Return the Payment URL / QR Code to Frontend
		return NextResponse.json({
			orderId: internalOrderId,
			payUrl: gatewayResult.payUrl,
			status: "pending"
		});

	} catch (error) {
		console.error("[PAYMENT_CREATE_ERROR]", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
