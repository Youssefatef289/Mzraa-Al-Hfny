/** Web-optimized product image URL (local meat uses WebP; remote/data URLs pass through). */
export function getProductImageUrl(image: string): string {
  if (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('data:') ||
    image.startsWith('blob:')
  ) {
    return image;
  }

  const optimized = image.includes('/قسم اللحوم/')
    ? image.replace(/\.(png|jpe?g)$/i, '.webp')
    : image;

  return optimized.startsWith('/') ? encodeURI(optimized) : optimized;
}
