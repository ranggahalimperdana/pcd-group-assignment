import { FileText, Clock, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useRef } from "react";
import { toast } from "sonner";

interface HomePageProps {
  isLoggedIn: boolean;
  onStartEditing: () => void;
  projects: Array<{ id: string; name: string; date: string }>;
  onLoadProject: (id: string) => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FeatureCard = ({ title, description, imageSrc, alt }: { title: string, description: string, imageSrc: string, alt: string }) => (
  <div className="group">
    <div className="relative overflow-hidden rounded-xl border border-slate-200 shadow-sm aspect-[4/3] mb-4">
      <img 
        src={imageSrc} 
        alt={alt} 
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 text-center">{title}</h3>
    <p className="text-sm text-slate-500 text-center mt-1">{description}</p>
  </div>
);

export function HomePage({
  isLoggedIn,
  onStartEditing,
  projects,
  onLoadProject,
  onUploadImage,
}: HomePageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-24 max-w-3xl mx-auto">
          <h1 className="mb-6 text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Pemrosesan Citra Digital 
          </h1>
          <p className="text-base md:text-lg text-slate-600 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto">
            Alat untuk analisis dan manipulasi gambar. 
            Dapat diakses langsung dari browser Anda tanpa perlu instalasi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={handleStartClick} 
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-8 h-12 text-base shadow-sm transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Unggah Gambar
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onUploadImage}
              className="hidden"
            />
            <Button 
              variant="outline"
              size="lg" 
              onClick={() => toast.info("Sistem dalam tahap pengembangan")}
              className="w-full sm:w-auto rounded-md px-8 h-12 text-base border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              Register
            </Button>
          </div>
        </div>

        {/* Feature Showcase Section */}
        <div className="mt-16 md:mt-24 mb-16">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-10">Contoh Hasil Pemrosesan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Gambar Asli"
              description="Input gambar berkualitas tinggi"
              imageSrc="https://images.unsplash.com/photo-1695067440629-b5e513976100?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjczMjYwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Original Image"
            />
            <FeatureCard
              title="Deteksi Tepi"
              description="Algoritma Sobel & Prewitt"
              imageSrc="https://images.unsplash.com/photo-1580845324312-f553bc1e3c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGFuZCUyMHdoaXRlJTIwYXJjaGl0ZWN0dXJhbCUyMGxpbmVzJTIwc2tldGNofGVufDF8fHx8MTc2NzQzMDk1MXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Edge Detection Result"
            />
            <FeatureCard
              title="Thresholding"
              description="Konversi Biner Presisi"
              imageSrc="https://images.unsplash.com/photo-1619951872737-dcee98c29e2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwY29udHJhc3QlMjBibGFjayUyMGFuZCUyMHdoaXRlJTIwdGV4dHVyZXxlbnwxfHx8fDE3Njc0MzA5NTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Thresholding Result"
            />
          </div>
        </div>

        {/* Recent Projects */}
        {isLoggedIn && projects.length > 0 && (
          <div className="border-t border-slate-100 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-slate-900">Proyek Terbaru</h3>
              <Button variant="ghost" className="text-slate-500 hover:text-slate-900">Lihat Semua</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onLoadProject(project.id)}
                  className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all text-left bg-white group"
                >
                  <div className="w-12 h-12 bg-slate-50 rounded-md flex items-center justify-center text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate group-hover:text-indigo-700 transition-colors">{project.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <p className="text-xs text-slate-500">{project.date}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}