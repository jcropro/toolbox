import type { Metadata } from "next";
import { BmiCalculatorTool } from "./tool";

export const metadata: Metadata = {
  title: "BMI Calculator - Free Body Mass Index Calculator",
  description:
    "Calculate your Body Mass Index (BMI) instantly with imperial or metric units. See your BMI category and where you fall on the scale. Free, private, no sign-up.",
  keywords: [
    "bmi calculator",
    "body mass index",
    "bmi chart",
    "bmi scale",
    "weight calculator",
    "health calculator",
    "ideal weight",
  ],
};

export default function BmiCalculatorPage() {
  return <BmiCalculatorTool />;
}
