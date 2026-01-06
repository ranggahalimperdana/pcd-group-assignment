export const generateHistogram = (imageData: ImageData) => {
  const histogram = new Array(256).fill(0);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray =
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    histogram[Math.floor(gray)]++;
  }

  // Sample every 8th value for better visualization
  const sampledData = [];
  for (let i = 0; i < 256; i += 8) {
    sampledData.push({
      value: i,
      count: histogram[i],
    });
  }

  return sampledData;
};

export interface HistogramAnalysis {
  status: "dark" | "bright" | "low-contrast" | "high-contrast" | "balanced";
  title: string;
  description: string;
  recommendation: string;
}

export const analyzeHistogram = (data: { value: number; count: number }[]): HistogramAnalysis => {
  let totalPixels = 0;
  let totalBrightness = 0;
  let minBright = 255;
  let maxBright = 0;

  data.forEach((item) => {
    totalPixels += item.count;
    totalBrightness += item.value * item.count;
    if (item.count > 0) {
      if (item.value < minBright) minBright = item.value;
      if (item.value > maxBright) maxBright = item.value;
    }
  });

  const avgBrightness = totalPixels > 0 ? totalBrightness / totalPixels : 0;
  const range = maxBright - minBright;

  // Analisis Logika Sederhana
  if (avgBrightness < 85) {
    return {
      status: "dark",
      title: "Foto Terlalu Gelap",
      description: "Mayoritas piksel menumpuk di kiri (area gelap). Detail pada bayangan mungkin hilang.",
      recommendation: "👉 Coba naikkan Kecerahan.",
    };
  } else if (avgBrightness > 170) {
    return {
      status: "bright",
      title: "Foto Terlalu Terang",
      description: "Mayoritas piksel menumpuk di kanan (area terang). Detail mungkin hilang (washed out).",
      recommendation: "👉 Coba turunkan Kecerahan.",
    };
  } else if (range < 80) { // Range diperkecil sedikit agar lebih sensitif
    return {
      status: "low-contrast",
      title: "Kontras Rendah",
      description: "Grafik sempit di tengah. Gambar terlihat pudar atau kurang tegas.",
      recommendation: "👉 Coba naikkan Kontras.",
    };
  } else {
    return {
      status: "balanced",
      title: "Pencahayaan Seimbang",
      description: "Penyebaran piksel cukup merata. Foto memiliki eksposur yang baik.",
      recommendation: "✅ Foto sudah terlihat oke.",
    };
  }
};
  