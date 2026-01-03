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
