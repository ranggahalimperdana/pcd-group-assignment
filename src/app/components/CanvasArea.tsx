import { useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, ImagePlus } from "lucide-react";
import { Button } from "./ui/button";

interface CanvasAreaProps {
  imageUrl: string | null;
  processedImageData: ImageData | null;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function CanvasArea({
  imageUrl,
  processedImageData,
  zoom,
  onZoomIn,
  onZoomOut,
}: CanvasAreaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (processedImageData) {
      // Draw processed image data
      canvas.width = processedImageData.width;
      canvas.height = processedImageData.height;
      ctx.putImageData(processedImageData, 0, 0);
    } else if (imageUrl) {
      // Draw original image
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = imageUrl;
    }
  }, [imageUrl, processedImageData]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-[300px] md:min-h-0">
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div
          className="relative transition-transform duration-200 ease-out"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
        >
          {imageUrl || processedImageData ? (
            <div className="relative shadow-lg ring-1 ring-black/5 rounded-sm">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full bg-white block rounded-sm"
              />
            </div>
          ) : (
            <div className="w-[600px] h-[400px] flex items-center justify-center bg-white rounded-xl border-2 border-dashed border-slate-200">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center">
                  <ImagePlus className="w-8 h-8 text-indigo-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Tidak ada gambar dipilih
                </h3>
                <p className="text-sm text-slate-500 max-w-[200px] mx-auto">
                  Unggah gambar dari sidebar untuk mulai mengedit
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="h-12 border-t border-slate-200 bg-white flex items-center justify-between px-4">
        <div className="text-xs text-slate-500 font-medium font-mono">
          {imageUrl || processedImageData ? 
            `${canvasRef.current?.width || 0} x ${canvasRef.current?.height || 0}px` : 
            "Siap"
          }
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomOut}
            disabled={zoom <= 0.5}
            className="h-8 w-8 p-0 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-medium text-slate-700 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomIn}
            disabled={zoom >= 2}
            className="h-8 w-8 p-0 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}