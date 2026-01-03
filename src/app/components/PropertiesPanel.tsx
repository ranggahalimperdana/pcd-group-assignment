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
import { RotateCcw, Check, Download, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PropertiesPanelProps {
  selectedTool: string | null;
  brightness: number;
  contrast: number;
  threshold: number;
  selectedEdgeMethod: string;
  onBrightnessChange: (value: number[]) => void;
  onContrastChange: (value: number[]) => void;
  onThresholdChange: (value: number[]) => void;
  onEdgeMethodChange: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
  onDownload: () => void;
  histogramData: { value: number; count: number }[] | null;
  hasProcessedImage: boolean;
}

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
  hasProcessedImage,
}: PropertiesPanelProps) {

  return (
    <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 flex flex-col flex-shrink-0 h-auto md:h-full">
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Properti</h3>
      </div>
      <div className="overflow-y-auto p-5 max-h-64 md:max-h-full flex-1">
        {!selectedTool ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Info className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-900 font-medium">Tidak ada alat yang dipilih</p>
            <p className="text-xs text-slate-500 mt-1">Pilih alat dari sidebar</p>
          </div>
        ) : (
          <div className="space-y-6">
            {selectedTool === "grayscale" && (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600">
                  Ubah gambar menjadi skala abu-abu. Tidak ada parameter yang perlu diatur.
                </p>
              </div>
            )}

            {selectedTool === "brightness" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-slate-700">Kecerahan</Label>
                    <Input
                      type="number"
                      value={brightness}
                      onChange={(e) => onBrightnessChange([Number(e.target.value)])}
                      className="w-16 h-8 text-xs border-slate-200 focus:border-indigo-500"
                      min={-100}
                      max={100}
                    />
                  </div>
                  <Slider
                    value={[brightness]}
                    onValueChange={onBrightnessChange}
                    min={-100}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-slate-700">Kontras</Label>
                    <Input
                      type="number"
                      value={contrast}
                      onChange={(e) => onContrastChange([Number(e.target.value)])}
                      className="w-16 h-8 text-xs border-slate-200 focus:border-indigo-500"
                      min={-100}
                      max={100}
                    />
                  </div>
                  <Slider
                    value={[contrast]}
                    onValueChange={onContrastChange}
                    min={-100}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {selectedTool === "histogram" && (
              <div className="space-y-4">
                {histogramData && histogramData.length > 0 ? (
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={histogramData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                          dataKey="value"
                          tick={{ fontSize: 10, fill: "#64748b" }}
                          stroke="#e2e8f0"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 10, fill: "#64748b" }} 
                          stroke="#e2e8f0" 
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            fontSize: "12px",
                            color: "#1e293b"
                          }}
                        />
                        <Bar dataKey="count" fill="#4f46e5" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <p className="text-xs text-slate-500">
                      Klik Terapkan untuk menghasilkan histogram
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedTool === "threshold" && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-slate-700">Ambang Batas</Label>
                    <Input
                      type="number"
                      value={threshold}
                      onChange={(e) => onThresholdChange([Number(e.target.value)])}
                      className="w-16 h-8 text-xs border-slate-200 focus:border-indigo-500"
                      min={0}
                      max={255}
                    />
                  </div>
                  <Slider
                    value={[threshold]}
                    onValueChange={onThresholdChange}
                    min={0}
                    max={255}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {selectedTool === "edge" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Metode Deteksi Tepi</Label>
                  <Select value={selectedEdgeMethod} onValueChange={onEdgeMethodChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih metode" />
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
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600">
                    {selectedEdgeMethod === "sobel" && "Sobel operator is excellent for detecting edges with noise reduction."}
                    {selectedEdgeMethod === "roberts" && "Roberts Cross operator is fast but sensitive to noise."}
                    {selectedEdgeMethod === "prewitt" && "Prewitt operator is similar to Sobel but faster, detecting vertical and horizontal edges."}
                    {selectedEdgeMethod === "laplace" && "Laplacian operator detects edges using second derivatives, good for fine details."}
                    {selectedEdgeMethod === "frei-chen" && "Frei-Chen operator assigns weights to edge directions, good for detailed feature extraction."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedTool && (
        <div className="p-4 border-t border-slate-200 space-y-3 bg-slate-50/50">
          <Button 
            onClick={onApply} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
          >
            <Check className="w-4 h-4 mr-2" />
            Terapkan
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={onReset} 
              variant="outline" 
              className="w-full border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={onDownload}
              disabled={!hasProcessedImage}
              variant="outline"
              className="w-full border-slate-200 hover:bg-slate-50 text-slate-700"
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