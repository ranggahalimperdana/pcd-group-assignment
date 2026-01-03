export const applyBrightnessContrast = (
  imageData: ImageData,
  brightness: number,
  contrast: number
): ImageData => {
  const data = new Uint8ClampedArray(imageData.data);
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      let value = data[i + j];
      value = value + brightness; // Apply brightness
      value = factor * (value - 128) + 128; // Apply contrast
      data[i + j] = Math.max(0, Math.min(255, value));
    }
  }
  return new ImageData(data, imageData.width, imageData.height);
};
