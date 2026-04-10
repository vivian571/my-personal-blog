import crypto from "crypto";

export interface CreateOrderParams {
	articleId: string;
	amountInCents: number;
	sessionId?: string;
	guestEmail?: string;
	userId?: string;
}

export interface PaymentGatewayResponse {
	gatewayOrderId: string;
	payUrl: string; // The URL to the QR Code or checkout page
	rawResponse: any;
}

/**
 * Creates an order via the third-party sign-free gateway (Hupijiao / Xunhu).
 */
export async function createGatewayOrder(
	internalOrderId: string,
	params: CreateOrderParams
): Promise<PaymentGatewayResponse> {
	const appId = process.env.HUPIJIAO_APP_ID;
	const appSecret = process.env.HUPIJIAO_APP_SECRET;

	if (!appId || !appSecret) {
		throw new Error("Missing Gateway Keys (HUPIJIAO_APP_ID or HUPIJIAO_APP_SECRET) in .env.local");
	}

	// Hupijiao expects total_fee as a float string in RMB (e.g. 9.90)
	const totalFee = (params.amountInCents / 100).toFixed(2);
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

	const payload: Record<string, string> = {
		version: "1.1",
		appid: appId,
		trade_order_id: internalOrderId,
		total_fee: totalFee,
		title: `Asset Unlock: ${params.articleId}`,
		time: Math.floor(Date.now() / 1000).toString(),
		notify_url: `${baseUrl}/api/payment/webhook`,
		return_url: `${baseUrl}/posts/${params.articleId}`,
	};

	// 1. Sort keys alphabetically, filter empty values
	const keys = Object.keys(payload).filter(k => payload[k] !== "").sort();
	
	// 2. Concatenate key=value joined by &
	// 3. Append app_secret at the end
	const signString = keys.map(k => `${k}=${payload[k]}`).join("&") + appSecret;
	
	// 4. Generate MD5 hash natively
	const signature = crypto.createHash("md5").update(signString, "utf8").digest("hex").toLowerCase();
	payload.hash = signature;

	console.log(`[PAYMENT] Triggering Hupijiao Order: ${internalOrderId} | Amount: ${totalFee} RMB`);

	// Form URLEncoded submission
	const formData = new URLSearchParams();
	for (const key of Object.keys(payload)) {
		formData.append(key, payload[key]);
	}

	try {
		const response = await fetch("https://api.xunhupay.com/payment/do.html", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: formData.toString()
		});

		const data = await response.json();

		if (data.errcode !== 0) {
			console.error(`[PAYMENT] Gateway Error:`, data.errmsg);
			throw new Error(data.errmsg || "API configuration mismatch with payment provider.");
		}

		return {
			gatewayOrderId: data.order_id || data.openid || `gw_${internalOrderId}`,
			payUrl: data.url_qrcode || data.url, // `url_qrcode` is the direct QR code image link
			rawResponse: data
		};
	} catch (error) {
		console.error(`[PAYMENT] Transaction Creation Failed!`, error);
		throw error;
	}
}

/**
 * Validates the webhook signature from Hupijiao to prevent fake callback tampering.
 */
export function verifyWebhookSignature(payload: Record<string, any>, signature: string): boolean {
	const appSecret = process.env.HUPIJIAO_APP_SECRET || '';
	if (!appSecret) return false;

	// Ignore internal signature fields like 'hash' or 'sign' during validation
	const keys = Object.keys(payload).filter(k => k !== "hash" && k !== "sign" && payload[k] !== null && payload[k] !== undefined && payload[k] !== "").sort();
	
	const signString = keys.map(k => `${k}=${payload[k]}`).join("&") + appSecret;
	const computedSignature = crypto.createHash("md5").update(signString, "utf8").digest("hex").toLowerCase();

	console.log(`[PAYMENT] Signature valid? ${computedSignature === signature.toLowerCase()}`);
	
	return computedSignature === signature.toLowerCase();
}
