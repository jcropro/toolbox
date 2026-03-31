import type { Metadata } from "next";
import { UuidGeneratorTool } from "./tool";

export const metadata: Metadata = {
  title: "UUID Generator - Free Online UUID/GUID Generator",
  description:
    "Generate random UUID v4 identifiers instantly. Bulk generate up to 100 UUIDs at once. Copy individual or all UUIDs with one click.",
  keywords: [
    "uuid generator",
    "guid generator",
    "uuid v4",
    "random uuid",
    "bulk uuid generator",
    "unique identifier",
    "online uuid tool",
  ],
};

export default function UuidGeneratorPage() {
  return <UuidGeneratorTool />;
}
