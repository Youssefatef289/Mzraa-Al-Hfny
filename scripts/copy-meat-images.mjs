import fs from 'fs';
import path from 'path';

const assetsDir =
  'C:/Users/dell/.cursor/projects/d-Bsma-Agency-Digital-Marketing-Work-website-Mzraa-Al-Hfny/assets';
const meatDir = 'images/قسم اللحوم';
const publicMeatDir = 'public/images/قسم اللحوم';

const copies = [
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images_____________________580_.jpg', 'ريش ضانى 580 .jpeg'],
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images_______________450.jpg', 'سن 450.jpeg'],
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images_______________________420.jpg', 'ضلعه ملبسه 420.jpeg'],
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images______________________525.jpg', 'فخده ضانى 525.jpeg'],
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images___________________450.jpg', 'كولاته 450.jpeg'],
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images__________________________550.jpg', 'لحم ماعز بلدى 550.jpeg'],
];

for (const [srcName, destName] of copies) {
  const src = path.join(assetsDir, srcName);
  for (const dir of [meatDir, publicMeatDir]) {
    const dest = path.join(dir, destName);
    fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(src, dest);
    console.log('Copied ->', dest);
  }
}
