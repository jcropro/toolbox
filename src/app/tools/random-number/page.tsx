import type { Metadata } from "next";
import { RandomNumberTool } from "./tool";

export const metadata: Metadata = {
  title: "Random Number Generator - Dice Roller & Coin Flipper",
  description:
    "Generate random numbers with custom ranges, roll dice (d4-d20), and flip coins. Options for duplicates and sorting. Free online tool.",
  keywords: [
    "random number generator",
    "dice roller",
    "coin flipper",
    "random number",
    "rng",
    "d20 roller",
    "random dice",
    "coin flip",
  ],
};

export default function RandomNumberPage() {
  return <RandomNumberTool />;
}
