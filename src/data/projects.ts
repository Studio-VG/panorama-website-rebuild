import { ProjectItem } from '../types';

/**
 * NOTE ON IMAGES: these six case studies use stock photography as visual
 * placeholders (the same approach the previous build used) because no real
 * job-site photos for these specific projects were supplied. The copy,
 * specs and architect credits are real Panorama project data - only the
 * photography is a stand-in. Swap the `image` / `beforeAfterImage` URLs for
 * real site photos as they become available; everything else can stay.
 */
export const projectsData: ProjectItem[] = [
  {
    id: 'tskneti-hillside-villa',
    category: 'villa',
    city: 'Tbilisi',
    year: 2025,
    area: '145 m\u00b2',
    title: {
      ka: 'კერძო ვილა წყნეთში — პანორამული სლაიდ კედლები',
      en: 'Tskneti Hillside Villa — Panoramic Sliding Walls',
      ru: 'Вилла в Цхнети — Панорамные раздвижные стены',
    },
    location: {
      ka: 'წყნეთი, თბილისი (მთის ხედი)',
      en: 'Tskneti, Tbilisi (Mountain View)',
      ru: 'Цхнети, Тбилиси (Вид на горы)',
    },
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    beforeAfterImage: {
      before: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      after: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    },
    systemsUsed: ['Minimalist Sliding (Slimline 20mm)', 'Glass Balustrades 10+10mm', 'Automated Somfy Drive'],
    architect: 'Arch-Studio Tbilisi',
    description: {
      ka: '12-მეტრიანი უწყვეტი მინის გახსნა მისაღებ ოთახსა და გარე ტერასას შორის. ჩაფლული იატაკის რელსი და სამმაგი ენერგოდამზოგი მინაპაკეტი Low-E არგონის შევსებით, რომელიც ინარჩუნებს სიმყუდროვეს ზამთრის ყინვებში.',
      en: 'A continuous 12-meter glass opening connecting the grand living salon to the mountain viewing deck. Engineered with zero-barrier flush floor tracks and triple-glazed Low-E argon packages for winter thermal protection.',
      ru: '12-метровый сплошной световой проем, объединяющий гостиную с открытой террасой. Беспороговый скрытый рельс и тройной энергосберегающий стеклопакет с аргоном для защиты от зимних холодов.',
    },
    highlightSpecs: {
      ka: ['თერმული კოეფიციენტი: Uw = 0.88 W/m²K', 'ფრთის სიმაღლე: 3.4 მეტრი', 'ქარის დატვირთვის კლასი: C5'],
      en: ['Thermal Performance: Uw = 0.88 W/m\u00b2K', 'Sash Height: 3.4 meters', 'Wind Load Rating: Class C5'],
      ru: ['Коэффициент теплопередачи: Uw = 0.88 W/m\u00b2K', 'Высота створок: 3.4 м', 'Класс ветроустойчивости: C5'],
    },
  },
  {
    id: 'batumi-seafront-penthouse',
    category: 'penthouse',
    city: 'Batumi',
    year: 2025,
    area: '92 m\u00b2',
    title: {
      ka: 'პენტჰაუსი ბათუმის ბულვარზე — ბიოკლიმატური პერგოლა & გილიოტინა',
      en: 'Batumi Boulevard Penthouse — Bioclimatic Pergola & Guillotine',
      ru: 'Пентхаус на Бульваре Батуми — Пергола и гильотины',
    },
    location: {
      ka: 'ახალი ბულვარი, ბათუმი (ზღვის პირველი ზოლი)',
      en: 'New Boulevard, Batumi (Seafront Line)',
      ru: 'Новый Бульвар, Батуми (Первая линия моря)',
    },
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    beforeAfterImage: {
      before: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      after: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    },
    systemsUsed: ['Bioclimatic Louvered Pergola', 'Motorized Guillotine Glass', 'Integrated LED & Wind Sensor'],
    architect: 'Batumi Design Lab',
    description: {
      ka: 'ზღვის ქარისა და ნალექებისგან დაცული ექსკლუზიური რუფტოპ სივრცე. გილიოტინის მინები იმართება პულტით და წამებში გარდაიქმნება დახურულ მყუდრო ზონად შტორმის დროს.',
      en: 'Exclusive high-altitude rooftop retreat protected against coastal Black Sea gales. Automated motorized guillotine walls and rotating louvers seal the outdoor lounge instantaneously upon rain or wind sensor triggers.',
      ru: 'Эксклюзивная терраса на крыше с защитой от морских бризов и дождей. Моторизованные гильотинные стекла и поворотные ламели автоматически защищают лаунж-зону при порывах ветра.',
    },
    highlightSpecs: {
      ka: ['ქარის გაძლება: 120 კმ/სთ', 'სრული Somfy ავტომატიზაცია', 'Qualicoat ზღვის კლიმატზე მორგებული შეღებვა'],
      en: ['Wind Resistance: 120 km/h gusts', 'Full Somfy smart home integration', 'Marine-grade Qualicoat seaside powder coating'],
      ru: ['Устойчивость к порывам ветра: 120 км/ч', 'Полная автоматизация Somfy', 'Морское антикоррозийное покрытие Qualicoat'],
    },
  },
  {
    id: 'kakheti-wine-pavilion',
    category: 'commercial',
    city: 'Kakheti',
    year: 2024,
    area: '210 m\u00b2',
    title: {
      ka: 'სადეგუსტაციო პავილიონი კახეთში — მინის ზამთრის ბაღი',
      en: 'Kakheti Vineyard Pavilion — Architectural Glass Conservatory',
      ru: 'Дегустационный зал в Кахетии — Стеклянный зимний сад',
    },
    location: {
      ka: 'თელავი / ყვარელი, კახეთი (ვენახების ხედი)',
      en: 'Telavi / Kvareli, Kakheti (Vineyard Vista)',
      ru: 'Телави / Кварели, Кахетия (Вид на виноградники)',
    },
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
    systemsUsed: ['Architectural Glass Roofing', 'Frameless Folding Glazing', 'Solar Control Low-E Glass'],
    architect: 'Kvali Architecture',
    description: {
      ka: 'პრემიუმ მარნის სადეგუსტაციო დარბაზი 360-გრადუსიანი ხედით კავკასიონსა და ალაზნის ველზე. Solar Control მინაპაკეტი იცავს ზაფხულის მაღალი ტემპერატურისგან.',
      en: 'A 360-degree glass tasting pavilion offering panoramic views of the Alazani Valley and the Caucasus mountains. Multi-functional Solar Control coating prevents solar heat build-up during warm Georgian summers.',
      ru: 'Панорамный дегустационный павильон с обзором 360 градусов на Алазанскую долину и Кавказский хребет. Мультифункциональное стекло Solar Control сохраняет прохладу жарким летом.',
    },
    highlightSpecs: {
      ka: ['მინის სახურავის ფართობი: 120 მ²', 'მზის ენერგიის კოეფიციენტი g = 0.34', '100%-ით გასახსნელი ფასადი'],
      en: ['Glass Roof Area: 120 m\u00b2', 'Solar Heat Gain Coefficient g = 0.34', '100% Retractable perimeter facade'],
      ru: ['Площадь стеклянной кровли: 120 м²', 'Фактор солнечной защиты g = 0.34', '100% раскрытие фасадной линии'],
    },
  },
  {
    id: 'vake-modern-residence',
    category: 'residence',
    city: 'Tbilisi',
    year: 2025,
    area: '110 m\u00b2',
    title: {
      ka: 'თანამედროვე რეზიდენცია ვაკეში — მინიმალისტური ფასადი & მოაჯირები',
      en: 'Vake Contemporary Residence — Minimalist Facade & Balustrades',
      ru: 'Резиденция в Ваке — Минималистичный фасад и перила',
    },
    location: { ka: 'ვაკე, თბილისი', en: 'Vake, Tbilisi', ru: 'Ваке, Тбилиси' },
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    systemsUsed: ['Minimalist Sliding Doors', 'Embedded Base-Shoe Railings', 'Acoustic Triplex Glass'],
    architect: 'Spectrum Architecture',
    description: {
      ka: 'ურბანული კომფორტის მაგალითი თბილისის ცენტრში: ხმის მაღალი იზოლაცია (42 დეციბელი) ქალაქის ხმაურისგან დასაცავად და უხილავი მინის მოაჯირები ტერასებზე.',
      en: 'Urban luxury in central Tbilisi featuring high-performance acoustic laminated glazing (Rw = 42 dB) to block city noise alongside frameless embedded floor glass balustrades.',
      ru: 'Городская премиум-резиденция в центре Тбилиси: повышенная шумоизоляция (Rw = 42 дБ) и бесшовные стеклянные ограждения террас, скрытые в пол.',
    },
    highlightSpecs: {
      ka: ['ხმის იზოლაცია: Rw = 42 dB', 'მოაჯირის მინა: 10+10 Triplex', 'პროფილის ფერი: RAL 7016 Anthracite Matt'],
      en: ['Sound Reduction: Rw = 42 dB', 'Railing Glass: 10+10mm SentryGlas Triplex', 'Profile Finish: RAL 7016 Anthracite Matt'],
      ru: ['Шумоизоляция: Rw = 42 дБ', 'Стекло перил: 10+10 мм триплекс', 'Цвет профиля: RAL 7016 Матовый антрацит'],
    },
  },
  {
    id: 'saguramo-estate-pool',
    category: 'villa',
    city: 'Mtskheta',
    year: 2024,
    area: '165 m\u00b2',
    title: {
      ka: 'აგარაკი საგურამოში — აუზის ზონის პანორამული შემინვა',
      en: 'Saguramo Estate — Poolside Panoramic Enclosure',
      ru: 'Усадьба в Сагурамо — Панорамное остекление зоны бассейна',
    },
    location: { ka: 'საგურამო, მცხეთა', en: 'Saguramo, Mtskheta', ru: 'Сагурамо, Мцхета' },
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    systemsUsed: ['Heavy Lift-and-Slide Doors', 'Glass Canopy & Skylights', 'Stainless Steel Hardware'],
    description: {
      ka: 'საგურამოს მზიან ხეობაში აშენებული ვილის აუზის პავილიონი, სადაც 6 მეტრიანი სლაიდ კარები წამებში აერთიანებს შიდა აუზს ეზოს ლანდშაფტთან.',
      en: 'A private country retreat pool pavilion in Saguramo where 6-meter sliding panels effortlessly slide back to blend the indoor heated pool with outdoor manicured gardens.',
      ru: 'Павильон с подогреваемым бассейном в Сагурамо: 6-метровые раздвижные конструкции позволяют объединить зону отдыха с садом в теплое время года.',
    },
    highlightSpecs: {
      ka: ['ფრაქციის გაღების სიგანე: 5.8 მ', 'ანტიკოროზიული ფურნიტურა აუზის ტენიანობისთვის', 'ენერგოეფექტურობა: A+'],
      en: ['Clear Opening Width: 5.8 m', 'Anti-corrosion hardware for indoor pool humidity', 'Energy Efficiency: A+'],
      ru: ['Ширина открытого проема: 5.8 м', 'Антикоррозийная фурнитура для влажных зон', 'Энергоэффективность: A+'],
    },
  },
  {
    id: 'gudauri-alpine-chalet',
    category: 'villa',
    city: 'Gudauri',
    year: 2025,
    area: '130 m\u00b2',
    title: {
      ka: 'ალპური შალე გუდაურში — თბოიზოლირებული მინა-ალუმინის ფასადი',
      en: 'Gudauri Alpine Chalet — Extreme Weather Glazing',
      ru: 'Альпийское шале в Гудаури — Высокогорное остекление',
    },
    location: { ka: 'გუდაური (2,200 მ ზღვის დონიდან)', en: 'Gudauri (2,200m Elevation)', ru: 'Гудаури (2 200 м над уровнем моря)' },
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    systemsUsed: ['Extreme Thermal Break Profiles', 'Heated & Triple Low-E Glass', 'Snow Load Structural Bracing'],
    description: {
      ka: 'მკაცრ კლიმატურ პირობებში (ყინვა -25°C, თოვლის საფარი 2 მეტრი) დაპროექტებული სამმაგი მინაპაკეტის ფასადი სპეციალური წნევის გამათანაბრებელი სარქველებით.',
      en: 'Extreme climate structural glazing engineered for 2,200m elevation (temperatures down to -25\u00b0C, high snow loads) equipped with capillary pressure equalization valves.',
      ru: 'Высокогорное остекление для экстремальных условий (-25°C, снежный покров до 2 метров) с капиллярными клапанами выравнивания давления в стеклопакетах.',
    },
    highlightSpecs: {
      ka: ['თბოგადაცემა: Uw = 0.75 W/m²K', 'თოვლის დატვირთვა: 350 კგ/მ²', 'კაპილარული სარქველები სიმაღლისთვის'],
      en: ['Thermal Transmittance: Uw = 0.75 W/m\u00b2K', 'Snow Load Capacity: 350 kg/m\u00b2', 'Altitude capillary balancing valves'],
      ru: ['Теплоизоляция: Uw = 0.75 W/m²K', 'Снеговая нагрузка: 350 кг/м²', 'Капиллярные клапаны для высоты'],
    },
  },
];
