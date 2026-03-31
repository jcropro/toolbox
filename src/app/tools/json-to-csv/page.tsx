import type { Metadata } from "next";
import { JsonToCsvTool } from "./tool";

export const metadata: Metadata = {
  title: "JSON to CSV Converter - Free Online JSON Conversion Tool",
  description:
    "Convert JSON arrays to CSV format online for free. Custom delimiters, proper escaping, and instant download. No data sent to any server.",
  keywords: [
    "json to csv",
    "json converter",
    "csv converter",
    "json to csv online",
    "convert json to csv",
    "json array to csv",
    "free csv converter",
  ],
};

export default function JsonToCsvPage() {
  return <JsonToCsvTool />;
}
