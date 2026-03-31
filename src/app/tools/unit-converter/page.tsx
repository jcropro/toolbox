import type { Metadata } from "next";
import { UnitConverterTool } from "./tool";

export const metadata: Metadata = {
  title: "Unit Converter - Free Online Length, Weight, Temperature Tool",
  description:
    "Convert between units of length, weight, temperature, volume, area, speed, and data storage. Free online unit converter with real-time results.",
  keywords: [
    "unit converter",
    "length converter",
    "weight converter",
    "temperature converter",
    "volume converter",
    "area converter",
    "speed converter",
    "data converter",
    "bytes to MB",
    "kg to lbs",
    "celsius to fahrenheit",
  ],
};

export default function UnitConverterPage() {
  return <UnitConverterTool />;
}
