import { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { ToolsSidebar } from "./components/ToolsSidebar";
import { CanvasArea } from "./components/CanvasArea";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

/* ===== Image Processing ===== */
import { applyGrayscale } from "./utils/image-processing/grayscale";
import { applyBrightnessContrast } from "./utils/image-processing/adjustments";
import {
  generateHistogram,
  analyzeHistogram,
  HistogramAnalysis,
} from "./utils/image-processing/histogram";
import { applyThreshold } from "./utils/image-processing/threshold";
import { applyEdgeDetection } from "./utils/image-processing/edgeDetection";

/* ===== TYPES ===== */
export type ToolType =
  | "grayscale"
  | "brightness"
  | "threshold"
  | "histogram"
  | "edge"
  | null;

export type EdgeMethod =
  | "sobel"
  | "roberts"
  | "prewitt"
  | "laplace"
  | "frei-chen";

interface Project {
  id: string;
  name: string;
  date: string;
  imageUrl: string;
}

export default function App() {
  /* ===== STATE ===== */
  const [currentView, setCurrentView] = useState<"home" | "editor">("home");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [originalImageData, setOriginalImageData] =
    useState<ImageData | null>(null);
  const [processedImageData, setProcessedImageData] =
    useState<ImageData | null>(null);

  /* Edge */
  const [edgeImageData, setEdgeImageData] =
    useState<ImageData | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const [selectedTool, setSelectedTool] = useState<ToolType>(null);
  const [selectedEdgeMethod, setSelectedEdgeMethod] =
    useState<EdgeMethod>("sobel");

  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [threshold, setThreshold] = useState(128);
  const [zoom, setZoom] = useState(1);

  const [histogramData, setHistogramData] =
    useState<{ value: number; count: number }[] | null>(null);
  const [histogramAnalysis, setHistogramAnalysis] =
    useState<HistogramAnalysis | null>(null);

  const [projects] = useState<Project[]>([]);

  /* ===== UPLOAD IMAGE ===== */
  const handleUploadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setOriginalFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        setImageUrl(url);
        setCurrentView("editor");

        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          ctx.drawImage(img, 0, 0);
          const data = ctx.getImageData(0, 0, img.width, img.height);

          setOriginalImageData(data);
          setProcessedImageData(null);
          setEdgeImageData(null);
          setHistogramData(null);
          setHistogramAnalysis(null);
        };
        img.src = url;
      };

      reader.readAsDataURL(file);
      toast.success("Gambar berhasil diunggah");
    },
    []
  );

  /* ===== APPLY (NON EDGE) ===== */
  const handleApply = () => {
    if (!originalImageData) {
      toast.error("Upload gambar dulu");
      return;
    }

    let result: ImageData | null = null;

    switch (selectedTool) {
      case "grayscale":
        result = applyGrayscale(originalImageData);
        break;

      case "brightness":
        result = applyBrightnessContrast(
          originalImageData,
          brightness,
          contrast
        );
        break;

      case "threshold":
        result = applyThreshold(originalImageData, threshold);
        break;

      case "histogram": {
        const src = processedImageData || originalImageData;
        const hist = generateHistogram(src);
        const analysis = analyzeHistogram(hist);
        setHistogramData(hist);
        setHistogramAnalysis(analysis);
        toast.success("Histogram generated");
        return;
      }

      case "edge":
        toast.info("Deteksi tepi realtime");
        return;
    }

    if (result) {
      setProcessedImageData(result);
      toast.success("Processing applied");
    }
  };

  /* ===== EDGE → BACKEND (ONCE) ===== */
  useEffect(() => {
    if (selectedTool === "edge" && originalFile) {
      applyEdgeDetection(
        originalFile,
        selectedEdgeMethod,
        threshold // 🔥 WAJIB
      ).then((edge) => {
        setEdgeImageData(edge);
        setProcessedImageData(edge);
      });
    }
  }, [selectedTool, selectedEdgeMethod, originalFile]);

  /* ===== EDGE THRESHOLD → REALTIME FRONTEND ===== */
  useEffect(() => {
    if (selectedTool === "edge" && edgeImageData) {
      setProcessedImageData(
        applyThreshold(edgeImageData, threshold)
      );
    }
  }, [threshold, edgeImageData, selectedTool]);

  /* ===== RESET ===== */
  const handleReset = () => {
    setProcessedImageData(null);
    setEdgeImageData(null);
    setBrightness(0);
    setContrast(0);
    setThreshold(128);
    setHistogramData(null);
    setHistogramAnalysis(null);
    toast.info("Reset ke gambar asli");
  };

  /* ===== DOWNLOAD ===== */
  const handleDownload = () => {
    if (!processedImageData) return;

    const canvas = document.createElement("canvas");
    canvas.width = processedImageData.width;
    canvas.height = processedImageData.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.putImageData(processedImageData, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `processed-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  /* ===== RENDER ===== */
  return (
    <div className="h-screen flex flex-col">
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        hasImage={!!imageUrl}
        isLoggedIn={false}
        onLoginClick={() => {}}
        onRegisterClick={() => {}}
      />

      {currentView === "home" ? (
        <HomePage
          onUploadImage={handleUploadImage}
          onStartEditing={() => setCurrentView("editor")}
          isLoggedIn={false}
          projects={projects}
          onLoadProject={() => {}}
        />
      ) : (
        /* 🔥 RESPONSIVE LAYOUT */
        <div className="flex-1 flex flex-col md:flex-row overflow-auto">
          <ToolsSidebar
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
            onUploadImage={handleUploadImage}
          />

          <CanvasArea
            imageUrl={imageUrl}
            processedImageData={processedImageData}
            zoom={zoom}
            onZoomIn={() => setZoom((z) => Math.min(2, z + 0.1))}
            onZoomOut={() => setZoom((z) => Math.max(0.5, z - 0.1))}
          />

          <PropertiesPanel
            selectedTool={selectedTool}
            brightness={brightness}
            contrast={contrast}
            threshold={threshold}
            selectedEdgeMethod={selectedEdgeMethod}
            onBrightnessChange={(v) => setBrightness(v[0])}
            onContrastChange={(v) => setContrast(v[0])}
            onThresholdChange={(v) => setThreshold(v[0])}
            onEdgeMethodChange={setSelectedEdgeMethod}
            onApply={handleApply}
            onReset={handleReset}
            onDownload={handleDownload}
            histogramData={histogramData}
            histogramAnalysis={histogramAnalysis}
            hasProcessedImage={processedImageData !== null}
          />
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
}
