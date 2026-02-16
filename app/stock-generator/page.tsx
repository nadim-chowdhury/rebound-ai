"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Shuffle,
  Copy,
  Check,
  Sparkles,
  Image as ImageIcon,
  Tag,
  FileText,
  ChevronRight,
  Layers,
  Maximize,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  generateImage,
  GENERATOR_CATEGORIES,
  RESOLUTIONS,
  GeneratorCategory,
} from "@/lib/generators";
import { generateMetadata } from "@/lib/stock-metadata";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

interface GeneratedImage {
  id: string;
  seed: number;
  category: GeneratorCategory;
  dataUrl: string;
  title: string;
  description: string;
  tags: string[];
  resolution: string;
  timestamp: number;
}

export default function StockGeneratorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<GeneratorCategory>("abstract");
  const [selectedResolution, setSelectedResolution] = useState(0);
  const [currentSeed, setCurrentSeed] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{
    title: string;
    description: string;
    tags: string[];
    category: string;
  } | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [batchCount, setBatchCount] = useState(1);
  const [batchProgress, setBatchProgress] = useState(0);
  const [isBatching, setIsBatching] = useState(false);

  // Generate preview
  const generatePreview = useCallback(() => {
    if (!canvasRef.current) return;
    setIsGenerating(true);

    requestAnimationFrame(() => {
      const seed = generateImage(
        canvasRef.current!,
        selectedCategory,
        800,
        450,
      );
      setCurrentSeed(seed);
      setPreviewUrl(canvasRef.current!.toDataURL("image/png"));

      const meta = generateMetadata(selectedCategory, seed);
      setMetadata(meta);
      setIsGenerating(false);
    });
  }, [selectedCategory]);

  // Generate on category change
  useEffect(() => {
    generatePreview();
  }, [selectedCategory, generatePreview]);

  // Download high-res
  const downloadImage = useCallback(
    (seed: number, cat: GeneratorCategory, resIdx: number) => {
      const canvas =
        downloadCanvasRef.current || document.createElement("canvas");
      const res = RESOLUTIONS[resIdx];

      generateImage(canvas, cat, res.width, res.height, seed);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;

          const link = document.createElement("a");
          link.download = `stock-${cat}-${seed}-${res.width}x${res.height}.jpg`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        },
        "image/jpeg",
        1.0,
      ); // max quality
    },
    [],
  );

  // Save to history + download
  const saveAndDownload = useCallback(() => {
    if (!currentSeed || !metadata || !previewUrl) return;

    const newImage: GeneratedImage = {
      id: `img_${Date.now()}`,
      seed: currentSeed,
      category: selectedCategory,
      dataUrl: previewUrl,
      title: metadata.title,
      description: metadata.description,
      tags: metadata.tags,
      resolution: RESOLUTIONS[selectedResolution].label,
      timestamp: Date.now(),
    };
    setHistory((prev) => [newImage, ...prev]);
    downloadImage(currentSeed, selectedCategory, selectedResolution);
  }, [
    currentSeed,
    metadata,
    previewUrl,
    selectedCategory,
    selectedResolution,
    downloadImage,
  ]);

  // Batch generate
  const batchGenerate = useCallback(async () => {
    if (isBatching) return;
    setIsBatching(true);
    setBatchProgress(0);

    const canvas = document.createElement("canvas");
    const res = RESOLUTIONS[selectedResolution];

    for (let i = 0; i < batchCount; i++) {
      setBatchProgress(i + 1);
      const seed = generateImage(
        canvas,
        selectedCategory,
        res.width,
        res.height,
      );
      const meta = generateMetadata(selectedCategory, seed);

      // Small preview
      const previewCanvas = document.createElement("canvas");
      generateImage(previewCanvas, selectedCategory, 400, 225, seed);

      const img: GeneratedImage = {
        id: `img_${Date.now()}_${i}`,
        seed,
        category: selectedCategory,
        dataUrl: previewCanvas.toDataURL("image/jpeg", 0.7),
        title: meta.title,
        description: meta.description,
        tags: meta.tags,
        resolution: res.label,
        timestamp: Date.now(),
      };
      setHistory((prev) => [img, ...prev]);

      // Download
      const link = document.createElement("a");
      link.download = `stock-${selectedCategory}-${seed}-${res.width}x${res.height}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      // Slight delay between downloads
      await new Promise((r) => setTimeout(r, 300));
    }

    setIsBatching(false);
    setBatchProgress(0);
  }, [batchCount, selectedCategory, selectedResolution, isBatching]);

  // Copy to clipboard
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyTags = () => {
    if (!metadata) return;
    copyToClipboard(metadata.tags.join(", "), "tags");
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Hidden canvases */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <canvas ref={downloadCanvasRef} style={{ display: "none" }} />

      {/* Header */}
      <header
        style={{
          padding: "16px 32px",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Link
          href="/"
          style={{
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          <ArrowLeft size={16} /> Back
        </Link>
        <div style={{ flex: 1 }} />
        <Sparkles size={20} style={{ color: "var(--accent)" }} />
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>
          Stock Image <span className="text-gradient">Generator</span>
        </h1>
      </header>

      <div style={{ padding: "24px 32px", maxWidth: 1600, margin: "0 auto" }}>
        {/* Category Selector */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <h2
            style={{
              fontSize: 14,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--text-tertiary)",
              marginBottom: 12,
            }}
          >
            <Layers size={14} style={{ display: "inline", marginRight: 6 }} />
            Choose Category
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 10,
              marginBottom: 24,
            }}
          >
            {GENERATOR_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id ? "glow-border" : ""}
                style={{
                  padding: "14px 12px",
                  borderRadius: 12,
                  border:
                    selectedCategory === cat.id
                      ? "1px solid rgba(16,185,129,0.4)"
                      : "1px solid var(--border-color)",
                  background:
                    selectedCategory === cat.id
                      ? "rgba(16,185,129,0.08)"
                      : "var(--surface)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  color: "var(--foreground)",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>{cat.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                  {cat.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-tertiary)",
                    lineHeight: 1.3,
                  }}
                >
                  {cat.description}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content: Preview + Metadata */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: 24,
            marginBottom: 24,
          }}
          className="generator-layout"
        >
          {/* Preview Panel */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="glass-card-static"
            style={{ padding: 20 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>
                <ImageIcon
                  size={16}
                  style={{ display: "inline", marginRight: 6 }}
                />
                Preview
              </h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={generatePreview}
                  className="btn-secondary"
                  disabled={isGenerating}
                  style={{ fontSize: 13, padding: "8px 14px" }}
                >
                  <Shuffle size={14} />
                  {isGenerating ? "Generating..." : "New Image"}
                </button>
                <button
                  onClick={saveAndDownload}
                  className="btn-primary"
                  style={{ fontSize: 13, padding: "8px 14px" }}
                  disabled={!currentSeed}
                >
                  <Download size={14} /> Download
                </button>
              </div>
            </div>

            {/* Canvas Preview */}
            <div
              style={{
                borderRadius: 10,
                overflow: "hidden",
                border: "1px solid var(--border-color)",
                marginBottom: 16,
                position: "relative",
              }}
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Generated preview"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              ) : (
                <div
                  style={{
                    height: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-tertiary)",
                  }}
                >
                  Click &quot;New Image&quot; to generate
                </div>
              )}
              {currentSeed && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    background: "rgba(0,0,0,0.7)",
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontSize: 11,
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Seed: {currentSeed}
                </div>
              )}
            </div>

            {/* Resolution + Batch */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <label
                  style={{
                    fontSize: 12,
                    color: "var(--text-tertiary)",
                    marginBottom: 6,
                    display: "block",
                  }}
                >
                  <Maximize
                    size={12}
                    style={{ display: "inline", marginRight: 4 }}
                  />
                  Resolution
                </label>
                <select
                  value={selectedResolution}
                  onChange={(e) =>
                    setSelectedResolution(Number(e.target.value))
                  }
                  className="glass-input"
                  style={{ padding: "8px 12px", fontSize: 13 }}
                >
                  {RESOLUTIONS.map((r, i) => (
                    <option key={i} value={i} style={{ background: "#0a0e1a" }}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ minWidth: 140 }}>
                <label
                  style={{
                    fontSize: 12,
                    color: "var(--text-tertiary)",
                    marginBottom: 6,
                    display: "block",
                  }}
                >
                  Batch Count
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={batchCount}
                  onChange={(e) =>
                    setBatchCount(
                      Math.max(1, Math.min(50, Number(e.target.value))),
                    )
                  }
                  className="glass-input"
                  style={{ padding: "8px 12px", fontSize: 13 }}
                />
              </div>
              <div style={{ paddingTop: 18 }}>
                <button
                  onClick={batchGenerate}
                  className="btn-primary"
                  disabled={isBatching}
                  style={{ fontSize: 13, padding: "8px 16px" }}
                >
                  {isBatching ? (
                    <>
                      ⏳ {batchProgress}/{batchCount}
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} /> Batch Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Metadata Panel */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="glass-card-static"
            style={{ padding: 20 }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              <FileText
                size={16}
                style={{ display: "inline", marginRight: 6 }}
              />
              Shutterstock Metadata
            </h3>

            {metadata ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {/* Title */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-tertiary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Title
                    </label>
                    <button
                      onClick={() => copyToClipboard(metadata.title, "title")}
                      className="btn-ghost"
                      style={{ padding: "4px 8px", fontSize: 11 }}
                    >
                      {copiedField === "title" ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                  <div
                    className="glass-input"
                    style={{
                      fontSize: 13,
                      lineHeight: 1.5,
                      cursor: "pointer",
                      minHeight: 44,
                    }}
                    onClick={() => copyToClipboard(metadata.title, "title")}
                  >
                    {metadata.title}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-tertiary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Description
                    </label>
                    <button
                      onClick={() =>
                        copyToClipboard(metadata.description, "desc")
                      }
                      className="btn-ghost"
                      style={{ padding: "4px 8px", fontSize: 11 }}
                    >
                      {copiedField === "desc" ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                  <div
                    className="glass-input"
                    style={{
                      fontSize: 13,
                      lineHeight: 1.6,
                      cursor: "pointer",
                      minHeight: 80,
                    }}
                    onClick={() =>
                      copyToClipboard(metadata.description, "desc")
                    }
                  >
                    {metadata.description}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      marginBottom: 6,
                      display: "block",
                    }}
                  >
                    Shutterstock Category
                  </label>
                  <div
                    className="badge badge-sent"
                    style={{ fontSize: 13, padding: "6px 14px" }}
                  >
                    {metadata.category}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-tertiary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      <Tag
                        size={11}
                        style={{ display: "inline", marginRight: 4 }}
                      />
                      Tags ({metadata.tags.length})
                    </label>
                    <button
                      onClick={copyTags}
                      className="btn-ghost"
                      style={{ padding: "4px 8px", fontSize: 11 }}
                    >
                      {copiedField === "tags" ? (
                        <>
                          <Check size={12} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> Copy All
                        </>
                      )}
                    </button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      maxHeight: 200,
                      overflow: "auto",
                    }}
                  >
                    {metadata.tags.map((tag, i) => (
                      <span
                        key={i}
                        onClick={() => copyToClipboard(tag, `tag_${i}`)}
                        style={{
                          background: "var(--surface-hover)",
                          border: "1px solid var(--border-color)",
                          borderRadius: 6,
                          padding: "3px 10px",
                          fontSize: 12,
                          color: "var(--text-secondary)",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Copy All Metadata */}
                <button
                  onClick={() => {
                    const full = `Title: ${metadata.title}\n\nDescription: ${metadata.description}\n\nCategory: ${metadata.category}\n\nKeywords: ${metadata.tags.join(", ")}`;
                    copyToClipboard(full, "all");
                  }}
                  className="btn-secondary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    fontSize: 13,
                  }}
                >
                  {copiedField === "all" ? (
                    <>
                      <Check size={14} /> Copied All Metadata!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy All Metadata
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div
                style={{
                  color: "var(--text-tertiary)",
                  textAlign: "center",
                  padding: 40,
                  fontSize: 14,
                }}
              >
                Generate an image to see metadata
              </div>
            )}
          </motion.div>
        </div>

        {/* History Grid */}
        {history.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>
                <ChevronRight
                  size={16}
                  style={{ display: "inline", marginRight: 4 }}
                />
                Generated This Session ({history.length})
              </h3>
              <button
                onClick={() => setHistory([])}
                className="btn-ghost"
                style={{ fontSize: 12, color: "var(--danger)" }}
              >
                <Trash2 size={13} /> Clear
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 12,
              }}
            >
              {history.map((img) => (
                <div
                  key={img.id}
                  className="glass-card"
                  style={{
                    overflow: "hidden",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  onClick={() =>
                    downloadImage(
                      img.seed,
                      img.category,
                      RESOLUTIONS.findIndex((r) => r.label === img.resolution),
                    )
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.dataUrl}
                    alt={img.title}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div style={{ padding: "8px 10px" }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        lineHeight: 1.3,
                        marginBottom: 4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {img.title}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--text-tertiary)",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{img.resolution}</span>
                      <span style={{ fontFamily: "var(--font-mono)" }}>
                        #{img.seed}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
