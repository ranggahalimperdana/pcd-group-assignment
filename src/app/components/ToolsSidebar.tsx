import React from "react";
import {
  Upload,
  Image as ImageIcon,
  SlidersHorizontal,
  ChartBar,
  Grid3x3,
  Scan,
} from "lucide-react";

/* ===============================
   TYPES
================================ */
export type ToolType =
  | "grayscale"
  | "brightness"
  | "threshold"
  | "histogram"
  | "edge";

interface ToolsSidebarProps {
  onToolSelect: (tool: ToolType) => void;
  selectedTool: ToolType | null;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/* ===============================
   COMPONENT
================================ */
export function ToolsSidebar({
  onToolSelect,
  selectedTool,
  onUploadImage,
}: ToolsSidebarProps) {
  const tools: { id: ToolType; name: string; icon: any }[] = [
    { id: "grayscale", name: "Skala Abu-abu", icon: ImageIcon },
    { id: "brightness", name: "Kecerahan & Kontras", icon: SlidersHorizontal },
    { id: "histogram", name: "Histogram", icon: ChartBar },
    { id: "threshold", name: "Ambang Batas", icon: Grid3x3 },
    { id: "edge", name: "Deteksi Tepi", icon: Scan },
  ];

  return (
    <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Alat Pemrosesan
        </h3>
      </div>

      {/* Content */}
      <div className="p-3 space-y-4">
        {/* Upload */}
        <label htmlFor="image-upload" className="block">
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer transition-all shadow-sm">
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Unggah Gambar</span>
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={onUploadImage}
            className="hidden"
          />
        </label>

        {/* Tools */}
        <div className="grid grid-cols-2 gap-2 md:flex md:flex-col md:gap-1">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isSelected = selectedTool === tool.id;

            return (
              <button
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all
                  ${
                    isSelected
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isSelected ? "text-indigo-600" : "text-slate-500"
                  }`}
                />
                <span className="truncate">{tool.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
