import type { Metadata } from "next";
import { DiffCheckerTool } from "./tool";

export const metadata: Metadata = {
  title: "Diff Checker - Free Online Text Comparison Tool",
  description:
    "Compare two texts and see differences highlighted line by line. Added lines in green, removed in red. Free online diff checker with line numbers.",
  keywords: [
    "diff checker",
    "text comparison",
    "text diff",
    "compare text online",
    "find differences",
    "code diff",
    "line by line comparison",
  ],
};

export default function DiffCheckerPage() {
  return <DiffCheckerTool />;
}
