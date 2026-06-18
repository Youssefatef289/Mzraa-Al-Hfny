import fs from 'fs';
import path from 'path';

const assetsDir =
  'C:/Users/dell/.cursor/projects/d-Bsma-Agency-Digital-Marketing-Work-website-Mzraa-Al-Hfny/assets';

const copies = [
  // Cheese
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images___________190________________.jpg', 'قسم الجبن/190 بانيه متبل جاهز.jpeg'],
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images______________________________.jpg', 'قسم الجبن/جبنه برميلى كاريبى .jpeg'],
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images_____________________________.jpg', 'قسم الجبن/جبنه شيدر  مستورده.jpeg'],
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images___________________________________.jpg', 'قسم الجبن/جبنه فلمنك فريكو مستورده.jpeg'],
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images__________________________________.jpg', 'قسم الجبن/جبنه كريمى طبيعى دومتى .jpeg'],
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images_____________________350.jpg', 'قسم الجبن/شيدر احمر 350.jpeg'],
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images__________________________________350__._.jpg', 'قسم الجبن/شيدر كمون 350.jpeg'],
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images_________________________________350__._.jpg', 'قسم الجبن/شيدر مدخن 350.jpeg'],
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images________________________400.jpg', 'قسم الجبن/قشطه بلدى لف 400.jpeg'],
  // Processed
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images_______________________________300.jpg', 'قسم مصنعات اللحوم/حواوشى بلدى 300.jpeg'],
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images_____________________________380.jpg', 'قسم مصنعات اللحوم/برجر بلدى 380.jpeg'],
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images______________________________________________420_.jpg', 'قسم مصنعات اللحوم/برجر  بجبنه الشيدر مستورده 420 .jpeg'],
  // Poultry
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images________________________450.jpg', 'قسم الدواجن/بفتيك متبل 450.jpeg'],
  ['d__Bsma_Agency__Digital_Marketing_Work_website_Mzraa-Al-Hfny_images______________________________225.jpg', 'قسم الدواجن/استربس متبل جاهز 225.jpeg'],
];

for (const [srcName, relDest] of copies) {
  const src = path.join(assetsDir, srcName);
  if (!fs.existsSync(src)) {
    console.warn('Missing asset:', srcName);
    continue;
  }
  for (const base of ['images', 'public/images']) {
    const dest = path.join(base, relDest);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    console.log('OK', dest);
  }
}
