"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Tool = "pen" | "eraser" | "line" | "rectangle" | "circle";

interface HistoryEntry {
  data: ImageData;
}

export function WhiteboardTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const snapshotRef = useRef<ImageData | null>(null);

  const PRESET_COLORS = [
    "#000000", "#ffffff", "#ef4444", "#f97316", "#eab308",
    "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280",
  ];

  const getCtx = useCallback(() => {
    return canvasRef.current?.getContext("2d") ?? null;
  }, []);

  const saveToHistory = useCallback(() => {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    const data = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ data });
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex((prev) => {
      const clipped = Math.min(prev + 1, 49);
      return clipped;
    });
  }, [getCtx, historyIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([{ data }]);
      setHistoryIndex(0);
    }
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    setIsDrawing(true);
    const pos = getPos(e);
    setStartPos(pos);

    if (currentTool === "pen" || currentTool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = currentTool === "eraser" ? brushSize * 3 : brushSize;
      ctx.strokeStyle = currentTool === "eraser" ? "#ffffff" : color;
    }

    snapshotRef.current = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    const pos = getPos(e);

    if (currentTool === "pen" || currentTool === "eraser") {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (startPos && snapshotRef.current) {
      ctx.putImageData(snapshotRef.current, 0, 0);
      ctx.beginPath();
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = color;
      ctx.lineCap = "round";

      if (currentTool === "line") {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (currentTool === "rectangle") {
        const w = pos.x - startPos.x;
        const h = pos.y - startPos.y;
        ctx.strokeRect(startPos.x, startPos.y, w, h);
      } else if (currentTool === "circle") {
        const rx = Math.abs(pos.x - startPos.x) / 2;
        const ry = Math.abs(pos.y - startPos.y) / 2;
        const cx = startPos.x + (pos.x - startPos.x) / 2;
        const cy = startPos.y + (pos.y - startPos.y) / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setStartPos(null);
      snapshotRef.current = null;
      saveToHistory();
    }
  };

  const undo = () => {
    if (historyIndex <= 0) return;
    const ctx = getCtx();
    if (!ctx) return;
    const newIndex = historyIndex - 1;
    ctx.putImageData(history[newIndex].data, 0, 0);
    setHistoryIndex(newIndex);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const ctx = getCtx();
    if (!ctx) return;
    const newIndex = historyIndex + 1;
    ctx.putImageData(history[newIndex].data, 0, 0);
    setHistoryIndex(newIndex);
  };

  const clearCanvas = () => {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveToHistory();
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const tools: { id: Tool; label: string; icon: string }[] = [
    { id: "pen", label: "Pen", icon: "✏" },
    { id: "eraser", label: "Eraser", icon: "⬜" },
    { id: "line", label: "Line", icon: "╱" },
    { id: "rectangle", label: "Rectangle", icon: "▭" },
    { id: "circle", label: "Circle", icon: "○" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Online Whiteboard</h1>
      <p className="text-gray-600 mb-6">
        A free drawing canvas with pen, eraser, shapes, and color tools. Draw, sketch, or diagram
        anything and download it as a PNG.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Tools */}
          <div className="flex gap-1">
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => setCurrentTool(t.id)}
                title={t.label}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-lg transition ${
                  currentTool === t.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t.icon}
              </button>
            ))}
          </div>

          <div className="w-px h-8 bg-gray-200" />

          {/* Color Picker */}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0"
              title="Pick color"
            />
            <div className="flex gap-1">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition ${
                    color === c ? "border-blue-500 scale-110" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div className="w-px h-8 bg-gray-200" />

          {/* Brush Size */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Size</label>
            <input
              type="range"
              min="1"
              max="30"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-gray-500 w-6">{brushSize}</span>
          </div>

          <div className="w-px h-8 bg-gray-200" />

          {/* Actions */}
          <div className="flex gap-1">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Undo"
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Redo"
            >
              Redo
            </button>
            <button
              onClick={clearCanvas}
              className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              Clear
            </button>
            <button
              onClick={downloadPng}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Download PNG
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair"
          style={{ height: "500px" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>
    </div>
  );
}
