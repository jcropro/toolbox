import type { Metadata } from "next";
import { HabitTrackerTool } from "./tool";

export const metadata: Metadata = {
  title: "Habit Tracker - Free Online Daily Habit Checker",
  description:
    "Track your daily habits with a simple 7-day grid. Check off completed habits, view streaks, and stay consistent. Data saved locally in your browser.",
  keywords: [
    "habit tracker",
    "daily habits",
    "habit checker",
    "streak tracker",
    "habit grid",
    "routine tracker",
    "goal tracker",
    "productivity tool",
  ],
};

export default function HabitTrackerPage() {
  return <HabitTrackerTool />;
}
