"use client";

import { useState, useCallback, useEffect } from "react";

function formatDate(date: Date): string {
  return date.toLocaleString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short",
  });
}

function getRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const absDiff = Math.abs(diff);
  const future = diff < 0;
  const prefix = future ? "in " : "";
  const suffix = future ? "" : " ago";
  if (absDiff < 1000) return "just now";
  if (absDiff < 60000) return prefix + Math.floor(absDiff / 1000) + " seconds" + suffix;
  if (absDiff < 3600000) return prefix + Math.floor(absDiff / 60000) + " minutes" + suffix;
  if (absDiff < 86400000) return prefix + Math.floor(absDiff / 3600000) + " hours" + suffix;
  if (absDiff < 2592000000) return prefix + Math.floor(absDiff / 86400000) + " days" + suffix;
  return prefix + Math.floor(absDiff / 31536000000) + " years" + suffix;
}

export function TimestampConverterTool() {
  const [timestamp, setTimestamp] = useState("");
  const [dateString, setDateString] = useState("");
  const [result, setResult] = useState<{ local: string; utc: string; iso: string; relative: string; unix: number } | null>(null);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTimestampConvert = useCallback(() => {
    setError("");
    const ts = parseInt(timestamp.trim(), 10);
    if (isNaN(ts)) { setError("Enter a valid Unix timestamp."); return; }
    const ms = ts > 1e12 ? ts : ts * 1000;
    const date = new Date(ms);
    if (isNaN(date.getTime())) { setError("Invalid timestamp."); return; }
    setResult({ local: formatDate(date), utc: date.toUTCString(), iso: date.toISOString(), relative: getRelativeTime(date), unix: Math.floor(ms / 1000) });
  }, [timestamp]);

  const handleDateConvert = useCallback(() => {
    setError("");
    if (!dateString.trim()) { setError("Enter a valid date string."); return; }
    const date = new Date(dateString.trim());
    if (isNaN(date.getTime())) { setError("Could not parse that date."); return; }
    setResult({ local: formatDate(date), utc: date.toUTCString(), iso: date.toISOString(), relative: getRelativeTime(date), unix: Math.floor(date.getTime() / 1000) });
  }, [dateString]);

  const handleNow = useCallback(() => {
    const date = new Date();
    setResult({ local: formatDate(date), utc: date.toUTCString(), iso: date.toISOString(), relative: "just now", unix: Math.floor(date.getTime() / 1000) });
    setTimestamp(Math.floor(date.getTime() / 1000).toString());
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Unix Timestamp Converter</h1>
      <p className="text-gray-600 mb-6">Convert Unix timestamps to human-readable dates and vice versa.</p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">Ad Space</div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 text-center">
        <p className="text-sm text-gray-500 mb-1">Current Unix Timestamp</p>
        <p className="text-lg font-mono font-bold text-blue-600">{Math.floor(now / 1000)}</p>
        <p className="text-sm text-gray-600">{formatDate(new Date(now))}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Unix Timestamp</label>
          <input type="text" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} placeholder="e.g. 1700000000" className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white mb-2" />
          <button onClick={handleTimestampConvert} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer">Convert Timestamp</button>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Date String</label>
          <input type="text" value={dateString} onChange={(e) => setDateString(e.target.value)} placeholder="e.g. 2024-01-15" className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white mb-2" />
          <button onClick={handleDateConvert} className="w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium cursor-pointer">Convert Date</button>
        </div>
      </div>

      <button onClick={handleNow} className="mb-6 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer">Use Current Time</button>

      {error && <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium bg-red-50 text-red-800 border border-red-200">{error}</div>}

      {result && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div><span className="text-xs text-gray-500 uppercase">Unix Timestamp</span><p className="font-mono font-bold">{result.unix}</p></div>
          <div><span className="text-xs text-gray-500 uppercase">Local Time</span><p>{result.local}</p></div>
          <div><span className="text-xs text-gray-500 uppercase">UTC</span><p>{result.utc}</p></div>
          <div><span className="text-xs text-gray-500 uppercase">ISO 8601</span><p className="font-mono text-sm">{result.iso}</p></div>
          <div><span className="text-xs text-gray-500 uppercase">Relative</span><p>{result.relative}</p></div>
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">Ad Space</div>
    </div>
  );
}
