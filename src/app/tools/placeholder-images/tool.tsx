"use client";

import { useState, useCallback } from "react";

interface ImageConfig {
  id: number;
  width: number;
  height: number;
  grayscale: boolean;
  blur: number;
}

let nextId = 2;

function buildUrl(cfg: ImageConfig): string {
  let url = `https://picsum.photos/${cfg.width}/${cfg.height}`;
  const params: string[] = [];
  if (cfg.grayscale) params.push("grayscale");
  if (cfg.blur > 0) params.push(`blur=${cfg.blur}`);
  if (params.length > 0) url += "?" + params.join("&");
  return url;
}

function buildHtml(cfg: ImageConfig): string {
  const url = buildUrl(cfg);
  return `<img src="${url}" alt="Placeholder image" width="${cfg.width}" height="${cfg.height}" />`;
}

function buildMarkdown(cfg: ImageConfig): string {
  const url = buildUrl(cfg);
  return `![Placeholder image](${url})`;
}

export function PlaceholderImagesTool() {
  const [images, setImages] = useState<ImageConfig[]>([
    { id: 1, width: 600, height: 400, grayscale: false, blur: 0 },
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [count, setCount] = useState(1);

  const addImage = useCallback(() => {
    setImages((prev) => [
      ...prev,
      {
        id: nextId++,
        width: 600,
        height: 400,
        grayscale: false,
        blur: 0,
      },
    ]);
  }, []);

  const generateMultiple = useCallback(() => {
    const n = Math.max(1, Math.min(count, 20));
    const newImages: ImageConfig[] = [];
    for (let i = 0; i < n; i++) {
      newImages.push({
        id: nextId++,
        width: 600,
        height: 400,
        grayscale: false,
        blur: 0,
      });
    }
    setImages(newImages);
  }, [count]);

  const removeImage = useCallback(
    (id: number) => {
      if (images.length <= 1) return;
      setImages((prev) => prev.filter((img) => img.id !== id));
    },
    [images.length]
  );

  const updateImage = useCallback(
    (
      id: number,
      field: keyof Omit<ImageConfig, "id">,
      value: number | boolean
    ) => {
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, [field]: value } : img))
      );
    },
    []
  );

  const copyText = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(key);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(key);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Placeholder Image Generator
      </h1>
      <p className="text-gray-600 mb-6">
        Generate placeholder image URLs using Lorem Picsum. Set dimensions, add
        grayscale or blur effects, and copy the URL, HTML, or Markdown. No API
        key needed &mdash; images are served directly from picsum.photos.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Batch controls */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <button
          onClick={addImage}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer"
        >
          + Add Image
        </button>
        <div className="flex items-center gap-2 text-sm">
          <label className="text-gray-700 font-medium">Generate</label>
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm bg-white"
          />
          <span className="text-gray-700 font-medium">at once</span>
          <button
            onClick={generateMultiple}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
          >
            Go
          </button>
        </div>
      </div>

      {/* Image cards */}
      <div className="space-y-6">
        {images.map((img, index) => {
          const url = buildUrl(img);
          const html = buildHtml(img);
          const md = buildMarkdown(img);

          return (
            <div
              key={img.id}
              className="border border-gray-200 rounded-xl p-4 bg-white"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Image {index + 1}
                </span>
                <button
                  onClick={() => removeImage(img.id)}
                  disabled={images.length <= 1}
                  className="text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium cursor-pointer"
                >
                  Remove
                </button>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={5000}
                    value={img.width}
                    onChange={(e) =>
                      updateImage(
                        img.id,
                        "width",
                        Math.max(10, parseInt(e.target.value) || 10)
                      )
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={5000}
                    value={img.height}
                    onChange={(e) =>
                      updateImage(
                        img.id,
                        "height",
                        Math.max(10, parseInt(e.target.value) || 10)
                      )
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Blur (0-10)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={img.blur}
                    onChange={(e) =>
                      updateImage(img.id, "blur", parseInt(e.target.value))
                    }
                    className="w-full mt-1"
                  />
                  <span className="text-xs text-gray-400 font-mono">
                    {img.blur}
                  </span>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={img.grayscale}
                      onChange={(e) =>
                        updateImage(img.id, "grayscale", e.target.checked)
                      }
                      className="rounded border-gray-300"
                    />
                    Grayscale
                  </label>
                </div>
              </div>

              {/* Preview */}
              <div className="mb-4 bg-gray-100 rounded-lg p-2 flex justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Placeholder ${img.width}x${img.height}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: 300,
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Copy buttons and URL display */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-50 px-3 py-1.5 rounded text-xs font-mono text-gray-700 truncate border border-gray-200">
                    {url}
                  </code>
                  <button
                    onClick={() => copyText(url, `url-${img.id}`)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium cursor-pointer whitespace-nowrap"
                  >
                    {copiedId === `url-${img.id}` ? "Copied!" : "Copy URL"}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyText(html, `html-${img.id}`)}
                    className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-xs font-medium cursor-pointer"
                  >
                    {copiedId === `html-${img.id}`
                      ? "Copied!"
                      : "Copy HTML"}
                  </button>
                  <button
                    onClick={() => copyText(md, `md-${img.id}`)}
                    className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-xs font-medium cursor-pointer"
                  >
                    {copiedId === `md-${img.id}`
                      ? "Copied!"
                      : "Copy Markdown"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          About This Tool
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Generates placeholder image URLs from Lorem Picsum (picsum.photos), a
          free service that serves random high-quality photos. Set any width and
          height, apply grayscale or blur effects (1&ndash;10), and copy the URL,
          an HTML img tag, or Markdown image syntax. Generate multiple images at
          once for rapid prototyping.
        </p>
      </section>
    </div>
  );
}
