"use client";

import { useState, useCallback, useRef } from "react";

export function ImageToBase64Tool() {
  const [base64Output, setBase64Output] = useState("");
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [copied, setCopied] = useState(false);
  const [decodeInput, setDecodeInput] = useState("");
  const [decodedPreview, setDecodedPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + " KB");
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      setBase64Output(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + " KB");
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      setBase64Output(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!base64Output) return;
    try {
      await navigator.clipboard.writeText(base64Output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = base64Output;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [base64Output]);

  const handleDecode = useCallback(() => {
    const trimmed = decodeInput.trim();
    if (!trimmed) return;
    if (trimmed.startsWith("data:image")) {
      setDecodedPreview(trimmed);
    } else {
      setDecodedPreview("data:image/png;base64," + trimmed);
    }
  }, [decodeInput]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Image to Base64 Converter</h1>
      <p className="text-gray-600 mb-6">Convert images to Base64 data URIs or decode Base64 strings back to images.</p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">Ad Space</div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer mb-6"
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        <p className="text-gray-600 mb-1">Drag and drop an image here, or click to browse</p>
        {fileName && <p className="text-sm text-gray-400">{fileName} ({fileSize})</p>}
      </div>

      {preview && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
          <img src={preview} alt="Preview" className="max-h-64 mx-auto" />
        </div>
      )}

      {base64Output && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Base64 Data URI</label>
            <button onClick={handleCopy} className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <textarea value={base64Output} readOnly className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-xs bg-gray-50 focus:outline-none resize-y" />
        </div>
      )}

      <hr className="my-8 border-gray-200" />

      <h2 className="text-xl font-semibold text-gray-900 mb-3">Decode Base64 to Image</h2>
      <textarea
        value={decodeInput}
        onChange={(e) => setDecodeInput(e.target.value)}
        placeholder="Paste a Base64 data URI or raw Base64 image string..."
        className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y mb-3"
      />
      <button onClick={handleDecode} disabled={!decodeInput.trim()} className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium cursor-pointer disabled:opacity-40 mb-4">Decode to Image</button>

      {decodedPreview && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Decoded Image</p>
          <img src={decodedPreview} alt="Decoded" className="max-h-64 mx-auto" />
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">Ad Space</div>
    </div>
  );
}
