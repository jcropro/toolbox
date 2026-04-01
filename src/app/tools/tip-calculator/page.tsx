import type { Metadata } from "next";
import { TipCalculatorTool } from "./tool";

export const metadata: Metadata = {
  title: "Tip Calculator - Free Bill Splitter & Tip Calculator",
  description:
    "Calculate tips and split bills instantly. Choose preset or custom tip percentages, divide among any number of people. Free online tip calculator.",
  keywords: [
    "tip calculator",
    "bill splitter",
    "split bill calculator",
    "gratuity calculator",
    "restaurant tip",
    "tip percentage calculator",
    "how much to tip",
  ],
};

export default function TipCalculatorPage() {
  return <TipCalculatorTool />;
}
