import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const FOLDERS = ['public/images/قسم اللحوم', 'images/قسم اللحوم'];
const MAX_WIDTH = 720;
const WEBP_QUALITY = 78;

async function optimizeFolder(dir) {
  if (!fs.existsSync(dir)) {
    console.warn('Skip missing folder:', dir);
    return { ok: 0, skip: 0 };
  }

  let ok = 0;
  let skip = 0;

  for (const file of fs.readdirSync(dir)) {
    if (file.includes('upscayl') || file.endsWith('.webp')) continue;
    if (!/\.(png|jpe?g)$/i.test(file)) continue;

    const input = path.join(dir, file);
    const output = path.join(dir, file.replace(/\.(png|jpe?g)$/i, '.webp'));
    const before = fs.statSync(input).size;

    await sharp(input)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toFile(output);

    const after = fs.statSync(output).size;
    console.log(
      `${path.basename(output)}: ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024).toFixed(0)}KB`
    );
    ok += 1;
  }

  return { ok, skip };
}

let total = 0;
for (const folder of FOLDERS) {
  const { ok } = await optimizeFolder(folder);
  total += ok;
}

console.log(`Done. Optimized ${total} meat images.`);
