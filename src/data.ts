import { Product, Review } from './types';

export const CATEGORIES_INFO = [
  { id: 'meat', name: 'لحوم طازجة', count: 31, desc: 'لحوم بلدية متميزة من مزارعنا الخاصة تتغذى على أعلاف طبيعية 100% ويتم ذبحها في السلخانة الحكومية وتحت إشراف طبي كامل.' },
  { id: 'processed', name: 'مصنعات لحوم', count: 13, desc: 'مصنعات بلدية محضرة من اللحوم الطازجة والبهارات الطبيعية الفاخرة بدون الصويا ومخلفات اللحوم والمواد الحافظة الضارة.' },
  { id: 'poultry', name: 'دواجن طازجة', count: 19, desc: 'دواجن ومربيات مزارعنا تتغذى على حبوب وأعلاف نباتية صافية، طازجة يومياً ومذبوحة ومنظفة بأعلى درجات التعقيم.' },
  { id: 'dairy', name: 'الألبان والحلويات', count: 19, desc: 'ألبان وحلويات شرقية طازجة محضرة يومياً من حليب مزارعنا النقي؛ أرز باللبن، أم علي، مهلبية، كاستر، زبادي وأكثر.' },
  { id: 'cheese', name: 'الجبن والمشتقات', count: 47, desc: 'تشكيلة جبن بلدي ومستورد، لانشون، سلامي، بسطرمة، مش وقشطة — تُباع بالوزن: ثمن، ربع، نص أو كيلو.' },
] as const;

const IMG = '/images';

export const PRODUCTS: Product[] = [
  // ===== قسم اللحوم =====
  {
    id: 'meat-1', name: 'انتركوت بقري', description: 'شرائح انتركوت بقري طازجة بدهون متوازنة، مثالية للشوي والاستيك سريع النضج بنكهة غنية.',
    price: 480, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/انتركوت 480 م.ج.png`, category: 'meat', rating: 4.9, isAvailable: true, tag: 'فاخر',
  },
  {
    id: 'meat-2', name: 'بفتيك بقري', description: 'شرائح بفتيك بقري طرية مقطعة باحترافية، جاهزة للقلي السريع أو الطواجن.',
    price: 480, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/بفتيك 480 م.ج.png`, category: 'meat', rating: 4.8, isAvailable: true,
  },
  {
    id: 'meat-3', name: 'بيكاتا', description: 'شرائح بيكاتا رفيعة من أجود قطع اللحم البقري، سريعة التحضير وطرية للغاية.',
    price: 480, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/بيكاتا 480 م.ج.png`, category: 'meat', rating: 4.8, isAvailable: true,
  },
  {
    id: 'meat-4', name: 'رقبة ضاني', description: 'رقبة ضاني بلدي طازجة مناسبة للطواجن والمرق الغني بطعم خروف أصيل.',
    price: 495, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/رقبه ضانى 495 م.ج.png`, category: 'meat', rating: 4.7, isAvailable: true,
  },
  {
    id: 'meat-5', name: 'ريش ضاني', description: 'ريش ضاني بلدي طازجة مقطعة بعناية، دهن متوازن يمنح مذاقاً خرافياً عند الشوي.',
    price: 580, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/ريش ضانى 580 .jpeg`, category: 'meat', rating: 4.9, isAvailable: true, tag: 'عشاق الشواء',
  },
  {
    id: 'meat-6', name: 'ستيك بقري', description: 'ستيك بقري سميك من أرقى الأجزاء، جاهز للطهي بالزبدة والثوم وإكليل الجبل.',
    price: 480, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/ستيك 480م.ج.png`, category: 'meat', rating: 4.9, isAvailable: true,
  },
  {
    id: 'meat-7', name: 'سمانة', description: 'لحم سمانة بقري طازج غني بالمرق، مثالي للطبخ البطيء والشوربات المصرية.',
    price: 480, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/سمانه 480م.ج.png`, category: 'meat', rating: 4.7, isAvailable: true,
  },
  {
    id: 'meat-8', name: 'سن', description: 'لحم السن البقري الطري الغني بالجيلاتين الطبيعي، مثالي للفتة والطواجن.',
    price: 450, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/سن 450.jpeg`, category: 'meat', rating: 4.8, isAvailable: true,
  },
  {
    id: 'meat-9', name: 'شاورما لحم ', description: 'شرائح شاورما لحم بقري  جاهزة بخلطة بهارات سرية، جاهزة للطهي مباشرة.',
    price: 490, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/شاورما جاخزه متبله 490 م.ج.png`, category: 'meat', rating: 4.9, isAvailable: true, tag: 'جاهزة للطهي',
  },
  {
    id: 'meat-10', name: 'ضلعة ملبسة', description: 'ضلوع بقري ملبسة باللحم، طرية وغنية بالنكهة مناسبة للفرن والمشويات.',
    price: 420, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/ضلعه ملبسه 420.jpeg`, category: 'meat', rating: 4.7, isAvailable: true,
  },
  {
    id: 'meat-11', name: 'طحال (حجم كبير)', description: 'طحال بقري طازج حجم كبير، يحضّر مشوياً أو محشواً على الطريقة المصرية.',
    price: 150, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/طحال حجم كبير 150 م.ج.png`, category: 'meat', rating: 4.6, isAvailable: true,
  },
  {
    id: 'meat-12', name: 'عرق تربيانكو', description: 'عرق تربيانكو بقري فاخر طري، مناسب للستيك واللحم البارد والشواء الفخم.',
    price: 470, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/عرق التربيانكو 470 م.ج.png`, category: 'meat', rating: 4.8, isAvailable: true,
  },
  {
    id: 'meat-13', name: 'عرق فلتو', description: 'أنعم قطعيات اللحم البقري على الإطلاق، مثالي للستيك السريع والشواء الفخم.',
    price: 480, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/عرق فلتو 550 م.ج.png`, category: 'meat', rating: 5.0, isAvailable: true, tag: 'الأفخم',
  },
  {
    id: 'meat-14', name: 'فخدة ضاني', description: 'فخدة ضاني بلدي كاملة من المرعى الطبيعي، طرية ومثالية للفرن والمندي.',
    price: 525, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/فخده ضانى 525.jpeg`, category: 'meat', rating: 4.9, isAvailable: true, tag: 'من المزرعة',
  },
  {
    id: 'meat-15', name: 'فشر لوح', description: 'لحم فشر لوح بقري طازج بنسبة دهون مناسبة، اختيار اقتصادي للطبخ اليومي.',
    price: 450, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/فشر لوح 450 م.ج.png`, category: 'meat', rating: 4.6, isAvailable: true,
  },
  {
    id: 'meat-16', name: 'كباب حلة أحمر', description: 'لحم كباب حلة أحمر صافٍ مقطع، يعطي طبخة كباب حلة بمرق غني ولحم يذوب.',
    price: 480, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/كباب حله احمر 480 م.ج.png`, category: 'meat', rating: 4.9, isAvailable: true,
  },
  {
    id: 'meat-17', name: 'كبدة بلدي صافي', description: 'كبدة بقري بلدي طازجة تذبح يومياً، غنية بالحديد وتُقطّع حسب رغبتك.',
    price: 500, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/كبده بلدى صافى 500 م.ج.png`, category: 'meat', rating: 5.0, isAvailable: true, tag: 'طازجة يومياً',
  },
  {
    id: 'meat-18', name: 'كبدة وكلاوي', description: 'تشكيلة كبدة وكلاوي بقري طازجة، مثالية للمشاوي والوجبات الغنية بالبروتين.',
    price: 475, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/كبده و كلاوى 475 م.ج.png`, category: 'meat', rating: 4.8, isAvailable: true,
  },
  {
    id: 'meat-19', name: 'كوارع', description: 'كوارع بقري طازجة منظفة بعناية، أساس طبق الكوارع والفتة بمرق طبيعي غني.',
    price: 300, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/كوارع 300 م.ج.png`, category: 'meat', rating: 4.7, isAvailable: true,
  },
  {
    id: 'meat-20', name: 'كولاتة', description: 'لحم كولاتة بقري طازج طري، مناسب لجميع أنواع الطبخ والطواجن المنزلية.',
    price: 450, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/كولاته 450.jpeg`, category: 'meat', rating: 4.7, isAvailable: true,
  },

  {
    id: 'meat-22', name: 'لحم ضاني برقي', description: 'لحم ضاني بلدي برقي طازج من خراف المرعى الطبيعي، نكهة غنية تذوب في الفم.',
    price: 525, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/لحم ضانى برقى 495 م.ج.png`, category: 'meat', rating: 4.9, isAvailable: true,
  },
  {
    id: 'meat-23', name: 'لحم ماعز بلدي', description: 'لحم ماعز بلدي طازج قليل الدهن وصحي، مثالي للطواجن والمندي والفتة.',
    price: 550, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/لحم ماعز بلدى 550.jpeg`, category: 'meat', rating: 4.8, isAvailable: true,
  },
  {
    id: 'meat-24', name: 'لحمة بلدي ملبس', description: 'لحمة بلدي ملبسة بالعظم بنسبة دهون مثالية، تعطي مرقاً غنياً للطبخ المصري.',
    price: 420, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/لحمه بلدى ملبيس 420 م.ج.png`, category: 'meat', rating: 4.7, isAvailable: true,
  },
  {
    id: 'meat-25', name: 'مخ بقري', description: 'مخ بقري طازج نظيف، يحضّر مقلياً أو بانيه على الطريقة الإسكندرانية.',
    price: 250, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/مخ 250 م.ج.png`, category: 'meat', rating: 4.6, isAvailable: true,
  },
  {
    id: 'meat-26', name: 'مفروم أحمر', description: 'لحم مفروم أحمر صافٍ من اللحم البقري الطازج، خالٍ من الشحوم ومثالي للكفتة والحشو.',
    price: 480, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/مفروم احمر 480 م.ج.png`, category: 'meat', rating: 4.9, isAvailable: true,
  },
  {
    id: 'meat-27', name: 'مفروم بلدي', description: 'لحم مفروم بلدي طازج بنسبة دهون متوازنة، يصلح للكفتة والمحشي والصلصة.',
    price: 450, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/مفروم بلدى 450 م.ج.png`, category: 'meat', rating: 4.8, isAvailable: true,
  },
  {
    id: 'meat-28', name: 'ممبار', description: 'ممبار بقري طازج منظف بعناية، جاهز للحشو والقلي على الطريقة البلدي.',
    price: 150, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/ممبار 150 م.ج.png`, category: 'meat', rating: 4.6, isAvailable: true,
  },
  {
    id: 'meat-29', name: 'موزة بقري', description: 'موزة بقري طازجة بالعظم غنية بالجيلاتين، مثالية للفتة والمرق والطواجن.',
    price: 450, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/موزه  450 م.ج.png`, category: 'meat', rating: 4.8, isAvailable: true,
  },
  {
    id: 'meat-30', name: 'وش الفخدة', description: 'وش الفخدة البقري الطري، من أفضل القطعيات للشرائح والاستيك والطبخ.',
    price: 480, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/وش الفخده 480 م.ج.png`, category: 'meat', rating: 4.8, isAvailable: true,
  },
  {
    id: 'meat-31', name: 'عرق روستو', description: 'عرق روستو بقري فاخر طري، مثالي للستيك والشواء السريع بنكهة غنية ومتوازنة.',
    price: 480, unit: 'كيلو جرام', image: `${IMG}/قسم اللحوم/عرق روستو 480.jpeg`, category: 'meat', rating: 4.9, isAvailable: true,
  },

  // ===== قسم مصنعات اللحوم =====
  {
    id: 'proc-1', name: 'برجر بلدي', description: 'أقراص برجر لحم بلدي طازجة وسميكة، خالية من الصويا والمواد الحافظة ومتماسكة للشواية.',
    price: 380, unit: 'كيلو جرام', image: `${IMG}/قسم مصنعات اللحوم/برجر بلدى 380.jpeg`, category: 'processed', rating: 4.8, isAvailable: true, tag: 'بدون صويا',
  },
  {
    id: 'proc-2', name: 'برجر بجبنة شيدر مستوردة', description: 'برجر لحم بلدي محشو بجبنة شيدر مستوردة فاخرة، طعم غني وذوبان مثالي على الشواية.',
    price: 420, unit: 'كيلو جرام', image: `${IMG}/قسم مصنعات اللحوم/برجر  بجبنه الشيدر مستورده 420 .jpeg`, category: 'processed', rating: 4.9, isAvailable: true, tag: 'مميز',
  },
  {
    id: 'proc-3', name: 'بفتيك متبل', description: 'شرائح بفتيك لحم بقري متبلة جاهزة بخلطة بهارات متوازنة، جاهزة للطهي مباشرة.',
    price: 450, unit: 'كيلو جرام', image: `${IMG}/قسم مصنعات اللحوم/بفتيك متبل 450 م.ج.png`, category: 'processed', rating: 4.8, isAvailable: true,
  },
  {
    id: 'proc-4', name: 'بقلاوة تركي (لحم)', description: 'لفائف لحم على طريقة البقلاوة التركي، حشو لحم متبل بطبقات مقرمشة وفاخرة.',
    price: 480, unit: 'كيلو جرام', image: `${IMG}/قسم مصنعات اللحوم/بقلاوه تركى 480 م.ج.png`, category: 'processed', rating: 4.8, isAvailable: true,
  },
  {
    id: 'proc-5', name: 'حواوشي بلدي', description: 'حواوشي محشو بكمية وافرة من اللحم البقري المتبل بالفلفل والطماطم والتوابل الشهية.',
    price: 300, unit: 'كيلو جرام', image: `${IMG}/قسم مصنعات اللحوم/حواوشى بلدى 300.jpeg`, category: 'processed', rating: 5.0, isAvailable: true, tag: 'روعة المذاق',
  },
  {
    id: 'proc-6', name: 'ستيك متبل', description: 'شرائح ستيك بقري متبلة جاهزة بخلطة فاخرة، جاهزة للشوي أو القلي مباشرة.',
    price: 450, unit: 'كيلو جرام', image: `${IMG}/قسم مصنعات اللحوم/ستيك متبل 450 م.ج.png`, category: 'processed', rating: 4.8, isAvailable: true,
  },
  {
    id: 'proc-7', name: 'سجق بلدي شرقي', description: 'سجق بلدي محضر من لحم بقري طازج وغلاف طبيعي، متبل بتوليفة بهارات شرقية سرية.',
    price: 380, unit: 'كيلو جرام', image: `${IMG}/قسم مصنعات اللحوم/سجق بلدى 380 م.ج.jpg`, category: 'processed', rating: 4.9, isAvailable: true, tag: 'خلطة سرية',
  },
  {
    id: 'proc-8', name: 'طرب بلدي', description: 'طرب بلدي محضر من اللحم الطازج والبهارات الطبيعية، جاهز للشوي بطعم أصيل.',
    price: 450, unit: 'كيلو جرام', image: `${IMG}/قسم مصنعات اللحوم/طرب بلدى 450 م.ج.png`, category: 'processed', rating: 4.7, isAvailable: true,
  },
  {
    id: 'proc-9', name: 'عرض 5 رغيف حواوشي', description: 'عرض اقتصادي مكوّن من 5 أرغفة حواوشي محشوة باللحم البلدي المتبل، جاهزة للفرن.',
    price: 200, unit: 'العرض', image: `${IMG}/قسم مصنعات اللحوم/عرض 5 رغيف حواوشى 200م.ج.png`, category: 'processed', rating: 4.9, isAvailable: true, tag: 'عرض موفّر',
  },
  {
    id: 'proc-10', name: 'كبدة بلدي متبلة', description: 'كبدة بقري بلدي متبلة جاهزة على الطريقة الإسكندرانية بالفلفل والثوم والتوابل.',
    price: 500, unit: 'كيلو جرام', image: `${IMG}/قسم مصنعات اللحوم/كبده بلدى 500 م.ج.png`, category: 'processed', rating: 4.8, isAvailable: true,
  },
  {
    id: 'proc-11', name: 'كفتة أرز', description: 'كفتة لحم بلدي ممزوجة بالأرز والبهارات، جاهزة للطهي بالصلصة على طريقة البيت.',
    price: 350, unit: 'كيلو جرام', image: `${IMG}/قسم مصنعات اللحوم/كفته أرز 350م.ج.png`, category: 'processed', rating: 4.7, isAvailable: true,
  },
  {
    id: 'proc-12', name: 'كفتة بلدي للشوي', description: 'كفتة لحم بلدي مفروم بنسب دهون مثالية ومتبلة بالبصل والبهارات، جاهزة للسيخ.',
    price: 380, unit: 'كيلو جرام', image: `${IMG}/قسم مصنعات اللحوم/كفته بلدى 380 م.ج.jpg`, category: 'processed', rating: 4.9, isAvailable: true, tag: 'جاهزة للسيخ',
  },
  {
    id: 'proc-13', name: 'كفتة داود باشا', description: 'كرات كفتة داود باشا متبلة جاهزة للطهي بالصلصة، وجبة شامية شهية وسريعة.',
    price: 350, unit: 'كيلو جرام', image: `${IMG}/قسم مصنعات اللحوم/كفته داود باشا 350 م.ج.png`, category: 'processed', rating: 4.8, isAvailable: true,
  },

  // ===== قسم الدواجن =====
  {
    id: 'poul-1', name: 'أجنحة فراخ', description: 'أجنحة دجاج طازجة منظفة بعناية، مثالية للتتبيل والشوي والقلي المقرمش.',
    price: 80, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/اجنحه 80 م.ج.png`, category: 'poultry', rating: 4.7, isAvailable: true,
  },
  {
    id: 'poul-2', name: 'استربس متبل جاهز', description: 'شرائح استربس دجاج متبلة جاهزة، سريعة التحمير ومثالية للساندويتشات والأطفال.',
    price: 225, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/استربس متبل جاهز 225.jpeg`, category: 'poultry', rating: 4.8, isAvailable: true, tag: 'جاهز للطهي',
  },
  {
    id: 'poul-3', name: 'بانيه فريش', description: 'شرائح بانيه دجاج طازجة بسمك متساوٍ ونظيف، سهلة التتبيل والتحمير السريع.',
    price: 225, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/بانيه  فريش 225م.ج.png`, category: 'poultry', rating: 4.8, isAvailable: true,
  },
  {
    id: 'poul-4', name: 'بانيه متبل جاهز', description: 'شرائح بانيه دجاج متبلة جاهزة بخلطة متوازنة، جاهزة للقلي مباشرة بطراوة فائقة.',
    price: 225, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/بانيه متبل جاهز 225 م.ج.png`, category: 'poultry', rating: 4.9, isAvailable: true, tag: 'سهل وسريع',
  },
  {
    id: 'poul-5', name: 'برجر فراخ', description: 'أقراص برجر دجاج طازجة متماسكة خالية من الصويا، مثالية للشواية والساندويتش.',
    price: 220, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/برجر فراخ 220 م.ج.png`, category: 'poultry', rating: 4.7, isAvailable: true,
  },
  {
    id: 'poul-6', name: 'دبوس فريش', description: 'دبابيس دجاج طازجة ممتلئة ومنظفة بعناية، مناسبة للشوي والطبخ والقلي.',
    price: 130, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/دبوس فريش 130 م.ج.png`, category: 'poultry', rating: 4.7, isAvailable: true,
  },
  {
    id: 'poul-7', name: 'دبوس متبل', description: 'دبابيس دجاج متبلة جاهزة بخلطة بهارات شهية، جاهزة للشوي أو الفرن مباشرة.',
    price: 130, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/دبوس متبل 130 م.ج.png`, category: 'poultry', rating: 4.8, isAvailable: true,
  },
  {
    id: 'poul-8', name: 'سجق فراخ', description: 'سجق دجاج بلدي متبل بغلاف طبيعي، خيار خفيف وشهي للشوي والقلي.',
    price: 220, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/سجق فراخ 220 م.ج.png`, category: 'poultry', rating: 4.7, isAvailable: true,
  },
  {
    id: 'poul-9', name: 'شاورما فراخ متبلة', description: 'شرائح شاورما دجاج متبلة جاهزة بخلطة سرية، جاهزة للطهي بطعم المطاعم.',
    price: 225, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/شاورما متبله 225 م.ج.png`, category: 'poultry', rating: 4.9, isAvailable: true, tag: 'جاهزة للطهي',
  },
  {
    id: 'poul-10', name: 'شيش طاووق فريش', description: 'مكعبات صدور دجاج طازجة نظيفة، جاهزة لتتبيلها وشيها على الفحم.',
    price: 200, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/شيش طاووق فريش 200 م.ج.png`, category: 'poultry', rating: 4.8, isAvailable: true,
  },
  {
    id: 'poul-11', name: 'شيش طاووق متبل', description: 'مكعبات شيش طاووق دجاج متبلة جاهزة بالزبادي والبهارات، جاهزة للشوي مباشرة.',
    price: 200, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/شيش طاووق متبل 200 م.ج.png`, category: 'poultry', rating: 4.9, isAvailable: true, tag: 'جاهز للشوي',
  },
  {
    id: 'poul-12', name: 'فراخ بالكيلو (بعد التنظيف)', description: 'دجاج فريش بالكيلو منظف بالكامل وجاهز للطبخ، طازج يومياً وبأعلى تعقيم.',
    price: 135, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/فراخ بالكيلو بعد التنظيف سعر الكيلو 135 م.ج.png`, category: 'poultry', rating: 4.8, isAvailable: true, minQuantity: 1, quantityStep: 1,
  },
  {
    id: 'poul-13', name: 'فراخ كاملة متبلة بالكيلو', description: 'فراخ كاملة متبلة جاهزة للفرن أو الشوي بخلطة بهارات شهية، طازجة يومياً.',
    price: 135, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/فراخ كامله متبله بالكيلو  سعر الكيلو 135 م.ج.png`, category: 'poultry', rating: 4.9, isAvailable: true, minQuantity: 1, quantityStep: 1, tag: 'جاهزة للفرن',
  },
  {
    id: 'poul-14', name: 'كبدة فراخ', description: 'كبدة دجاج طازجة منظفة، غنية بالحديد ومثالية للقلي السريع بالبهارات.',
    price: 115, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/كبده 115 م.ج.png`, category: 'poultry', rating: 4.7, isAvailable: true,
  },
  {
    id: 'poul-15', name: 'كفتة فراخ', description: 'كفتة دجاج متبلة جاهزة للشوي أو القلي، خفيفة وشهية ومناسبة للأطفال.',
    price: 220, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/كفته فراخ 220 م.ج.png`, category: 'poultry', rating: 4.8, isAvailable: true,
  },
  {
    id: 'poul-16', name: 'أوراك فريش', description: 'أوراك دجاج طازجة سميكة ممتلئة ومنظفة بعناية، مناسبة للشوي والطبخ.',
    price: 125, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/وراك فريش 125 م.ج.png`, category: 'poultry', rating: 4.7, isAvailable: true,
  },
  {
    id: 'poul-17', name: 'أوراك متبلة', description: 'أوراك دجاج متبلة جاهزة بخلطة بهارات شهية، جاهزة للشوي أو الفرن مباشرة.',
    price: 125, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/وراك متبل  125 م.ج.png`, category: 'poultry', rating: 4.8, isAvailable: true,
  },
  {
    id: 'poul-18', name: 'تشيكن جريل', description: 'شرائح تشيكن جريل دجاج طازجة متبلة، جاهزة للشوي أو التحمير بسرعة وبطراوة.',
    price: 225, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/تشكين جريل 225.jpeg`, category: 'poultry', rating: 4.9, isAvailable: true, tag: 'جاهز للشوي',
  },
  {
    id: 'poul-19', name: 'بفتيك متبل', description: 'شرائح بفتيك دجاج متبلة جاهزة بخلطة بهارات متوازنة، جاهزة للطهي مباشرة.',
    price: 450, unit: 'كيلو جرام', image: `${IMG}/قسم الدواجن/بفتيك متبل 450.jpeg`, category: 'poultry', rating: 4.8, isAvailable: true, tag: 'جاهز للطهي',
  },

  // ===== قسم الألبان والحلويات =====
  {
    id: 'dairy-1', name: 'أرز باللبن صغير سادة', description: 'أرز باللبن طازج بحجم صغير سادة، محضر من حليب مزارعنا النقي بقوام كريمي.',
    price: 17, unit: 'العبوة', image: `${IMG}/قسم الالبان/أرز لبن صغير ساده 17 م.ج.png`, category: 'dairy', rating: 4.9, isAvailable: true,
  },
  {
    id: 'dairy-2', name: 'أرز باللبن بالفرن صغير', description: 'أرز باللبن بالفرن بحجم صغير بوجه ذهبي محمّر، طعم بيتي أصيل وشهي.',
    price: 15, unit: 'العبوة', image: `${IMG}/قسم الالبان/أرز لبن فرن صغير 15 م.ج.png`, category: 'dairy', rating: 4.8, isAvailable: true,
  },
  {
    id: 'dairy-3', name: 'أرز باللبن بالفرن كبير عائلي', description: 'أرز باللبن بالفرن بحجم عائلي كبير، يكفي العائلة بقوام غني ووجه محمّر.',
    price: 35, unit: 'العبوة', image: `${IMG}/قسم الالبان/أرز لبن فرن كبير عائلى 35 م.ج.png`, category: 'dairy', rating: 4.9, isAvailable: true, tag: 'حجم عائلي',
  },
  {
    id: 'dairy-4', name: 'أرز باللبن كبير عائلي بالمكسرات', description: 'أرز باللبن عائلي كبير مزين بتشكيلة مكسرات فاخرة، حلوى دسمة لكل المناسبات.',
    price: 35, unit: 'العبوة', image: `${IMG}/قسم الالبان/أرز لبن كبير عائلى مكسرات 35م.ج.png`, category: 'dairy', rating: 5.0, isAvailable: true, tag: 'بالمكسرات',
  },
  {
    id: 'dairy-5', name: 'أم علي سادة', description: 'أم علي طازجة محضرة بالحليب الطبيعي والعجين المقرمش، حلوى دافئة شهية.',
    price: 20, unit: 'العبوة', image: `${IMG}/قسم الالبان/ام على ساده 20م.ج.jpg`, category: 'dairy', rating: 4.8, isAvailable: true,
  },
  {
    id: 'dairy-6', name: 'أم علي بالمكسرات', description: 'أم علي غنية بالحليب ومزينة بتشكيلة مكسرات محمصة، حلوى شرقية فاخرة.',
    price: 20, unit: 'العبوة', image: `${IMG}/قسم الالبان/ام على مكسرات 20 م.ج.png`, category: 'dairy', rating: 4.9, isAvailable: true, tag: 'بالمكسرات',
  },
  {
    id: 'dairy-7', name: 'بودينج', description: 'بودينج كريمي ناعم محضر من الحليب الطازج، حلوى باردة خفيفة ولذيذة.',
    price: 15, unit: 'العبوة', image: `${IMG}/قسم الالبان/بودينج 15م.ج.png`, category: 'dairy', rating: 4.7, isAvailable: true,
  },
  {
    id: 'dairy-8', name: 'جيلي سادة', description: 'جيلي فواكه طازج بقوام منعش، حلوى خفيفة وممتعة للأطفال والكبار.',
    price: 10, unit: 'العبوة', image: `${IMG}/قسم الالبان/جيلى ساده 10 م.ج.png`, category: 'dairy', rating: 4.6, isAvailable: true,
  },
  {
    id: 'dairy-9', name: 'رايب سادة', description: 'زبادي رايب طبيعي سادة محضر من حليب مزارعنا، قوام كثيف وطعم منعش.',
    price: 17, unit: 'العبوة', image: `${IMG}/قسم الالبان/رايب ساده 17 م.ج.png`, category: 'dairy', rating: 4.8, isAvailable: true,
  },
  {
    id: 'dairy-10', name: 'رايب بالفاكهة', description: 'زبادي رايب بالفاكهة الطبيعية، نكهة منعشة ومغذية مثالية للفطور والوجبات الخفيفة.',
    price: 20, unit: 'العبوة', image: `${IMG}/قسم الالبان/رايب فاكهه 20 م.ج.png`, category: 'dairy', rating: 4.8, isAvailable: true,
  },
  {
    id: 'dairy-11', name: 'زبادي كبير', description: 'زبادي طبيعي كبير الحجم محضر من حليب نقي، خالٍ من الإضافات وقوام كريمي.',
    price: 8, unit: 'العبوة', image: `${IMG}/قسم الالبان/زباد كبير 8 م.ج.png`, category: 'dairy', rating: 4.9, isAvailable: true, tag: 'طبيعي 100%',
  },
  {
    id: 'dairy-12', name: 'زبادي صغير', description: 'زبادي طبيعي بحجم صغير محضر يومياً من حليب مزارعنا، طازج وصحي.',
    price: 6, unit: 'العبوة', image: `${IMG}/قسم الالبان/زبادى صغير 6م.ج.png`, category: 'dairy', rating: 4.8, isAvailable: true,
  },
  {
    id: 'dairy-13', name: 'كاستر', description: 'كاستر كريمي طازج محضر من الحليب والبيض، حلوى ناعمة باردة لذيذة.',
    price: 15, unit: 'العبوة', image: `${IMG}/قسم الالبان/كاستر 15 م.ج.png`, category: 'dairy', rating: 4.7, isAvailable: true,
  },
  {
    id: 'dairy-14', name: 'كاستر شوكولاتة', description: 'كاستر بطعم الشوكولاتة الغني، حلوى ناعمة باردة يعشقها الصغار والكبار.',
    price: 15, unit: 'العبوة', image: `${IMG}/قسم الالبان/كاستر شوكولاته 15 م.ج.png`, category: 'dairy', rating: 4.8, isAvailable: true,
  },
  {
    id: 'dairy-15', name: 'كريم كراميل', description: 'كريم كراميل طازج بطبقة كراميل ذهبية وقوام حريري ناعم، حلوى فاخرة.',
    price: 20, unit: 'العبوة', image: `${IMG}/قسم الالبان/كريم كراميل 20 م.ج.png`, category: 'dairy', rating: 4.9, isAvailable: true,
  },
  {
    id: 'dairy-16', name: 'لبن فريش', description: 'حليب طازج طبيعي مستخلص يومياً من مزارعنا، غني وكامل الدسم بنكهة فلاحي.',
    price: 28, unit: 'العبوة', image: `${IMG}/قسم الالبان/لبن فريش 28 م.ج.png`, category: 'dairy', rating: 5.0, isAvailable: true, tag: 'طازج يومياً',
  },
  {
    id: 'dairy-17', name: 'مهلبية جيلي', description: 'مهلبية كريمية ناعمة مع طبقة جيلي منعشة، حلوى باردة مميزة الطبقات.',
    price: 15, unit: 'العبوة', image: `${IMG}/قسم الالبان/مهلبيه جيلى 15 م.ج.png`, category: 'dairy', rating: 4.7, isAvailable: true,
  },
  {
    id: 'dairy-18', name: 'مهلبية كاستر', description: 'مهلبية ناعمة مع طبقة كاستر غنية، حلوى باردة كريمية لذيذة.',
    price: 15, unit: 'العبوة', image: `${IMG}/قسم الالبان/مهلبيه كاستر 15 م.ج.png`, category: 'dairy', rating: 4.8, isAvailable: true,
  },
  {
    id: 'dairy-19', name: 'مهلبية كاستر وجيلي', description: 'طبقات مهلبية وكاستر وجيلي في كوب واحد، حلوى باردة متعددة النكهات.',
    price: 15, unit: 'العبوة', image: `${IMG}/قسم الالبان/مهلبيه كاستر جيلى 15م.ج.png`, category: 'dairy', rating: 4.9, isAvailable: true, tag: 'متعددة الطبقات',
  },

  // ===== قسم الجبن =====
  {
    id: 'cheese-1', name: 'بسطرمه بلدى', description: 'منتج مدخن وبارد فاخر، يُقطّع حسب الطلب بجودة عالية.',
    price: 575, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/بسطرمه بلدى  ٥٧٥.jpg`, category: 'cheese', rating: 4.5, isAvailable: true, tag: 'فاخر',
  },
  {
    id: 'cheese-2', name: 'تركى مدخن حلوانى', description: 'منتج مدخن وبارد فاخر، يُقطّع حسب الطلب بجودة عالية.',
    price: 560, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/تركى مدخن حلوانى ٥٦٠.jpg`, category: 'cheese', rating: 4.6, isAvailable: true, tag: 'فاخر',
  },
  {
    id: 'cheese-3', name: 'تركى مدخن فريش فارم', description: 'منتج مدخن وبارد فاخر، يُقطّع حسب الطلب بجودة عالية.',
    price: 480, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/تركى مدخن فريش فارم ٤٨٠.jpg`, category: 'cheese', rating: 4.7, isAvailable: true,
  },
  {
    id: 'cheese-4', name: 'جبنه إسطنبولى', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 210, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه إسطنبولى ٢١٠.jpg`, category: 'cheese', rating: 4.8, isAvailable: true,
  },
  {
    id: 'cheese-5', name: 'جبنه افانتى كريمى', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 210, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه افانتى كريمى ٢١٠.jpg`, category: 'cheese', rating: 4.9, isAvailable: true,
  },
  {
    id: 'cheese-6', name: 'جبنه براميلى خشاله', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 205, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه براميلى خشاله ٢٠٥.jpg`, category: 'cheese', rating: 4.5, isAvailable: true,
  },
  {
    id: 'cheese-7', name: 'جبنه براميلى فلفل', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 195, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه براميلى فلفل ١٩٥.jpg`, category: 'cheese', rating: 4.6, isAvailable: true,
  },
  {
    id: 'cheese-8', name: 'جبنه براميلى كاريبى', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 210, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه برميلى كاريبى .jpeg`, category: 'cheese', rating: 4.7, isAvailable: true,
  },
  {
    id: 'cheese-9', name: 'جبنه براميلى مزبده', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 195, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه براميلى مزبده ١٩٥.jpg`, category: 'cheese', rating: 4.8, isAvailable: true,
  },
  {
    id: 'cheese-10', name: 'جبنه براميلى ناشفه', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 195, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه براميلى ناشفه ١٩٥.jpg`, category: 'cheese', rating: 4.9, isAvailable: true,
  },
  {
    id: 'cheese-11', name: 'جبنه جوده مستوردة', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 600, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه جوده مستوردة  ٦٠٠.jpg`, category: 'cheese', rating: 4.5, isAvailable: true, tag: 'فاخر',
  },
  {
    id: 'cheese-12', name: 'جبنه ريكفورد مستورد', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 700, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه ريكفورد مستورد ٧٠٠.jpg`, category: 'cheese', rating: 4.6, isAvailable: true, tag: 'فاخر',
  },
  {
    id: 'cheese-13', name: 'شيدر أحمر', description: 'جبنة شيدر أحمر أفانتي مقطعة، نكهة غنية ومثالية للساندويتشات والوجبات.',
    price: 350, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/شيدر احمر 350.jpeg`, category: 'cheese', rating: 4.7, isAvailable: true,
  },
  {
    id: 'cheese-14', name: 'جبنه شيدر مستورد', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 500, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه شيدر  مستورده.jpeg`, category: 'cheese', rating: 4.8, isAvailable: true, tag: 'فاخر',
  },
  {
    id: 'cheese-15', name: 'جبنه شيدر مصرى', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 110, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه شيدر مصرى ١١٠.jpg`, category: 'cheese', rating: 4.9, isAvailable: true, tag: 'اقتصادي',
  },
  {
    id: 'cheese-16', name: 'جبنه فلمنك فريكو مستورده', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 800, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه فلمنك فريكو مستورده.jpeg`, category: 'cheese', rating: 4.5, isAvailable: true, tag: 'فاخر',
  },
  {
    id: 'cheese-17', name: 'جبنه فيومى', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 185, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه فيومى ١٨٥.jpg`, category: 'cheese', rating: 4.6, isAvailable: true,
  },
  {
    id: 'cheese-18', name: 'جبنه قريش نورا', description: 'جبنة قريش طازجة خفيفة وصحية، غنية بالبروتين.',
    price: 135, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه قريش نورا ١٣٥.jpg`, category: 'cheese', rating: 4.7, isAvailable: true,
  },
  {
    id: 'cheese-19', name: 'جبنه كاريبى بالقشطه', description: 'قشطة بلدية طازجة كثيفة، مثالية للحلويات والفطور.',
    price: 185, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه كاريبى بالقشطه ١٨٥.jpg`, category: 'cheese', rating: 4.8, isAvailable: true,
  },
  {
    id: 'cheese-20', name: 'جبنه كريمى طبيعى دومتى', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 240, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه كريمى طبيعى دومتى .jpeg`, category: 'cheese', rating: 4.9, isAvailable: true,
  },
  {
    id: 'cheese-21', name: 'جبنه ملح خفيف  الوادى', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 155, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه ملح خفيف  الوادى ١٥٥.jpg`, category: 'cheese', rating: 4.5, isAvailable: true,
  },
  {
    id: 'cheese-22', name: 'جبنه ملح خفيف الدوار', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 220, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/جبنه ملح خفيف الدوار ٢٢٠.jpg`, category: 'cheese', rating: 4.6, isAvailable: true,
  },
  {
    id: 'cheese-23', name: 'روزبيف فريش فارم', description: 'منتج مدخن وبارد فاخر، يُقطّع حسب الطلب بجودة عالية.',
    price: 520, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/روزبيف فريش فارم ٥٢٠.jpg`, category: 'cheese', rating: 4.7, isAvailable: true, tag: 'فاخر',
  },
  {
    id: 'cheese-24', name: 'رومى قديم', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 305, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/رومى قديم ٣٠٥.jpg`, category: 'cheese', rating: 4.8, isAvailable: true,
  },
  {
    id: 'cheese-25', name: 'رومى كافيار', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 320, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/رومى كافيار ٣٢٠.webp`, category: 'cheese', rating: 4.9, isAvailable: true,
  },
  {
    id: 'cheese-26', name: 'رومى وسط', description: 'جبنة طازجة فاخرة تُباع بالوزن، اختر الكمية المناسبة لك.',
    price: 295, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/رومى وسط ٢٩٥.jpg`, category: 'cheese', rating: 4.5, isAvailable: true,
  },
  {
    id: 'cheese-27', name: 'سلامى حلوانى', description: 'منتج مدخن وبارد فاخر، يُقطّع حسب الطلب بجودة عالية.',
    price: 400, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/سلامى حلوانى ٤٠٠.jpg`, category: 'cheese', rating: 4.6, isAvailable: true,
  },
  {
    id: 'cheese-28', name: 'قشطه بلدى لف', description: 'قشطة بلدية طازجة كثيفة ملفوفة، مثالية للحلويات والفطور.',
    price: 400, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/قشطه بلدى لف 400.jpeg`, category: 'cheese', rating: 4.7, isAvailable: true,
  },
  {
    id: 'cheese-29', name: 'لانشون حلوانى زيتون', description: 'لانشون طازج مقطع بعناية، مثالي للساندويتشات والفطار.',
    price: 320, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/لانشون حلوانى زيتون ٣٢٠.jpg`, category: 'cheese', rating: 4.8, isAvailable: true,
  },
  {
    id: 'cheese-30', name: 'لانشون حلوانى ساده', description: 'لانشون طازج مقطع بعناية، مثالي للساندويتشات والفطار.',
    price: 320, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/لانشون حلوانى ساده٣٢٠.jpg`, category: 'cheese', rating: 4.9, isAvailable: true,
  },
  {
    id: 'cheese-31', name: 'لانشون حلوانى فراخ', description: 'لانشون طازج مقطع بعناية، مثالي للساندويتشات والفطار.',
    price: 320, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/لانشون حلوانى فراخ ٣٢٠.jpg`, category: 'cheese', rating: 4.5, isAvailable: true,
  },
  {
    id: 'cheese-32', name: 'لانشون حلوانى فراخ مدخن', description: 'لانشون طازج مقطع بعناية، مثالي للساندويتشات والفطار.',
    price: 445, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/لانشون حلوانى فراخ مدخن ٤٤٥.jpg`, category: 'cheese', rating: 4.6, isAvailable: true,
  },
  {
    id: 'cheese-33', name: 'لانشون حلوانى فلفل', description: 'لانشون طازج مقطع بعناية، مثالي للساندويتشات والفطار.',
    price: 320, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/لانشون حلوانى فلفل٣٢٠.jpg`, category: 'cheese', rating: 4.7, isAvailable: true,
  },
  {
    id: 'cheese-34', name: 'لانشون فريش فارم', description: 'لانشون طازج مقطع بعناية، مثالي للساندويتشات والفطار.',
    price: 310, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/لانشون فريش فارم ٣١٠.jpg`, category: 'cheese', rating: 4.8, isAvailable: true,
  },
  {
    id: 'cheese-35', name: 'لانشون فريش فارم بسطرمه', description: 'لانشون طازج مقطع بعناية، مثالي للساندويتشات والفطار.',
    price: 375, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/لانشون فريش فارم بسطرمه  ٣٧٥.jpg`, category: 'cheese', rating: 4.9, isAvailable: true,
  },
  {
    id: 'cheese-36', name: 'لانشون فريش فارم فراخ', description: 'لانشون طازج مقطع بعناية، مثالي للساندويتشات والفطار.',
    price: 310, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/لانشون فريش فارم فراخ ٣١٠.jpg`, category: 'cheese', rating: 4.5, isAvailable: true,
  },
  {
    id: 'cheese-37', name: 'مش صعيدى', description: 'مش بلدي أصيل بنكهة غنية، يُباع بالوزن حسب اختيارك.',
    price: 145, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/مش صعيدى ١٤٥.jpg`, category: 'cheese', rating: 4.6, isAvailable: true,
  },
  {
    id: 'cheese-38', name: 'مش لهاليبو', description: 'مش بلدي أصيل بنكهة غنية، يُباع بالوزن حسب اختيارك.',
    price: 95, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/مش لهاليبو ٩٥.jpg`, category: 'cheese', rating: 4.7, isAvailable: true, tag: 'اقتصادي',
  },
  {
    id: 'cheese-39', name: 'البخيرة الحفني', description: 'بخيرة بلدية طازجة من مزارع الحفني، غنية بالبروتين ومناسبة للفطور.',
    price: 150, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/ال حفنى بخيره 150.jpeg`, category: 'cheese', rating: 4.8, isAvailable: true,
  },
  {
    id: 'cheese-40', name: 'كيري نورا', description: 'جبنة كيري طرية بنكهة مميزة، مثالية للساندويتشات والوجبات الخفيفة.',
    price: 150, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/كيرى نورا 150.jpeg`, category: 'cheese', rating: 4.7, isAvailable: true,
  },
  {
    id: 'cheese-41', name: 'قريش الحفني منزوع الدسم', description: 'قريش الحفني منزوع الدسم، خفيف وصحي وغني بالبروتين.',
    price: 135, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/قريش ال حفنى منزوع الدسم 135.jpeg`, category: 'cheese', rating: 4.8, isAvailable: true, tag: 'صحي',
  },
  {
    id: 'cheese-42', name: 'لبنة زيت زيتون', description: 'لبنة طرية بنكهة زيت الزيتون، مثالية للفطور والساندويتشات.',
    price: 130, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/لبنه زيت زيتون 130.jpeg`, category: 'cheese', rating: 4.7, isAvailable: true,
  },
  {
    id: 'cheese-43', name: 'لبنة زيت زيتون وزعتر', description: 'لبنة بنكهة زيت الزيتون والزعتر، طعم بلدي أصيل للفطور.',
    price: 130, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/لبنه زيت زيتون و زعتر 130.jpeg`, category: 'cheese', rating: 4.8, isAvailable: true,
  },
  {
    id: 'cheese-44', name: 'تحابيش الحفني', description: 'تحابيش جبن بلدي من مزارع الحفني، نكهة غنية ومميزة.',
    price: 135, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/تحابيش ال حفنى 135.jpeg`, category: 'cheese', rating: 4.6, isAvailable: true,
  },
  {
    id: 'cheese-45', name: 'شيدر كمون', description: 'جبنة شيدر بالكمون أفانتي مقطعة، نكهة مميزة للساندويتشات والوجبات.',
    price: 350, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/شيدر كمون 350.jpeg`, category: 'cheese', rating: 4.7, isAvailable: true,
  },
  {
    id: 'cheese-46', name: 'شيدر مدخن', description: 'جبنة شيدر مدخنة أفانتي مقطعة، طعم غني ومثالي للساندويتشات.',
    price: 350, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/شيدر مدخن 350.jpeg`, category: 'cheese', rating: 4.8, isAvailable: true,
  },
  {
    id: 'cheese-47', name: 'بانيه متبل جاهز', description: 'شرائح بانيه متبلة جاهزة للقلي، سريعة التحضير ومقرمشة.',
    price: 190, unit: 'كيلو جرام', image: `${IMG}/قسم الجبن/190 بانيه متبل جاهز.jpeg`, category: 'cheese', rating: 4.8, isAvailable: true, tag: 'جاهز للطهي',
  },
];

export const REVIEWS: Review[] = [
  {
    id: '1',
    name: 'أحمد محمود',
    comment: 'بصراحة اللحمة من عندهم ممتازة والقطعيات تجنن! جربت الاستيك والريش واللحمة دايبة خالص والخدمة والتوصيل غاية في السرعة.',
    rating: 5,
    date: 'منذ يومين',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: '2',
    name: 'أم محمد شريف',
    comment: 'الزبادي والأرز باللبن وأم علي عندهم حكاية تانية خالص! نضيفة ومعمولة بذمة وطعمها فلاحي أصيل وصحي للأولاد. شكراً مزارع الحفني على المصداقية.',
    rating: 5,
    date: 'منذ 5 أيام',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: '3',
    name: 'حازم الصاوي',
    comment: 'جربت السجق والبرجر والكفتة في مصنعات اللحوم وكانت ممتازة، خالية من الصويا ومن الواضح جداً جودتها وخاصةً خلطة السجق الشرقي.',
    rating: 4,
    date: 'منذ أسبوع',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: '4',
    name: 'نهى فريد',
    comment: 'الدواجن والبانيه والشاورما المتبلة مغسولة ومتنضفة كويس جداً ومفيش ريحة زفارة نهائي والأسعار ممتازة جداً مقارنة بالجودة والتوصيل.',
    rating: 5,
    date: 'منذ ١٠ أيام',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  }
];

export const FARM_INFO = {
  phone: '+20111355114',
  phoneFormatted: '0111355114',
  whatsapp: '201017889922',
  whatsappFormatted: '01017889922',
  email: 'info@alhafni-farms.com',
  address: 'امتداد الإباصيري، خلف الرقابة الإدارية، بجوار كافيه أم كلثوم، بني سويف، مصر',
  city: 'بني سويف، مصر',
  facebook: 'https://www.facebook.com/alhafni.farms',
  hours: 'يومياً من ١٠ صباحاً حتى ١١ مساءً',
};
