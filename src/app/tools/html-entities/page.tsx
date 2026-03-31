import type { Metadata } from "next";
import { HtmlEntitiesTool } from "./tool";

export const metadata: Metadata = {
  title: "HTML Entity Encoder/Decoder - Free Online Tool",
  description:
    "Encode special characters to HTML entities or decode HTML entities back to characters. Includes a reference table of common HTML entities.",
  keywords: [
    "HTML entity encoder",
    "HTML entity decoder",
    "HTML entities",
    "encode HTML",
    "decode HTML",
    "special characters",
    "HTML ampersand",
    "HTML less than",
    "HTML greater than",
  ],
};

export default function HtmlEntitiesPage() {
  return <HtmlEntitiesTool />;
}
