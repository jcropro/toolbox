import type { Metadata } from "next";
import { HashGeneratorTool } from "./tool";

export const metadata: Metadata = {
  title: "Hash Generator - Free Online SHA-256, MD5 Hash Tool",
  description:
    "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes instantly. Free online hash generator with copy buttons. No data sent to servers.",
  keywords: [
    "hash generator",
    "sha256 generator",
    "md5 generator",
    "sha1 hash",
    "sha512 hash",
    "online hash tool",
    "checksum generator",
  ],
};

export default function HashGeneratorPage() {
  return <HashGeneratorTool />;
}
