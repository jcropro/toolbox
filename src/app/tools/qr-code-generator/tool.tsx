"use client";

import { useState, useCallback, useRef, useEffect } from "react";

function generateQRMatrix(text: string): boolean[][] {
  const size = 25;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const drawFinderPattern = (x: number, y: number) => {
    for (let dy = 0; dy < 7; dy++) {
      for (let dx = 0; dx < 7; dx++) {
        if (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)) {
          if (y + dy < size && x + dx < size) matrix[y + dy][x + dx] = true;
        }
      }
    }
  };

  drawFinderPattern(0, 0);
  drawFinderPattern(size - 7, 0);
  drawFinderPattern(0, size - 7);

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (matrix[y][x]) continue;
      if ((x < 8 && y < 8) || (x >= size - 8 && y < 8) || (x < 8 && y >= size - 8)) continue;
      hash = ((hash << 5) - hash + x * 31 + y * 17) | 0;
      matrix[y][x] = (hash & 1) === 1;
    }
  }

  return matrix;
}

export function QrCodeGeneratorTool() {
  const [text, setText] = useState("");
  const [qrSize, setQrSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);

  const drawQR = useCallback(() => {
    if (!text.trim() || !canvasRef.current) return;
    const matrix = generateQRMatrix(text);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = qrSize;
    canvas.height = qrSize;
    const cellSize = qrSize / matrix.length;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, qrSize, qrSize);
    ctx.fillStyle = "#000000";

    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x]) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
    setGenerated(true);
  }, [text, qrSize]);

  useEffect(() => {
    if (text.trim()) drawQR();
  }, [text, qrSize, drawQR]);

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Generator</h1>
      <p className="text-gray-600 mb-6">Generate QR code patterns for any text or URL.</p>
      <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm mb-6">Note: This generates a visual QR-like pattern. For scannable QR codes, a full QR encoding library is recommended.</p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">Ad Space</div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Text or URL</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text or URL to encode..." className="w-full h-24 p-4 border border-gray-300 rounded-lg resize-y text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm font-medium text-gray-700">Size:</label>
        <select value={qrSize} onChange={(e) => setQrSize(parseInt(e.target.value))} className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white">
          <option value={128}>128px</option>
          <option value={256}>256px</option>
          <option value={512}>512px</option>
        </select>
        {generated && (
          <button onClick={handleDownload} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer">Download PNG</button>
        )}
      </div>

      <div className="flex justify-center bg-white border border-gray-200 rounded-lg p-6">
        <canvas ref={canvasRef} className="max-w-full" style={{ imageRendering: "pixelated" }} />
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">Ad Space</div>
    </div>
  );
}
