// src/lib/utils/cloudinary-client.ts (client-safe)
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export function getCloudinaryUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
  quality?: number;
}) {
  if (!publicId) return '';
  const params = new URLSearchParams();
  if (options?.width) params.append('w', options.width.toString());
  if (options?.height) params.append('h', options.height.toString());
  if (options?.crop) params.append('c', options.crop);
  if (options?.quality) params.append('q', options.quality.toString());
  
  const query = params.toString();
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${query ? query + '/' : ''}${publicId}`;
}