import type { Metadata } from "next";
import { CsvToJsonTool } from "./tool";

export const metadata: Metadata = {
  title: "CSV to JSON - Free Online CSV Converter Tool",
  description:
    "Convert CSV data to JSON format instantly. Supports custom delimiters, file upload, and header detection. Free online CSV to JSON converter.",
  keywords: [
    "csv to json",
    "csv converter",
    "csv to json converter",
    "convert csv",
    "csv parser",
    "online csv tool",
    "data converter",
  ],
};

export default function CsvToJsonPage() {
  return <CsvToJsonTool />;
}
