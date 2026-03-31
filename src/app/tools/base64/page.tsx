import type { Metadata } from "next";
import { Base64Tool } from "./tool";

export const metadata: Metadata = {
  title: "Base64 Encoder/Decoder - Free Online Base64 Tool",
  description:
    "Encode and decode Base64 strings and files online for free. Auto-detects Base64 input. Supports file uploads. Private and secure.",
  keywords: [
    "base64 encoder",
    "base64 decoder",
    "base64 converter",
    "encode base64",
    "decode base64",
    "base64 file encoder",
    "base64 online tool",
  ],
};

export default function Base64Page() {
  return <Base64Tool />;
}
