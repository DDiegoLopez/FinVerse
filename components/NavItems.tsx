"use client";

import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItems() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  return (
    <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
      {NAV_ITEMS.map(({ label, href }) => (
        <li key={href}>
          <Link
            href={href}
            className={`${
              isActive(href)
                ? "text-yellow-500"
                : "text-gray-400 hover:text-yellow-500 transition-colors"
            }`}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
