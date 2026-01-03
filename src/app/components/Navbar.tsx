import { House, LogIn, PenTool, Sparkles, UserPlus } from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  currentView: "home" | "editor";
  onViewChange: (view: "home" | "editor") => void;
  hasImage: boolean;
}

export function Navbar({
  isLoggedIn,
  onLoginClick,
  onRegisterClick,
  currentView,
  onViewChange,
  hasImage,
}: NavbarProps) {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              Kelompok3
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onViewChange("home")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
                currentView === "home"
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <House className="w-4 h-4" />
              <span>Home</span>
            </button>
            {hasImage && (
              <button
                onClick={() => onViewChange("editor")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
                  currentView === "editor"
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>Editor</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <Button
              onClick={onRegisterClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm h-9 px-4 transition-colors"
            >
              Guest
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 font-medium">
                user@example.com
              </span>
              <Button
                variant="outline"
                onClick={onLoginClick}
                size="sm"
                className="rounded-md border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Keluar
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
