import type { Metadata } from "next";
import { WhiteboardTool } from "./tool";

export const metadata: Metadata = {
  title: "Online Whiteboard - Free Drawing & Sketch Tool",
  description:
    "Free online whiteboard with drawing tools, color picker, brush sizes, shapes, undo/redo, and PNG export. No signup required.",
  keywords: [
    "online whiteboard",
    "drawing tool",
    "sketch tool",
    "canvas drawing",
    "free whiteboard",
    "digital drawing",
    "paint online",
    "drawing app",
  ],
};

export default function WhiteboardPage() {
  return <WhiteboardTool />;
}
