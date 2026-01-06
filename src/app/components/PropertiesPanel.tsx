import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  RotateCcw,
  Check,
  Download,
  Info,
  Lightbulb,
} from "lucide-react";
import {
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { HistogramAnalysis } from "../utils/image-processing/histogram";

/* ===============================
   TYPES (HARUS SAMA DENGAN App.tsx)
================================ */
export type ToolType =
  | "grayscale"
  | "brightness"
  | "threshold"
  | "histogram"
  | "edge";

export type EdgeMethod =
  | "sobel"
  | "roberts"
  | "prewitt"
  | "laplace"
  | "frei-chen";

interface PropertiesPanelProps {
  selectedTool: ToolType | null;

  brightness: number;
  contrast: number;
  threshold: number;
  selectedEdgeMethod: EdgeMethod;

  onBrightnessChange: (value: number[]) => void;
  onContrastChange: (value: number[]) => void;
  onThresholdChange: (value: number[]) => void;
  onEdgeMethodChange: (value: EdgeMethod) => void;

  onApply: () => void;
  onReset: () => void;
  onDownload: () => void;

  histogramData: { value: number; count: number }[] | null;
  histogramAnalysis?: HistogramAnalysis | null;
  hasProcessedImage: boolean;
}

/* ===============================
   COMPONENT
================================ */
export function PropertiesPanel({
  selectedTool,
  brightness,
  contrast,
  threshold,
  selectedEdgeMethod,
  onBrightnessChange,
  onContrastChange,
  onThresholdChange,
  onEdgeMethodChange,
  onApply,
  onReset,
  onDownload,
  histogramData,
  histogramAnalysis,
  hasProcessedImage,
}: PropertiesPanelProps) {
  return (
    <div className="w-full md:w-80 bg-white border-l border-slate-200 flex flex-col">
      {/* HEADER */}
      <div className="p-4 border-b">
        <h3 className="text-xs font-semibold text-slate-500 uppercase">
          Properti
        </h3>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {!selectedTool && (
          <div className="text-center py-12">
            <Info className="w-8 h-8 mx-auto text-slate-400 mb-3" />
            <p className="text-sm font-medium">
              Tidak ada alat dipilih
            </p>
            <p className="text-xs text-slate-500">
              Pilih alat dari sidebar
            </p>
          </div>
        )}

        {/* ================= GRAYSCALE ================= */}
        {selectedTool === "grayscale" && (
          <div className="p-4 bg-slate-50 rounded border text-sm">
            Ubah gambar menjadi skala abu-abu.
            <br />
            Tidak ada parameter yang perlu diatur.
          </div>
        )}

        {/* ================= BRIGHTNESS & CONTRAST ================= */}
        {selectedTool === "brightness" && (
          <div className="space-y-4">
            <div>
              <Label>Kecerahan</Label>
              <Input
                type="number"
                value={brightness}
                min={-100}
                max={100}
                onChange={(e) =>
                  onBrightnessChange([Number(e.target.value)])
                }
              />
              <Slider
                value={[brightness]}
                min={-100}
                max={100}
                step={1}
                onValueChange={onBrightnessChange}
              />
            </div>

            <div>
              <Label>Kontras</Label>
              <Input
                type="number"
                value={contrast}
                min={-100}
                max={100}
                onChange={(e) =>
                  onContrastChange([Number(e.target.value)])
                }
              />
              <Slider
                value={[contrast]}
                min={-100}
                max={100}
                step={1}
                onValueChange={onContrastChange}
              />
            </div>
          </div>
        )}

        {/* ================= THRESHOLD ================= */}
        {selectedTool === "threshold" && (
          <div className="space-y-2">
            <Label>Ambang Batas</Label>
            <Input
              type="number"
              min={0}
              max={255}
              value={threshold}
              onChange={(e) =>
                onThresholdChange([Number(e.target.value)])
              }
            />
            <Slider
              value={[threshold]}
              min={0}
              max={255}
              step={1}
              onValueChange={onThresholdChange}
            />
          </div>
        )}

        {/* ================= HISTOGRAM ================= */}
        {selectedTool === "histogram" && (
          <div className="space-y-4">
            {histogramData && histogramData.length > 0 ? (
              <>
                <div className="bg-white p-4 rounded border">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={histogramData}>
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill="#6366f1"
                      />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Gelap</span>
                    <span>Terang</span>
                  </div>
                </div>

                {histogramAnalysis && (
                  <div className="p-4 rounded border bg-yellow-50 text-sm">
                    <div className="flex gap-2 items-start">
                      <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">
                          {histogramAnalysis.title}
                        </p>
                        <p className="text-xs">
                          {histogramAnalysis.description}
                        </p>
                        <p className="text-xs mt-2 font-medium">
                          👉 {histogramAnalysis.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500">
                Klik Terapkan untuk menghasilkan histogram
              </p>
            )}
          </div>
        )}

        {/* ================= EDGE DETECTION ================= */}
        {selectedTool === "edge" && (
          <div className="space-y-4">
            <div>
              <Label>Metode Deteksi Tepi</Label>
              <Select
                value={selectedEdgeMethod}
                onValueChange={(v) =>
                  onEdgeMethodChange(v as EdgeMethod)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sobel">Sobel</SelectItem>
                  <SelectItem value="roberts">Roberts</SelectItem>
                  <SelectItem value="prewitt">Prewitt</SelectItem>
                  <SelectItem value="laplace">Laplace</SelectItem>
                  <SelectItem value="frei-chen">Frei-Chen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Ambang Batas (Threshold)</Label>
              <Input
                type="number"
                min={0}
                max={255}
                value={threshold}
                onChange={(e) =>
                  onThresholdChange([Number(e.target.value)])
                }
              />
              <Slider
                value={[threshold]}
                min={0}
                max={255}
                step={1}
                onValueChange={onThresholdChange}
              />
            </div>

            <div className="p-3 bg-slate-50 rounded border text-sm">
              {selectedEdgeMethod === "sobel" &&
                "Sobel: stabil dan tahan noise"}
              {selectedEdgeMethod === "roberts" &&
                "Roberts: cepat tapi sensitif noise"}
              {selectedEdgeMethod === "prewitt" &&
                "Prewitt: mirip Sobel"}
              {selectedEdgeMethod === "laplace" &&
                "Laplace: turunan kedua"}
              {selectedEdgeMethod === "frei-chen" &&
                "Frei-Chen: detail tinggi"}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      {selectedTool && (
        <div className="p-4 border-t bg-slate-50 space-y-3">
          <Button onClick={onApply} className="w-full">
            <Check className="w-4 h-4 mr-2" />
            Terapkan
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={onReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="outline"
              onClick={onDownload}
              disabled={!hasProcessedImage}
            >
              <Download className="w-4 h-4 mr-2" />
              Ekspor
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
