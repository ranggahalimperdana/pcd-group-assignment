import { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { ToolsSidebar } from "./components/ToolsSidebar";
import { CanvasArea } from "./components/CanvasArea";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { applyGrayscale } from "./utils/image-processing/grayscale";
import { applyBrightnessContrast } from "./utils/image-processing/adjustments";
import { generateHistogram } from "./utils/image-processing/histogram";
import { applyThreshold } from "./utils/image-processing/threshold";
import { applyEdgeDetection } from "./utils/image-processing/edgeDetection";

interface Project {
  id: string;
  name: string;
  date: string;
  imageUrl: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "editor">("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(
    null
  );
  const [processedImageData, setProcessedImageData] =
    useState<ImageData | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedEdgeMethod, setSelectedEdgeMethod] = useState<string>("sobel");
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [threshold, setThreshold] = useState(128);
  const [zoom, setZoom] = useState(1);
  const [histogramData, setHistogramData] = useState<
    { value: number; count: number }[] | null
  >(null);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load projects from localStorage
  useEffect(() => {
    if (isLoggedIn) {
      const savedProjects = localStorage.getItem("imageflow_projects");
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    }
  }, [isLoggedIn]);

  // Auto-save current project
  useEffect(() => {
    if (isLoggedIn && imageUrl) {
      const project: Project = {
        id: Date.now().toString(),
        name: `Project ${new Date().toLocaleDateString()}`,
        date: new Date().toLocaleString(),
        imageUrl,
      };

      const existingProjects = [...projects];
      const updatedProjects = [project, ...existingProjects.slice(0, 9)]; // Keep last 10 projects
      setProjects(updatedProjects);
      localStorage.setItem(
        "imageflow_projects",
        JSON.stringify(updatedProjects)
      );
    }
  }, [imageUrl, isLoggedIn]);

  const handleUploadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setImageUrl(url);
        setCurrentView("editor"); // Switch to editor view automatically

        // Load image to get ImageData
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            setOriginalImageData(imageData);
            setProcessedImageData(null);
          }
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
      toast.success("Image uploaded successfully");
    },
    []
  );

  const handleLoginClick = () => {
    toast.info("Fitur Login sedang dalam pengembangan");
  };

  const handleRegisterClick = () => {
    toast.info("Fitur Registrasi sedang dalam pengembangan");
  };

  const handleApply = () => {
    if (!originalImageData) {
      toast.error("Please upload an image first");
      return;
    }

    let result: ImageData | null = null;

    switch (selectedTool) {
      case "grayscale":
        result = applyGrayscale(originalImageData);
        toast.success("Grayscale applied");
        break;
      case "brightness":
        result = applyBrightnessContrast(
          originalImageData,
          brightness,
          contrast
        );
        toast.success("Brightness & Contrast applied");
        break;
      case "histogram":
        const data = generateHistogram(originalImageData);
        setHistogramData(data);
        toast.success("Histogram generated");
        return;
      case "threshold":
        result = applyThreshold(originalImageData, threshold);
        toast.success("Thresholding applied");
        break;
      case "edge":
        // Pass threshold only if needed, or always? 
        // Let's pass it if we want binary edges. For now let's pass it to allow adjustment.
        // But the user might want soft edges.
        // Let's add a "useThreshold" toggle or just use the threshold value.
        // For simplicity, let's just pass it.
        result = applyEdgeDetection(originalImageData, selectedEdgeMethod, threshold);
        toast.success(`Edge detection (${selectedEdgeMethod}) applied`);
        break;
    }

    if (result) {
      setProcessedImageData(result);
    }
  };

  const handleReset = () => {
    setProcessedImageData(null);
    setBrightness(0);
    setContrast(0);
    setThreshold(128);
    setHistogramData(null);
    toast.info("Reset to original image");
  };

  const handleDownload = () => {
    if (!processedImageData) {
      toast.error("No processed image to download");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = processedImageData.width;
    canvas.height = processedImageData.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.putImageData(processedImageData, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `processed-image-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
          toast.success("Image downloaded successfully");
        }
      });
    }
  };

  const handleLoadProject = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      setImageUrl(project.imageUrl);
      setCurrentView("editor");
      toast.success("Project loaded");
    }
  };

  return (
    <div className="h-screen flex flex-col font-sans">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
        currentView={currentView}
        onViewChange={setCurrentView}
        hasImage={!!imageUrl}
      />

      {currentView === "home" ? (
        <HomePage
          isLoggedIn={isLoggedIn}
          onStartEditing={() => setCurrentView("editor")}
          projects={projects}
          onLoadProject={handleLoadProject}
          onUploadImage={handleUploadImage}
        />
      ) : (
        <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
          <ToolsSidebar
            onToolSelect={setSelectedTool}
            selectedTool={selectedTool}
            onUploadImage={handleUploadImage}
          />
          <CanvasArea
            imageUrl={imageUrl}
            processedImageData={processedImageData}
            zoom={zoom}
            onZoomIn={() => setZoom(Math.min(2, zoom + 0.1))}
            onZoomOut={() => setZoom(Math.max(0.5, zoom - 0.1))}
          />
          <PropertiesPanel
            selectedTool={selectedTool}
            brightness={brightness}
            contrast={contrast}
            threshold={threshold}
            selectedEdgeMethod={selectedEdgeMethod}
            onBrightnessChange={(value) => setBrightness(value[0])}
            onContrastChange={(value) => setContrast(value[0])}
            onThresholdChange={(value) => setThreshold(value[0])}
            onEdgeMethodChange={setSelectedEdgeMethod}
            onApply={handleApply}
            onReset={handleReset}
            onDownload={handleDownload}
            histogramData={histogramData}
            hasProcessedImage={processedImageData !== null}
          />
        </div>
      )}
      <Toaster />
    </div>
  );
}
