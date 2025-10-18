import { useEffect, useRef } from "react";
import { CANDLE_CHART_WIDGET_CONFIG } from "@/lib/constants";

export default function useTradingView(
  scriptUrl: string,
  config: Record<string, unknown>,
  height: number
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (containerRef.current.dataset.loaded) return;

    containerRef.current.innerHTML = `<div class="tradingview-widget-container__widget" style="width: 100%; height: ${height}px;"></div>`;

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    containerRef.current.appendChild(script);
    containerRef.current.dataset.loaded = "true";

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.dataset.loaded = "false";
      }
    };
  }, [scriptUrl, config, height]);

  return containerRef;
}
