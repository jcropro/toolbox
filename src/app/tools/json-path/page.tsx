import type { Metadata } from "next";
import { JsonPathTool } from "./tool";

export const metadata: Metadata = {
  title: "JSON Path Finder - Free Online JSON Explorer Tool",
  description:
    "Paste JSON and click any value to see its path in dot notation and bracket notation. Collapsible tree view with search functionality.",
  keywords: [
    "json path finder",
    "json explorer",
    "json tree viewer",
    "json path",
    "json navigator",
    "json browser",
    "json dot notation",
    "json bracket notation",
  ],
};

export default function JsonPathPage() {
  return <JsonPathTool />;
}
