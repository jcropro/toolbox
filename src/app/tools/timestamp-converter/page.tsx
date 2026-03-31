import type { Metadata } from "next";
import { TimestampConverterTool } from "./tool";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter - Free Online Epoch Time Tool",
  description:
    "Convert Unix timestamps to human-readable dates and vice versa. Live clock, timezone support, and relative time display. Free online epoch converter.",
  keywords: [
    "unix timestamp converter",
    "epoch converter",
    "timestamp to date",
    "date to timestamp",
    "unix time",
    "epoch time",
    "online timestamp tool",
  ],
};

export default function TimestampConverterPage() {
  return <TimestampConverterTool />;
}
