import type { Metadata } from "next";
import { CronGeneratorTool } from "./tool";

export const metadata: Metadata = {
  title: "Cron Expression Generator - Free Crontab Tool",
  description:
    "Build cron expressions visually with dropdowns and presets. See plain English explanations and the next 5 scheduled run times. Free online crontab generator.",
  keywords: [
    "cron expression generator",
    "crontab generator",
    "cron schedule",
    "cron builder",
    "crontab tool",
    "cron job scheduler",
    "cron syntax",
    "cron next run",
  ],
};

export default function CronGeneratorPage() {
  return <CronGeneratorTool />;
}
