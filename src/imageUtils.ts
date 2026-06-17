/** Web-optimized product image URL (meat section uses compressed WebP). */
export function getProductImageUrl(image: string): string {
  const optimized = image.includes('/قسم اللحوم/')
    ? image.replace(/\.(png|jpe?g)$/i, '.webp')
    : image;

  return optimized.startsWith('/') ? encodeURI(optimized) : optimized;
}
