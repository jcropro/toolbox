import type { Metadata } from "next";
import { CountdownTimerTool } from "./tool";

export const metadata: Metadata = {
  title: "Countdown Timer - Free Online Event Countdown",
  description:
    "Set a countdown to any date and time. See days, hours, minutes, and seconds ticking down live. Name your event and share the link. Free, no signup required.",
  keywords: [
    "countdown timer",
    "event countdown",
    "online timer",
    "date countdown",
    "countdown clock",
    "free countdown",
    "timer to date",
  ],
};

export default function CountdownTimerPage() {
  return <CountdownTimerTool />;
}
