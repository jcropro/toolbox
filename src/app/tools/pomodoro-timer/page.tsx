import type { Metadata } from "next";
import { PomodoroTimerTool } from "./tool";

export const metadata: Metadata = {
  title: "Pomodoro Timer - Free Online Focus Timer Tool",
  description:
    "Stay focused with a customizable Pomodoro timer. Set work, break, and long break durations. Audio notifications and session tracking. Free online tool.",
  keywords: [
    "pomodoro timer",
    "focus timer",
    "productivity timer",
    "work timer",
    "break timer",
    "pomodoro technique",
    "online timer",
    "study timer",
  ],
};

export default function PomodoroTimerPage() {
  return <PomodoroTimerTool />;
}
