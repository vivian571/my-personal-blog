"use client";

import React, { useState, useEffect } from "react";
import { Lock, CheckCircle, RefreshCcw } from "lucide-react";

interface PaywallOverlayProps {
  articleId: string;
  price: number; 
  title: string;
  onUnlock: () => void;
}

export function PaywallOverlay({ articleId, price, title, onUnlock }: PaywallOverlayProps) {
  const [loading, setLoading] = useState(false);
  const [payUrl, setPayUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  // Poll for payment status once we have an order ID
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (orderId && !isPaid) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/payment/status?orderId=${orderId}`);
          const data = await res.json();
          if (data.isPaid) {
            setIsPaid(true);
            onUnlock(); // Call parent to remove blur
            clearInterval(interval);
          }
        } catch (e) {
          console.error("Failed to poll payment status", e);
        }
      }, 3000); // poll every 3 seconds
    }

    return () => clearInterval(interval);
  }, [orderId, isPaid, onUnlock]);

  const handleUnlockClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          amountInCents: price,
        }),
      });
      const data = await res.json();
      if (data.payUrl && data.orderId) {
        setPayUrl(data.payUrl);
        setOrderId(data.orderId);
      }
    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isPaid) return null; // Unlocked!

  return (
    <div className="relative mt-8">
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white pointer-events-none z-10 h-64 -top-64" />
      
      <div className="relative z-20 bg-slate-50 border border-slate-200 rounded-2xl p-8 md:p-12 text-center shadow-sm -mt-32">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={32} />
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-2">这是一篇私密/付费长文</h3>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          你正在阅读《{title}》的前半部分。解锁全文以获取核心认知架构与实操手册，支持创作者持续输出高质量内容。
        </p>

        {!payUrl ? (
          <button 
            onClick={handleUnlockClick}
            disabled={loading}
            className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-70"
          >
            {loading ? <RefreshCcw className="animate-spin" size={18} /> : `解锁全文 (¥${(price / 100).toFixed(2)})`}
          </button>
        ) : (
          <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm mb-4 inline-block">
              {/* Note: Use a real QR code library like qrcode.react in production to render payUrl */}
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(payUrl)}`} alt="Payment QR Code" className="w-32 h-32" />
            </div>
            <p className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <RefreshCcw className="animate-spin text-blue-500" size={14} /> 
              请使用微信扫码支付，支付成功后自动解锁
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
