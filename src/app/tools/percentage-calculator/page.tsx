import type { Metadata } from "next";
import { PercentageCalculatorTool } from "./tool";

export const metadata: Metadata = {
  title: "Percentage Calculator - Free Online Percent Tool",
  description:
    "Calculate percentages easily. Find what percent of a number is, percentage change, increase, decrease, and more. Free online percentage calculator with step-by-step explanations.",
  keywords: [
    "percentage calculator",
    "percent calculator",
    "percentage change",
    "percentage increase",
    "percentage decrease",
    "what percent of",
    "calculate percentage",
  ],
};

export default function PercentageCalculatorPage() {
  return <PercentageCalculatorTool />;
}
