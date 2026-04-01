import type { Metadata } from "next";
import { CompoundInterestTool } from "./tool";

export const metadata: Metadata = {
  title: "Compound Interest Calculator - Free Investment Growth Tool",
  description:
    "Calculate compound interest with monthly contributions. See year-by-year growth, total interest earned, and final balance. Free investment calculator online.",
  keywords: [
    "compound interest calculator",
    "investment calculator",
    "savings calculator",
    "interest rate calculator",
    "compound growth",
    "investment growth calculator",
    "retirement calculator",
  ],
};

export default function CompoundInterestPage() {
  return <CompoundInterestTool />;
}
