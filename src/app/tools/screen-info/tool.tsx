"use client";

import { useState, useEffect, useCallback } from "react";

interface ScreenData {
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  availWidth: number;
  availHeight: number;
  devicePixelRatio: number;
  colorDepth: number;
  orientation: string;
  touchEnabled: boolean;
  userAgent: string;
}

function gather(): ScreenData {
  const orientationType =
    typeof screen !== "undefined" && screen.orientation
      ? screen.orientation.type
      : "unknown";

  let orientationLabel = "Unknown";
  if (orientationType.includes("landscape")) orientationLabel = "Landscape";
  else if (orientationType.includes("portrait")) orientationLabel = "Portrait";
  else if (typeof window !== "undefined") {
    orientationLabel =
      window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
  }

  return {
    screenWidth: typeof screen !== "undefined" ? screen.width : 0,
    screenHeight: typeof screen !== "undefined" ? screen.height : 0,
    viewportWidth: typeof window !== "undefined" ? window.innerWidth : 0,
    viewportHeight: typeof window !== "undefined" ? window.innerHeight : 0,
    availWidth: typeof screen !== "undefined" ? screen.availWidth : 0,
    availHeight: typeof screen !== "undefined" ? screen.availHeight : 0,
    devicePixelRatio:
      typeof window !== "undefined" ? window.devicePixelRatio : 1,
    colorDepth: typeof screen !== "undefined" ? screen.colorDepth : 0,
    orientation: orientationLabel,
    touchEnabled:
      typeof navigator !== "undefined"
        ? navigator.maxTouchPoints > 0 ||
          "ontouchstart" in (typeof window !== "undefined" ? window : {})
        : false,
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
  };
}

function InfoCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export function ScreenInfoTool() {
  const [data, setData] = useState<ScreenData | null>(null);

  const refresh = useCallback(() => {
    setData(gather());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("resize", refresh);
    const mql = window.matchMedia("(orientation: portrait)");
    mql.addEventListener("change", refresh);
    return () => {
      window.removeEventListener("resize", refresh);
      mql.removeEventListener("change", refresh);
    };
  }, [refresh]);

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-500">Detecting screen information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Screen Resolution Checker
      </h1>
      <p className="text-gray-600 mb-6">
        See detailed information about your display, browser viewport, and
        device capabilities. All values update in real time when you resize
        your window.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <InfoCard
          label="Screen Resolution"
          value={`${data.screenWidth} x ${data.screenHeight}`}
          sub="Physical screen pixels"
        />
        <InfoCard
          label="Browser Viewport"
          value={`${data.viewportWidth} x ${data.viewportHeight}`}
          sub="CSS pixels inside the browser"
        />
        <InfoCard
          label="Available Screen"
          value={`${data.availWidth} x ${data.availHeight}`}
          sub="Excludes taskbar / dock"
        />
        <InfoCard
          label="Device Pixel Ratio"
          value={`${data.devicePixelRatio.toFixed(2)}x`}
          sub="Physical pixels per CSS pixel"
        />
        <InfoCard
          label="Color Depth"
          value={`${data.colorDepth}-bit`}
          sub={
            data.colorDepth >= 24 ? "True Color (16M+ colors)" : "Limited palette"
          }
        />
        <InfoCard
          label="Orientation"
          value={data.orientation}
          sub={
            data.screenWidth > data.screenHeight
              ? "Width > Height"
              : data.screenWidth < data.screenHeight
              ? "Height > Width"
              : "Square"
          }
        />
        <InfoCard
          label="Touch Support"
          value={data.touchEnabled ? "Yes" : "No"}
          sub={
            data.touchEnabled
              ? "Touch input detected"
              : "No touch input detected"
          }
        />
        <InfoCard
          label="Effective Resolution"
          value={`${Math.round(data.screenWidth * data.devicePixelRatio)} x ${Math.round(data.screenHeight * data.devicePixelRatio)}`}
          sub="Hardware pixels (screen x DPR)"
        />
      </div>

      {/* User agent */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          User Agent String
        </p>
        <p className="text-sm text-gray-700 font-mono break-all leading-relaxed">
          {data.userAgent}
        </p>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          About This Screen Info Tool
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          This tool reads your device and browser properties to display screen
          resolution, viewport dimensions, device pixel ratio, color depth,
          orientation, and touch support. Values update live when you resize
          your browser. Useful for designers, developers, and anyone
          troubleshooting display issues. Nothing is sent to a server &mdash;
          all detection happens in your browser.
        </p>
      </section>
    </div>
  );
}
