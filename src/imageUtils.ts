/** Web-optimized product image URL (local meat uses WebP; Supabase URLs pass through). */
export function getProductImageUrl(image: string): string {
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  const optimized = image.includes('/قسم اللحوم/')
    ? image.replace(/\.(png|jpe?g)$/i, '.webp')
    : image;

  return optimized.startsWith('/') ? encodeURI(optimized) : optimized;
}
