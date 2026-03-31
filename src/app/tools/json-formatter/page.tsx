import type { Metadata } from "next";
import { JsonFormatterTool } from "./tool";

export const metadata: Metadata = {
  title: "JSON Formatter - Free Online JSON Beautifier & Validator",
  description:
    "Format, beautify, minify, and validate JSON data online for free. Instant error detection with line numbers. No data sent to any server.",
  keywords: [
    "json formatter",
    "json beautifier",
    "json validator",
    "json minifier",
    "json pretty print",
    "json lint",
    "format json online",
  ],
};

export default function JsonFormatterPage() {
  return <JsonFormatterTool />;
}
