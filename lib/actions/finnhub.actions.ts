"use server";

import { POPULAR_STOCK_SYMBOLS } from "@/lib/constants";
import { cache } from "react";

// Local types used only within this module
type FinnhubSearchResult = {
  symbol: string;
  description?: string;
  displaySymbol?: string;
  type?: string;
  // Internal passthrough for profile-based exchange when using popular symbols
  __exchange?: string;
};

type FinnhubSearchResponse = {
  result: FinnhubSearchResult[];
};

type StockItem = {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
};

type FinnhubProfile2 = {
  name?: string;
  ticker?: string;
  exchange?: string;
};

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const NEXT_PUBLIC_FINNHUB_API_KEY =
  process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? "";

async function fetchJSON<T>(
  url: string,
  revalidateSeconds?: number
): Promise<T> {
  const options: RequestInit & { next?: { revalidate?: number } } =
    revalidateSeconds
      ? { cache: "force-cache", next: { revalidate: revalidateSeconds } }
      : { cache: "no-store" };

  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export const searchStocks = cache(
  async (query?: string): Promise<StockItem[]> => {
    try {
      const token = process.env.FINNHUB_API_KEY ?? NEXT_PUBLIC_FINNHUB_API_KEY;
      if (!token) {
        // If no token, log and return empty to avoid throwing per requirements
        console.error(
          "Error in stock search:",
          new Error("FINNHUB API key is not configured")
        );
        return [];
      }

      const trimmed = typeof query === "string" ? query.trim() : "";

      let results: FinnhubSearchResult[] = [];

      if (!trimmed) {
        // Fetch top 10 popular symbols' profiles
        const top = POPULAR_STOCK_SYMBOLS.slice(0, 10);
        const profiles = await Promise.all(
          top.map(async (sym) => {
            try {
              const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(
                sym
              )}&token=${token}`;
              // Revalidate every hour
              const profile = await fetchJSON<FinnhubProfile2>(url, 3600);
              return { sym, profile } as {
                sym: string;
                profile: FinnhubProfile2 | null;
              };
            } catch (e) {
              console.error("Error fetching profile2 for", sym, e);
              return { sym, profile: null } as {
                sym: string;
                profile: FinnhubProfile2 | null;
              };
            }
          })
        );

        results = profiles
          .map(({ sym, profile }) => {
            const symbol = sym.toUpperCase();
            const name: string | undefined =
              profile?.name || profile?.ticker || undefined;
            const exchange: string | undefined = profile?.exchange || undefined;
            if (!name) return undefined;
            const r: FinnhubSearchResult = {
              symbol,
              description: name,
              displaySymbol: symbol,
              type: "Common Stock",
            };
            // We don't include exchange in FinnhubSearchResult type, so carry via mapping later using profile
            // To keep pipeline simple, attach exchange via closure map stage
            // We'll reconstruct exchange when mapping to final type
            r.__exchange = exchange; // internal only
            return r;
          })
          .filter((x): x is FinnhubSearchResult => Boolean(x));
      } else {
        const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(
          trimmed
        )}&token=${token}`;
        const data = await fetchJSON<FinnhubSearchResponse>(url, 1800);
        results = Array.isArray(data?.result) ? data.result : [];
      }

      const mapped: StockItem[] = results
        .map((r) => {
          const upper = (r.symbol || "").toUpperCase();
          const name = r.description || upper;
          const exchangeFromDisplay =
            (r.displaySymbol as string | undefined) || undefined;
          const exchangeFromProfile = r.__exchange;
          const exchange = exchangeFromDisplay || exchangeFromProfile || "US";
          const type = r.type || "Stock";
          const item: StockItem = {
            symbol: upper,
            name,
            exchange,
            type,
          };
          return item;
        })
        .slice(0, 15);

      return mapped;
    } catch (err) {
      console.error("Error in stock search:", err);
      return [];
    }
  }
);
