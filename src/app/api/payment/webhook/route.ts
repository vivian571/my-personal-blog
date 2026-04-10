import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { verifyWebhookSignature } from "@/lib/payment";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
	try {
		// Parse the incoming JSON or Form Data from the payment gateway
		const payload = await req.json().catch(() => ({}));
		
		// In a real scenario, you might get the signature from headers or the payload itself
		// e.g. req.headers.get("x-pay-signature") or payload.sign
		const signature = payload.sign || req.headers.get("x-signature") || "";

		// 1. Verify the payload authenticity
		const isValid = verifyWebhookSignature(payload, signature);
		if (!isValid) {
			console.warn("[PAYMENT_WEBHOOK] Invalid signature detected.");
			return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
		}

		// 2. Extract out the known fields from your chosen gateway
		// Often gateways send back: order_id (their side) and out_trade_no (your `internalOrderId`)
		const internalOrderId = payload.out_trade_no || payload.orderId;
		const gatewayTradeStatus = payload.status || payload.trade_status; 

		if (!internalOrderId) {
			return NextResponse.json({ error: "Missing order ID in webhook payload" }, { status: 400 });
		}

		// 3. Update the database if the status implies success
		// Depending on the gateway, "success" / "paid" / "TRADE_SUCCESS" might be used
		if (gatewayTradeStatus === "success" || gatewayTradeStatus === "paid" || gatewayTradeStatus === "TRADE_SUCCESS") {
			console.log(`[PAYMENT_WEBHOOK] Order ${internalOrderId} successfully paid. Updating database.`);
			
			await db.update(orders)
				.set({ 
					status: "paid",
					paidAt: new Date()
				})
				.where(eq(orders.id, internalOrderId));
		}

		// 4. Acknowledge the webhook so the gateway stops retrying
		return NextResponse.json({ message: "success", code: 200 });

	} catch (error) {
		console.error("[PAYMENT_WEBHOOK_ERROR]", error);
		// It's still a good idea to return 200 or 500 depending on if you want the gateway to retry
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
