import type { Metadata } from "next";
import { ElectricityCalculatorTool } from "./tool";

export const metadata: Metadata = {
  title: "Electricity Cost Calculator - Free Power Usage Estimator",
  description:
    "Calculate electricity costs for any appliance. Enter watts and hours to see daily, monthly, and yearly costs. Compare multiple appliances with common presets. Free online calculator.",
  keywords: [
    "electricity cost calculator",
    "power usage estimator",
    "energy cost calculator",
    "appliance electricity cost",
    "kwh calculator",
    "electric bill calculator",
    "watt to cost",
  ],
};

export default function ElectricityCalculatorPage() {
  return <ElectricityCalculatorTool />;
}
