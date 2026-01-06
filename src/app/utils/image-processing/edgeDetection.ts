const BASE_URL = "http://127.0.0.1:8000";

export type EdgeMethod =
  | "sobel"
  | "prewitt"
  | "roberts"
  | "laplace"
  | "frei-chen";

/**
 * Apply edge detection via backend (ONE TIME)
 * Backend returns grayscale edge magnitude image (PNG)
 */
export async function applyEdgeDetection(
  imageFile: File,
  method: EdgeMethod
): Promise<ImageData> {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${BASE_URL}/edge/${method}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Edge detection failed: ${method}`);
  }

  const blob = await response.blob();
  return await blobToImageData(blob);
}

/**
 * Convert backend PNG → ImageData (for Canvas)
 */
async function blobToImageData(blob: Blob): Promise<ImageData> {
  const bitmap = await createImageBitmap(blob);

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context not available");
  }

  ctx.drawImage(bitmap, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
