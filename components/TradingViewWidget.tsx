// TradingViewWidget.jsx
"use client";
import React, { useEffect, useRef, memo } from "react";
import useTradingView from "@/hooks/useTradingView";
import { cn } from "@/lib/utils";

interface TradingViewWidgetProps {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
}

function TradingViewWidget({
  title,
  scriptUrl,
  config,
  height = 600,
  className,
}: TradingViewWidgetProps) {
  const containerRef = useTradingView(scriptUrl, config, height);

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-2xl font-semibold text-gray-100 mb-3">{title}</h3>
      )}
      <div
        className={cn("tradingview-widget-container", className)}
        ref={containerRef}
      >
        <div
          className="tradingview-widget-container__widget"
          style={{ height, width: "100%" }}
        ></div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
