import type { Metadata } from "next";
import { UrlEncoderTool } from "./tool";

export const metadata: Metadata = {
  title: "URL Encoder/Decoder - Free Online URL Encoding Tool",
  description:
    "Encode and decode URLs and URI components instantly. Handles special characters, query strings, and full URLs. Free online URL encoder/decoder tool.",
  keywords: [
    "url encoder",
    "url decoder",
    "percent encoding",
    "uri encoder",
    "url encode online",
    "decode url",
    "encodeURIComponent",
  ],
};

export default function UrlEncoderPage() {
  return <UrlEncoderTool />;
}
