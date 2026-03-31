import type { Metadata } from "next";
import { NumberBaseConverterTool } from "./tool";

export const metadata: Metadata = {
  title: "Number Base Converter - Binary, Hex, Octal, Decimal",
  description:
    "Convert numbers between binary, octal, decimal, hexadecimal, and custom bases (2-36). Real-time conversion with instant results. Free online tool.",
  keywords: [
    "number base converter",
    "binary converter",
    "hex converter",
    "octal converter",
    "decimal converter",
    "base converter",
    "radix converter",
    "binary to hex",
    "hex to decimal",
  ],
};

export default function NumberBaseConverterPage() {
  return <NumberBaseConverterTool />;
}
