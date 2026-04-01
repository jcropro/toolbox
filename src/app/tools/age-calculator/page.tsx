import type { Metadata } from "next";
import { AgeCalculatorTool } from "./tool";

export const metadata: Metadata = {
  title: "Age Calculator - How Old Am I? Free Date Calculator",
  description:
    "Find your exact age in years, months, and days. See your zodiac sign, day of the week you were born, days until your next birthday, and total time lived.",
  keywords: [
    "age calculator",
    "how old am i",
    "date of birth calculator",
    "birthday calculator",
    "zodiac sign calculator",
    "days lived calculator",
    "age in days",
  ],
};

export default function AgeCalculatorPage() {
  return <AgeCalculatorTool />;
}
