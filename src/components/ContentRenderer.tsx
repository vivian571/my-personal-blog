"use client";

import React, { useState } from "react";
import { PaywallOverlay } from "./PaywallOverlay";

interface ContentRendererProps {
  contentHtml: string;
  isPaid: boolean;
  price: number;
  articleId: string;
  title: string;
}

export function ContentRenderer({ contentHtml, isPaid, price, articleId, title }: ContentRendererProps) {
  const [unlocked, setUnlocked] = useState(false);

  // Simple splitting strategy: Cut the HTML roughly in half for the preview
  // In a real robust system, you'd split by paragraph tags or at a specific `<!-- cut -->` marker
  
  let previewHtml = contentHtml;
  let lockedHtml = "";

  if (isPaid && !unlocked && contentHtml.length > 800) {
    // Cut the HTML roughly at 40% to show a teaser
    const splitIndex = Math.floor(contentHtml.length * 0.4);
    
    // Find the nearest closing paragraph tag to avoid breaking HTML structures
    const safeSplitIndex = contentHtml.indexOf("</p>", splitIndex);
    
    if (safeSplitIndex !== -1) {
      previewHtml = contentHtml.substring(0, safeSplitIndex + 4);
      lockedHtml = contentHtml.substring(safeSplitIndex + 4);
    }
  }

  return (
    <>
      {/* 免费试读部分 */}
      <div
        className="mt-8 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />

      {/* 付费隐藏部分 */}
      {isPaid && !unlocked && lockedHtml ? (
        <PaywallOverlay 
          articleId={articleId} 
          price={price} 
          title={title} 
          onUnlock={() => setUnlocked(true)} 
        />
      ) : null}

      {/* 解锁后的剩余部分 */}
      {unlocked && lockedHtml ? (
        <div
          className="leading-relaxed animate-in fade-in duration-1000"
          dangerouslySetInnerHTML={{ __html: lockedHtml }}
        />
      ) : null}
    </>
  );
}
