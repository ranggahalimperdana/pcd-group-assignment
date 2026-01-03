export const applyEdgeDetection = (imageData: ImageData, method: string): ImageData => {
  const width = imageData.width;
  const height = imageData.height;
  const data = new Uint8ClampedArray(imageData.data);
  const output = new Uint8ClampedArray(imageData.data);

  let kernelX: number[][] | null = null;
  let kernelY: number[][] | null = null;

  // Define kernels based on method
  if (method === "sobel") {
    kernelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    kernelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
  } else if (method === "prewitt") {
    kernelX = [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]];
    kernelY = [[-1, -1, -1], [0, 0, 0], [1, 1, 1]];
  } else if (method === "frei-chen") {
    const sqrt2 = Math.sqrt(2);
    kernelX = [[-1, 0, 1], [-sqrt2, 0, sqrt2], [-1, 0, 1]];
    kernelY = [[-1, -sqrt2, -1], [0, 0, 0], [1, sqrt2, 1]];
  } else if (method === "laplace") {
    // Standard 3x3 Laplacian kernel
    kernelX = [[0, 1, 0], [1, -4, 1], [0, 1, 0]]; 
    kernelY = null;
  }

  // Roberts Cross
  if (method === "roberts") {
     for (let y = 0; y < height - 1; y++) {
      for (let x = 0; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const idxRight = (y * width + (x + 1)) * 4;
        const idxBottom = ((y + 1) * width + x) * 4;
        const idxBottomRight = ((y + 1) * width + (x + 1)) * 4;

        // Convert to grayscale for calculation
        const getGray = (i: number) => 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        
        const p00 = getGray(idx);
        const p01 = getGray(idxRight);
        const p10 = getGray(idxBottom);
        const p11 = getGray(idxBottomRight);

        const gx = p00 - p11;
        const gy = p01 - p10;

        const magnitude = Math.sqrt(gx * gx + gy * gy);
        const value = Math.min(255, magnitude);
        
        output[idx] = value;
        output[idx + 1] = value;
        output[idx + 2] = value;
      }
    }
    return new ImageData(output, width, height);
  }

  // Generic 3x3 convolution
  if (kernelX) {
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0;
        let gy = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
            
            if (kernelX) gx += gray * kernelX[ky + 1][kx + 1];
            if (kernelY) gy += gray * kernelY[ky + 1][kx + 1];
          }
        }

        let magnitude = 0;
        if (method === "laplace") {
           magnitude = Math.abs(gx);
        } else {
           magnitude = Math.sqrt(gx * gx + gy * gy);
        }
        
        const idx = (y * width + x) * 4;
        const value = Math.min(255, magnitude);
        output[idx] = value;
        output[idx + 1] = value;
        output[idx + 2] = value;
      }
    }
  }

  return new ImageData(output, width, height);
};
