import { SystemListing } from '../types';

/**
 * PRICING NOTE FOR THE SITE OWNER:
 * startingPricePerM2 below is a realistic, internally-consistent set of
 * placeholder rates (insect screens cheapest, structural glazing dearest) -
 * useful so the cost calculator gives a differentiated, believable answer
 * instead of quoting the same flat number for every system. They are NOT
 * your verified price list. Update these six numbers whenever you have
 * real figures; nothing else in the calculator needs to change.
 *
 * SPECS NOTE: the engineering figures below (Uw, Rw, wind class, etc.) are
 * realistic for this class of European-profile system, in the same style
 * as the specs you already wrote for individual projects. Swap in your
 * fabricator's actual certified datasheet numbers when you have them.
 */
export const CATALOG: SystemListing[] = [
  {
    id: 'glazed-terrace',
    slug: 'glazed-terrace',
    slotNumber: 1,
    category: 'glazing',
    name: { ka: 'შემინული ტერასა', en: 'Glazed Terrace', ru: 'Остекленная терраса' },
    tagline: { ka: 'სისტემა #01', en: 'System #01', ru: 'Система #01' },
    image: '/user-listings/slot-1.jpg',
    specs: {
      profileWidth: 'Slimline 20\u201345mm',
      thermalInsulation: 'Uw = 0.9\u20131.3 W/m\u00b2K',
      soundInsulation: 'Rw up to 38 dB',
      maxGlassThickness: '24\u201340mm (Double/Triple)',
      maxPanelWeight: '300\u2013500 kg',
      maxPanelHeight: 'Up to 3.2m',
      waterTightness: 'Class E750',
      windLoadResistance: 'Class C4 / 1600 Pa',
      airPermeability: 'Class 3',
    },
    profilePartners: ['Sch\u00fcco', 'Reynaers', 'Cortizo'],
    automationOptions: {
      ka: ['მექანიკური', 'ავტომატური Somfy ძრავი'],
      en: ['Manual', 'Automated Somfy drive'],
      ru: ['Механический', 'Автоматический привод Somfy'],
    },
    idealFor: {
      ka: ['აივნები & ტერასები', 'ვილები', 'რესტორნების ღია ზონები'],
      en: ['Balconies & terraces', 'Villas', 'Restaurant open-air zones'],
      ru: ['Балконы и террасы', 'Виллы', 'Летние зоны ресторанов'],
    },
    startingPricePerM2: { GEL: 560, USD: 212, EUR: 193 },
    description: {
      ka: 'შემინული აივანი და ტერასა წარმოადგენს თანამედროვე არქიტექტურულ ელემენტს, რომელიც სტრუქტურული მინის პანელების, სრულ სიმაღლეზე შემინვისა და გამჭვირვალე მოაჯირების მეშვეობით შეუფერხებლად აერთიანებს შიდა და გარე საცხოვრებელ სივრცეებს.\n\nმთავარი არქიტექტურული მახასიათებლები\n\nუჩარჩოო მინის მოაჯირები: გამჭვირვალე უსაფრთხო მინის მოაჯირები ქმნის ღია, მსუბუქ ესთეტიკას და უზრუნველყოფს დაუბრკოლებელ, პანორამულ ხედებს.\n\nიატაკიდან ჭერამდე გასაწევი შემინვა: ფართო მინის ფასადები ინტერიერს ბუნებრივი სინათლით ავსებს და ტერასის სივრცეში მარტივ, თავისუფალ გადასვლას უზრუნველყოფს.\n\nინტეგრირებული გამყოფი ტიხრები: მქრქალი ან გაუმჭვირვალე ვერტიკალური მინის ეკრანები ქმნის მკაფიო ვიზუალურ ზღვარს მეზობელ ერთეულებს შორის, შენობის ერთიანი და დახვეწილი სტილის დარღვევის გარეშე.\n\nმასალების კონტრასტი: გამჭვირვალე მინა აბალანსებს ისეთ მასიურ არქიტექტურულ ელემენტებს, როგორიცაა კონსოლური თეთრი ფილები, მუქი სოფიტის პანელები და ხის თბილი მოსაპირკეთებელი დეტალები.\n\nმთავარი უპირატესობები\n\nბუნებრივი განათების მაქსიმიზაცია: საგრძნობლად აუმჯობესებს დღის სინათლის შეღწევადობას ინტერიერის სიღრმეში.\n\nკლიმატური და აკუსტიკური ბარიერი: ქმნის ეფექტურ თერმულ იზოლაციას და ამცირებს გარე ხმაურს, ამასთანავე ინარჩუნებს ღია სივრცის შეგრძნებას.\n\nთანამედროვე ესთეტიკური მიმზიდველობა: ქმნის დახვეწილ, მინიმალისტურ გეომეტრიულ ხაზებს, რომლებიც თანამედროვე პრემიუმ-კლასის საცხოვრებელი არქიტექტურისთვის არის დამახასიათებელი.',
      en: 'A glazed balcony or terrace is a modern architectural element that uses structural glass panels, floor-to-ceiling glazing and frameless railings to blend indoor and outdoor living space without interruption.\n\nKey Features\n\nFrameless glass railings: transparent safety-glass balustrades create an open, light aesthetic and preserve an unbroken, panoramic view.\n\nFloor-to-ceiling sliding glazing: wide glass facades flood the interior with natural light and give the terrace a simple, free transition to the outdoors.\n\nIntegrated divider screens: frosted or opaque vertical glass panels create a clear visual boundary between neighboring units without breaking the building\u2019s unified, refined style.\n\nMaterial contrast: transparent glass balances heavier architectural elements such as cantilevered white slabs, dark soffit panels and warm timber cladding.\n\nKey Benefits\n\nMaximized natural light: significantly improves daylight penetration deep into the interior.\n\nClimate and acoustic barrier: creates effective thermal insulation and reduces outside noise while keeping the feeling of an open space.\n\nContemporary aesthetic appeal: produces the refined, minimalist geometric lines characteristic of premium modern residential architecture.',
      ru: 'Остеклённый балкон и терраса \u2014 современный архитектурный элемент, который с помощью структурных стеклянных панелей, остекления от пола до потолка и безрамных ограждений бесшовно объединяет внутреннее и наружное жилое пространство.\n\nОсновные характеристики\n\nБезрамные стеклянные перила: прозрачные ограждения из безопасного стекла создают лёгкую, открытую эстетику и не ограничивают панорамный вид.\n\nОстекление от пола до потолка: широкие стеклянные фасады наполняют интерьер естественным светом и обеспечивают свободный переход в пространство террасы.\n\nВстроенные разделительные экраны: матовые или непрозрачные вертикальные стеклянные перегородки создают чёткую визуальную границу между соседними зонами, не нарушая единый стиль здания.\n\nКонтраст материалов: прозрачное стекло уравновешивает массивные архитектурные элементы \u2014 консольные белые плиты, тёмные софиты и тёплую деревянную отделку.\n\nОсновные преимущества\n\nМаксимум естественного света: заметно улучшает проникновение дневного света в глубину интерьера.\n\nКлиматический и акустический барьер: создаёт эффективную теплоизоляцию и снижает уличный шум, сохраняя ощущение открытого пространства.\n\nСовременная эстетика: чёткие минималистичные геометрические линии, характерные для премиальной современной жилой архитектуры.',
    },
  },
  {
    id: 'sunscreen-blinds',
    slug: 'sunscreen-blinds',
    slotNumber: 2,
    category: 'shading',
    name: { ka: 'მზისგან დამცავი ჟალუზი', en: 'Sunscreen Screens', ru: 'Солнцезащитные жалюзи' },
    tagline: { ka: 'სისტემა #02', en: 'System #02', ru: 'Система #02' },
    image: '/user-listings/slot-2.jpg',
    specs: {
      profileWidth: 'Compact box 90\u2013140mm',
      thermalInsulation: 'Blocks up to 85% of solar heat gain',
      soundInsulation: 'N/A (open-weave screen fabric)',
      maxGlassThickness: 'N/A',
      maxPanelWeight: 'Fabric + aluminum box, <15 kg/m\u00b2',
      maxPanelHeight: 'Up to 4m drop',
      waterTightness: 'N/A',
      windLoadResistance: 'Wind-locked guide rails, up to 70 km/h',
      airPermeability: 'N/A',
    },
    profilePartners: ['Somfy'],
    automationOptions: {
      ka: ['მექანიკური (ჯაჭვის მექანიზმი)', 'ავტომატური Somfy ძრავი & პულტი', 'სმარტ სენსორი (მზე/ქარი)'],
      en: ['Manual (chain mechanism)', 'Automated Somfy motor & remote', 'Smart sun/wind sensor'],
      ru: ['Механический (цепной привод)', 'Автоматический привод Somfy с пультом', 'Смарт-датчик солнца/ветра'],
    },
    idealFor: {
      ka: ['საცხოვრებელი ბინები', 'ოფისები', 'სამზარეულოს & მისაღების ფანჯრები'],
      en: ['Apartments', 'Offices', 'Kitchen & living-room windows'],
      ru: ['Квартиры', 'Офисы', 'Окна кухни и гостиной'],
    },
    startingPricePerM2: { GEL: 180, USD: 68, EUR: 62 },
    description: {
      ka: 'მზისგან დამცავი ჟალუზი არის თანამედროვე და ფუნქციური ფანჯრის სისტემა, რომელიც სპეციალური ინოვაციური ქსოვილის მეშვეობით უზრუნველყოფს მზის სხივებისა და სითბოს ეფექტურ კონტროლს ისე, რომ არ ზღუდავს გარე ხედს.\n\nმთავარი მახასიათებლები\n\nსპეციალური მიკროპერფორირებული ქსოვილი (Screen): ფილტრავს მზის პირდაპირ სხივებს, აქრობს თვალისმომჭრელ ბზინვარებას და ოთახში ქმნის რბილ, სასიამოვნო დიფუზურ განათებას.\n\nცალმხრივი ხილვადობის ეფექტი: დღის განმავლობაში ინარჩუნებს გარე ხედს ინტერიერიდან, ხოლო გარედან იცავს პირად სივრცეს ცნობისმოყვარე თვალისგან.\n\nმართვის მოქნილი სისტემა: ხელმისაწვდომია როგორც კლასიკური მექანიკური მართვით (ჯაჭვის მექანიზმით), ისე სრულად ავტომატიზებული, დისტანციური/სმარტ ძრავით.\n\nმინიმალისტური დიზაინი: კომპაქტურად ეხვევა ფანჯრის ზედა ნაწილში, არ იკავებს ზედმეტ ადგილს და იდეალურად ერგება თანამედროვე, სკანდინავიურ თუ მინიმალისტურ ინტერიერს.\n\nმთავარი უპირატესობები\n\nUV დაცვა და ავეჯის გაფრთხილება: ბლოკავს მავნე ულტრაიისფერი სხივების 90\u201399%-ს, რაც საიმედოდ იცავს იატაკს, ავეჯსა და დეკორს გახუნებისგან.\n\nთერმოკონტროლი და ენერგოეფექტურობა: აკავებს ჭარბ სითბოს, ზაფხულში იცავს ოთახს გადახურებისგან და საგრძნობლად ამცირებს კონდიცირების ენერგოხარჯებს.\n\nკომფორტი სამუშაო და მოსასვენებელ სივრცეში: აქრობს არეკვლას ტელევიზორისა და კომპიუტერის ეკრანებზე, რაც მას შეუცვლელს ხდის როგორც საცხოვრებელი ბინებისთვის, ასევე ოფისებისა და კაბინეტებისთვის.',
      en: 'Sunscreen screens are a modern, functional window system that uses a specially engineered fabric to control sunlight and heat effectively without blocking the outside view.\n\nKey Features\n\nSpecial micro-perforated screen fabric: filters direct sunlight, eliminates harsh glare and creates soft, diffused light inside the room.\n\nOne-way visibility effect: preserves the outside view from indoors during the day, while shielding private space from curious eyes outside.\n\nFlexible control system: available with classic manual control (chain mechanism) or fully automated remote / smart-motor control.\n\nMinimalist design: wraps compactly into the head box above the window, takes up almost no extra space, and suits modern, Scandinavian or minimalist interiors equally well.\n\nKey Benefits\n\nUV protection and furniture care: blocks 90\u201399% of harmful UV rays, reliably protecting floors, furniture and decor from fading.\n\nThermal control and energy efficiency: holds back excess heat, keeps rooms from overheating in summer and meaningfully cuts air-conditioning costs.\n\nComfort in work and living spaces: eliminates glare on TV and computer screens, making it just as valuable for apartments as for offices and studies.',
      ru: 'Солнцезащитные жалюзи \u2014 современная функциональная оконная система, которая благодаря специальной инновационной ткани эффективно контролирует солнечные лучи и тепло, не ограничивая при этом вид наружу.\n\nОсновные характеристики\n\nСпециальная микроперфорированная ткань (Screen): фильтрует прямые солнечные лучи, устраняет резкие блики и создаёт в помещении мягкий рассеянный свет.\n\nЭффект одностороннего обзора: в течение дня сохраняет вид наружу изнутри, а снаружи защищает приватность от посторонних взглядов.\n\nГибкая система управления: доступна как классическая механическая (цепной механизм), так и полностью автоматизированная система с пультом или смарт-приводом.\n\nМинималистичный дизайн: компактно скрывается в коробе над окном, не занимает лишнего места и идеально подходит для современного, скандинавского или минималистичного интерьера.\n\nОсновные преимущества\n\nUV-защита и сохранность мебели: блокирует 90\u201399% вредных ультрафиолетовых лучей, надёжно защищая пол, мебель и декор от выцветания.\n\nТермоконтроль и энергоэффективность: удерживает избыточное тепло, летом защищает помещение от перегрева и заметно снижает расходы на кондиционирование.\n\nКомфорт в рабочем и жилом пространстве: устраняет блики на экранах телевизора и компьютера, что делает жалюзи незаменимыми как для квартир, так и для офисов и кабинетов.',
    },
  },
  {
    id: 'panoramic-slider',
    slug: 'panoramic-slider',
    slotNumber: 3,
    category: 'sliding',
    name: { ka: 'პანორამული სლაიდერი', en: 'Panoramic Slider', ru: 'Панорамный слайдер' },
    tagline: { ka: 'სისტემა #03', en: 'System #03', ru: 'Система #03' },
    image: '/user-listings/slot-3.jpg',
    specs: {
      profileWidth: 'Ultra-slim 25\u201360mm',
      thermalInsulation: 'Uw = 0.85\u20131.1 W/m\u00b2K',
      soundInsulation: 'Rw up to 40 dB',
      maxGlassThickness: '28\u201344mm (Triple Low-E)',
      maxPanelWeight: 'Up to 400 kg / panel',
      maxPanelHeight: 'Up to 3.8m',
      waterTightness: 'Class E900',
      windLoadResistance: 'Class C5 / 2000 Pa',
      airPermeability: 'Class 4',
    },
    profilePartners: ['Sch\u00fcco', 'Reynaers', 'Cortizo', 'Alumil'],
    automationOptions: {
      ka: ['მექანიკური', 'ავტომატური Somfy/Becker ძრავი'],
      en: ['Manual', 'Automated Somfy/Becker drive'],
      ru: ['Механический', 'Автоматический привод Somfy/Becker'],
    },
    idealFor: {
      ka: ['ვერანდები & ტერასები', 'პერგოლები', 'აუზისპირა ზონები', 'თანამედროვე ვილები'],
      en: ['Verandas & terraces', 'Pergolas', 'Poolside areas', 'Modern villas'],
      ru: ['Веранды и террасы', 'Перголы', 'Зоны у бассейна', 'Современные виллы'],
    },
    startingPricePerM2: { GEL: 540, USD: 204, EUR: 186 },
    description: {
      ka: 'პანორამული სლაიდერი (გასაწევი შემინვის სისტემა) წარმოადგენს თანამედროვე მინიმალისტურ კონსტრუქციას, რომელიც იატაკიდან ჭერამდე მოძრავი დიდი ზომის მინის პანელების მეშვეობით უზრუნველყოფს ინტერიერისა და ექსტერიერის სრულყოფილ შერწყმას.\n\nმთავარი მახასიათებლები\n\nულტრათხელი ან უჩარჩოო პროფილი: მინიმალური ხილული ალუმინის ჩარჩოები მაქსიმალურად ზრდის შემინვის ფართობს და ტოვებს სუფთა, ჰაეროვან ვიზუალს.\n\nჩაფლული (დაბალი) ზღურბლი: იატაკის დონეზე ინტეგრირებული რელსების სისტემა უზრუნველყოფს უსაფრთხო, შეუფერხებელ და ბარიერებისგან თავისუფალ გადაადგილებას.\n\nმსუბუქი და ჩუმი სრიალის მექანიზმი: მაღალი ხარისხის საკისრები და მიმმართველები იძლევა მძიმე, მასიური მინის სექციების ძალდაუტანებლად და უხმაუროდ გაწევის საშუალებას.\n\nენერგოეფექტური და უსაფრთხო შემინვა: ნაწრთობი ან ტრიპლექსის (ლამინირებული) თერმო-მინაპაკეტები უზრუნველყოფს საიმედო თბოიზოლაციას, ხმის იზოლაციას და მაღალ სიმტკიცეს.\n\nმთავარი უპირატესობები\n\nშეუზღუდავი პანორამული ხედი: სრულად ხსნის ხედვის არეალს და ქმნის ბუნებასთან უწყვეტი კავშირის შეგრძნებას.\n\nმაქსიმალური დღის სინათლე: სივრცეს ბუნებრივი განათებით ავსებს, რაც ვიზუალურად ზრდის ოთახის მოცულობას.\n\nსივრცის ეკონომია: გაღებისას პანელები მოძრაობს პარალელურ რელსებზე, რაც არ იკავებს დამატებით გამოსაყენებელ ფართობს.\n\nუნივერსალური გამოყენება: იდეალურად ერგება ვერანდებს, ტერასებს, პერგოლებს, აუზისპირა ზონებსა და თანამედროვე ვილებს.',
      en: 'The panoramic slider (a sliding glazing system) is a modern, minimalist construction that uses large, floor-to-ceiling moving glass panels to fully merge interior and exterior space.\n\nKey Features\n\nUltra-slim or frameless profile: minimal visible aluminum framing maximizes the glazed area and leaves a clean, airy visual.\n\nFlush low-profile threshold: a floor-level integrated rail system provides safe, unobstructed, barrier-free movement.\n\nLight and quiet gliding mechanism: high-quality bearings and guides let heavy, large-format glass sections slide effortlessly and silently.\n\nEnergy-efficient, safety glazing: tempered or laminated (Triplex) thermal glass units deliver reliable thermal insulation, sound insulation and high strength.\n\nKey Benefits\n\nUnlimited panoramic view: fully opens up the field of view and creates an uninterrupted connection with nature.\n\nMaximum daylight: fills the space with natural light, visually enlarging the room.\n\nSpace-saving: panels travel on parallel rails when opened, using no additional usable floor area.\n\nUniversal application: ideal for verandas, terraces, pergolas, poolside areas and modern villas alike.',
      ru: 'Панорамный слайдер (раздвижная система остекления) \u2014 современная минималистичная конструкция, которая с помощью крупноформатных стеклянных панелей от пола до потолка полностью объединяет интерьер и экстерьер.\n\nОсновные характеристики\n\nУльтратонкий или безрамный профиль: минимальные видимые алюминиевые рамы максимально увеличивают площадь остекления и оставляют чистый, воздушный визуальный образ.\n\nСкрытый низкий порог: интегрированная на уровне пола система рельсов обеспечивает безопасное, беспрепятственное перемещение без барьеров.\n\nЛёгкий и бесшумный механизм скольжения: качественные подшипники и направляющие позволяют тяжёлым крупноформатным стеклянным секциям сдвигаться без усилий и шума.\n\nЭнергоэффективное безопасное остекление: закалённые или ламинированные (триплекс) термостеклопакеты обеспечивают надёжную теплоизоляцию, шумоизоляцию и высокую прочность.\n\nОсновные преимущества\n\nНеограниченный панорамный вид: полностью открывает обзор и создаёт ощущение непрерывной связи с природой.\n\nМаксимум дневного света: наполняет пространство естественным светом, визуально увеличивая объём помещения.\n\nЭкономия пространства: при открытии панели движутся по параллельным рельсам, не занимая дополнительной полезной площади.\n\nУниверсальное применение: идеально подходит для веранд, террас, пергол, зон у бассейна и современных вилл.',
    },
  },
  {
    id: 'glazed-office',
    slug: 'glazed-office',
    slotNumber: 4,
    category: 'facade',
    name: { ka: 'შემინული ოფისი', en: 'Glazed Office Partitions', ru: 'Остеклённый офис' },
    tagline: { ka: 'სისტემა #04', en: 'System #04', ru: 'Система #04' },
    image: '/user-listings/slot-4.jpg',
    specs: {
      profileWidth: 'Frameless / slim 45\u201360mm',
      thermalInsulation: 'N/A (interior partition)',
      soundInsulation: 'Rw up to 42 dB (laminated acoustic glass)',
      maxGlassThickness: '8\u201310+10mm Triplex',
      maxPanelWeight: 'Up to 150 kg / panel',
      maxPanelHeight: 'Up to 3.0m',
      waterTightness: 'N/A',
      windLoadResistance: 'N/A',
      airPermeability: 'N/A',
    },
    profilePartners: ['Sch\u00fcco', 'Reynaers', 'Alumil'],
    automationOptions: {
      ka: ['საქანელა კარები', 'გასაწევი (სლაიდერული) კარები', 'იატაკში ჩაფლული ჰიდრავლიკური კარები'],
      en: ['Swing doors', 'Sliding doors', 'Floor-recessed hydraulic doors'],
      ru: ['Распашные двери', 'Раздвижные двери', 'Гидравлические двери, скрытые в пол'],
    },
    idealFor: {
      ka: ['ოფისები', 'საკონფერენციო ოთახები', 'ბიზნეს ცენტრები'],
      en: ['Offices', 'Conference rooms', 'Business centers'],
      ru: ['Офисы', 'Переговорные комнаты', 'Бизнес-центры'],
    },
    startingPricePerM2: { GEL: 460, USD: 174, EUR: 158 },
    description: {
      ka: 'შემინული ოფისი (მინის საოფისე ტიხრები) წარმოადგენს თანამედროვე კორპორატიული ინტერიერის გადაწყვეტას, რომელიც სტრუქტურული გამჭვირვალე მინის კონსტრუქციების მეშვეობით უზრუნველყოფს სამუშაო სივრცის ეფექტურ ზონირებას, აკუსტიკურ იზოლაციასა და ღია, თანამშრომლობითი გარემოს შენარჩუნებას.\n\nმთავარი მახასიათებლები\n\nუჩარჩოო ან თხელპროფილიანი სისტემა: მინიმალისტური ალუმინის ჩარჩოები ქმნის უწყვეტ, ჰაეროვან ვიზუალს და მაქსიმალურად ინარჩუნებს სივრცის ერთიანობას.\n\nაკუსტიკური უსაფრთხო მინა: ნაწრთობი ან ტრიპლექსის (ლამინირებული) სპეციალური ხმის დამხშობი მინაპაკეტები უზრუნველყოფს მაღალ აკუსტიკურ კომფორტს და მოლაპარაკებების კონფიდენციალურობას.\n\nინტეგრირებული კარების მექანიზმები: იდეალურად ერგება როგორც გასაწევ (სლაიდერულ), ისე საქანელა ან იატაკში ჩაფლულ ჰიდრავლიკურ მინის კარებს.\n\nკონფიდენციალურობის მართვა: შესაძლებელია სრულიად გამჭვირვალე, მქრქალი (დაბურული), დეკორატიული გრაფიკით გაფორმებული ან "ჭკვიანი მინის" (Smart Glass) ინტეგრირება, რომელიც ღილაკზე ერთი დაჭერით გაუმჭვირვალე ხდება.\n\nმთავარი უპირატესობები\n\nდღის სინათლის მაქსიმალური გავრცელება: ბუნებრივ სინათლეს აძლევს მთელ ოფისში შეუფერხებლად შეღწევის საშუალებას, რაც ამცირებს ხელოვნური განათების ხარჯებს და ზრდის პროდუქტიულობას.\n\nღია სივრცისა და სიმყუდროვის ბალანსი: ინარჩუნებს ღია საოფისე გარემოს (Open Space) შეგრძნებას, პარალელურად კი ქმნის ხმაურისგან დაცულ ინდივიდუალურ კაბინეტებსა და საკონფერენციო ოთახებს.\n\nპრესტიჟული კორპორატიული იმიჯი: ინტერიერს სძენს დახვეწილ, პრემიუმ-კლასის ბიზნეს ესთეტიკასა და თანამედროვე სტილს.\n\nსივრცის ოპტიმიზაცია და მოქნილობა: თხელი მინის ტიხრები არ იკავებს ზედმეტ ფართობს და ტრადიციულ კედლებთან შედარებით ბევრად მარტივია მათი მონტაჟი, დემონტაჟი ან სივრცის გადაგეგმარება.',
      en: 'Glazed office partitions are a modern corporate interior solution that uses structural transparent glass to zone the workspace effectively, add acoustic isolation, and keep an open, collaborative atmosphere.\n\nKey Features\n\nFrameless or slim-profile system: minimalist aluminum framing creates a continuous, airy visual and preserves the unity of the space as much as possible.\n\nAcoustic safety glass: tempered or laminated (Triplex) sound-dampening glass units deliver high acoustic comfort and confidentiality for meetings.\n\nIntegrated door mechanisms: works equally well with sliding, swing, or floor-recessed hydraulic glass doors.\n\nPrivacy control: available fully transparent, frosted, finished with decorative graphics, or as switchable "smart glass" that turns opaque at the touch of a button.\n\nKey Benefits\n\nMaximum daylight distribution: lets natural light reach every part of the office unobstructed, cutting artificial lighting costs and boosting productivity.\n\nBalance of openness and privacy: keeps the feeling of an open-plan office while creating sound-protected individual offices and meeting rooms.\n\nA prestigious corporate image: gives the interior a refined, premium business aesthetic and a contemporary style.\n\nSpace optimization and flexibility: thin glass partitions take up little floor area and are far simpler to install, remove or reconfigure than traditional walls.',
      ru: 'Остеклённый офис (стеклянные офисные перегородки) \u2014 современное решение для корпоративного интерьера, которое благодаря структурным прозрачным стеклянным конструкциям обеспечивает эффективное зонирование рабочего пространства, акустическую изоляцию и сохраняет открытую, располагающую к сотрудничеству атмосферу.\n\nОсновные характеристики\n\nБезрамная или тонкопрофильная система: минималистичные алюминиевые рамы создают непрерывный, воздушный визуальный образ и максимально сохраняют единство пространства.\n\nАкустическое безопасное стекло: закалённые или ламинированные (триплекс) звукопоглощающие стеклопакеты обеспечивают высокий акустический комфорт и конфиденциальность переговоров.\n\nИнтегрированные дверные механизмы: одинаково хорошо сочетается с раздвижными, распашными или гидравлическими дверьми, скрытыми в пол.\n\nУправление приватностью: доступно полностью прозрачное, матовое, оформленное декоративной графикой остекление или технология "умного стекла" (Smart Glass), которое становится непрозрачным одним нажатием кнопки.\n\nОсновные преимущества\n\nМаксимальное распространение дневного света: позволяет естественному свету беспрепятственно проникать по всему офису, снижая расходы на искусственное освещение и повышая продуктивность.\n\nБаланс открытости и приватности: сохраняет ощущение открытого пространства (Open Space) и одновременно создаёт защищённые от шума отдельные кабинеты и переговорные.\n\nПрестижный корпоративный имидж: придаёт интерьеру изысканную премиальную деловую эстетику и современный стиль.\n\nОптимизация и гибкость пространства: тонкие стеклянные перегородки не занимают лишней площади, а их монтаж, демонтаж или перепланировку выполнить значительно проще, чем с традиционными стенами.',
    },
  },
  {
    id: 'glazed-shower',
    slug: 'glazed-shower',
    slotNumber: 5,
    category: 'glazing',
    name: { ka: 'შემინული აბაზანა', en: 'Glazed Shower Cabins', ru: 'Остеклённая душевая' },
    tagline: { ka: 'სისტემა #05', en: 'System #05', ru: 'Система #05' },
    image: '/user-listings/slot-5.jpg',
    specs: {
      profileWidth: 'Frameless, SUS304 stainless hardware',
      thermalInsulation: 'N/A',
      soundInsulation: 'N/A',
      maxGlassThickness: '8\u201310mm tempered',
      maxPanelWeight: 'Up to 60 kg / panel',
      maxPanelHeight: 'Up to 2.2m',
      waterTightness: 'Magnetic strip + silicone seal',
      windLoadResistance: 'N/A',
      airPermeability: 'N/A',
    },
    profilePartners: ['Guardian Glass'],
    automationOptions: {
      ka: ['სწორხაზოვანი (კედლიდან კედლამდე)', 'კუთხის კონფიგურაცია', 'გასაწევი (სლაიდერი)', 'ღია ტიპის (Walk-in)'],
      en: ['Straight (wall-to-wall)', 'Corner configuration', 'Sliding', 'Open walk-in'],
      ru: ['Прямая (от стены до стены)', 'Угловая конфигурация', 'Раздвижная', 'Открытая (Walk-in)'],
    },
    idealFor: {
      ka: ['საცხოვრებელი აბაზანები', 'სასტუმროები', 'სპა &ველნეს ცენტრები'],
      en: ['Residential bathrooms', 'Hotels', 'Spa & wellness centers'],
      ru: ['Жилые ванные комнаты', 'Отели', 'СПА и велнес-центры'],
    },
    startingPricePerM2: { GEL: 380, USD: 144, EUR: 131 },
    description: {
      ka: 'შემინული საშხაპე კაბინა წარმოადგენს თანამედროვე სააბაზანოს ერგონომიულ და ფუნქციურ კონსტრუქციას, რომელიც მაღალი სიმტკიცის ნაწრთობი მინისა და უჟანგავი ფურნიტურის კომბინაციით ქმნის ჰერმეტულ, უსაფრთხო და ვიზუალურად ჰაეროვან სივრცეს.\n\nმთავარი მახასიათებლები\n\nნაწრთობი უსაფრთხო მინა (8\u201310 მმ): გამოირჩევა მაღალი თერმული და მექანიკური გამძლეობით; დაზიანების შემთხვევაში იმსხვრევა მცირე, უსაფრთხო, ბლაგვკუთხა ნაწილაკებად.\n\nუჟანგავი ფურნიტურა და პროფილები: ანოდირებული ალუმინის, თითბერისა და უჟანგავი ფოლადის (SUS304) მექანიზმები უზრუნველყოფს სრულ მდგრადობას კოროზიისა და მუდმივი ტენიანობის მიმართ.\n\nჰერმეტული მაგნიტური და სილიკონის ჩამკეტები: უზრუნველყოფს კარის რბილ, მჭიდრო დახურვას და საიმედოდ აკავებს წყალს საშხაპე ზონის შიგნით.\n\nკონფიგურაციის მრავალფეროვნება: შესაძლებელია როგორც სწორხაზოვანი (კედლიდან კედლამდე), ისე კუთხის, მრავალწახნაგა (პენტაგონალური), გასაწევი (სლაიდერი) ან ღია ტიპის (Walk-in) სისტემების ინტეგრირება.\n\nმთავარი უპირატესობები\n\nვიზუალური სივრცის გაფართოება: გამჭვირვალე მინა არ ზღუდავს მზერას და სააბაზანო ოთახს უფრო ნათელს, ფართოსა და თანამედროვეს აჩენს.\n\nმარტივი მოვლა და ჰიგიენა: სპეციალური წყალგაუმტარი (Anti-Drop / Easy Clean) დამცავი საფარი საგრძნობლად ამცირებს კირქვის, საპნის ნადებისა და წყლის ლაქების დალექვას.\n\nდიზაინის მოქნილობა: ხელმისაწვდომია გამჭვირვალე, მქრქალი (დაბურული), ტონირებული (ბრონზა, გრაფიტი) ან დეკორატიული გრავირების მქონე მინის პანელებით.',
      en: 'A glazed shower cabin is an ergonomic, functional structure for the modern bathroom that combines high-strength tempered glass with stainless hardware to create a watertight, safe and visually light space.\n\nKey Features\n\nTempered safety glass (8\u201310mm): notable for high thermal and mechanical durability; if broken, it shatters into small, safe, blunt-edged fragments.\n\nStainless hardware and profiles: anodized aluminum, brass and stainless-steel (SUS304) mechanisms give full resistance to corrosion and constant humidity.\n\nSealed magnetic and silicone strips: give the door a soft, tight close and reliably keep water contained inside the shower zone.\n\nConfiguration variety: available as straight (wall-to-wall), corner, multi-facet (pentagonal), sliding, or open walk-in layouts.\n\nKey Benefits\n\nVisually enlarges the space: transparent glass keeps sightlines open, making the bathroom look brighter, larger and more modern.\n\nEasy maintenance and hygiene: a special water-repellent (anti-drop / easy-clean) coating significantly reduces limescale, soap residue and water-spot buildup.\n\nDesign flexibility: available in clear, frosted, tinted (bronze, graphite) or decoratively engraved glass panels.',
      ru: 'Остеклённая душевая кабина \u2014 эргономичная и функциональная конструкция для современной ванной комнаты, которая благодаря сочетанию прочного закалённого стекла и нержавеющей фурнитуры создаёт герметичное, безопасное и визуально лёгкое пространство.\n\nОсновные характеристики\n\nЗакалённое безопасное стекло (8\u201310 мм): отличается высокой термической и механической прочностью; при повреждении рассыпается на мелкие безопасные осколки с тупыми краями.\n\nНержавеющая фурнитура и профили: механизмы из анодированного алюминия, латуни и нержавеющей стали (SUS304) обеспечивают полную устойчивость к коррозии и постоянной влажности.\n\nГерметичные магнитные и силиконовые уплотнители: обеспечивают мягкое плотное закрытие двери и надёжно удерживают воду внутри душевой зоны.\n\nРазнообразие конфигураций: возможна как прямая (от стены до стены), так и угловая, многогранная (пятиугольная), раздвижная или открытая (Walk-in) конструкция.\n\nОсновные преимущества\n\nВизуальное расширение пространства: прозрачное стекло не ограничивает взгляд и делает ванную комнату светлее, просторнее и современнее.\n\nПростой уход и гигиена: специальное водоотталкивающее покрытие (Anti-Drop / Easy Clean) заметно снижает образование известкового налёта, следов мыла и разводов от воды.\n\nГибкость дизайна: доступны прозрачные, матовые, тонированные (бронза, графит) или декоративно гравированные стеклянные панели.',
    },
  },
  {
    id: 'insect-screens',
    slug: 'insect-screens',
    slotNumber: 6,
    category: 'screen',
    name: { ka: 'მწერებისგან დამცავი ბადე', en: 'Insect Screens', ru: 'Москитная сетка' },
    tagline: { ka: 'სისტემა #06', en: 'System #06', ru: 'Система #06' },
    image: '/user-listings/slot-6.jpg',
    specs: {
      profileWidth: 'Slim 25\u201335mm aluminum',
      thermalInsulation: 'N/A',
      soundInsulation: 'N/A',
      maxGlassThickness: 'N/A (fiberglass mesh)',
      maxPanelWeight: '<5 kg/m\u00b2',
      maxPanelHeight: 'Up to 2.6m',
      waterTightness: 'N/A',
      windLoadResistance: 'N/A',
      airPermeability: 'High-flow weave, unrestricted airflow',
    },
    profilePartners: [],
    automationOptions: {
      ka: ['ჰორიზონტალური/ვერტიკალური პლისე (აკორდეონი)', 'რულონული', 'სტაციონარული (ჩასასმელი)'],
      en: ['Horizontal/vertical pleated (accordion)', 'Roller', 'Fixed (drop-in)'],
      ru: ['Горизонтальная/вертикальная плиссе (гармошка)', 'Рулонная', 'Стационарная (съёмная)'],
    },
    idealFor: {
      ka: ['ფანჯრები', 'აივნის კარები', 'ტერასის კარები'],
      en: ['Windows', 'Balcony doors', 'Terrace doors'],
      ru: ['Окна', 'Балконные двери', 'Двери террасы'],
    },
    startingPricePerM2: { GEL: 90, USD: 34, EUR: 31 },
    description: {
      ka: 'მწერებისგან დამცავი ბადე (პლისე / რულონური სისტემა) წარმოადგენს ფანჯრებისა და კარებისთვის განკუთვნილ ერგონომიულ, თანამედროვე კონსტრუქციას, რომელიც უზრუნველყოფს საიმედო ბარიერს მწერების, მტვრისა და ალერგენების წინააღმდეგ სუფთა ჰაერის შეუფერხებელი ცირკულაციის პარალელურად.\n\nმთავარი მახასიათებლები\n\nმაღალი გამძლეობის ბოჭკოვანი ბადე (Fiberglass): ულტრათხელი, ცეცხლგამძლე და ულტრაიისფერი (UV) სხივების მიმართ მდგრადი ქსოვილი, რომელიც არ იხევა და დროთა განმავლობაში არ კარგავს პირვანდელ დაჭიმულობას.\n\nალუმინის თხელკედლიანი პროფილი: ელეგანტური ანოდირებული ან ფხვნილოვანი საღებავით შეღებილი ალუმინის ჩარჩო, რომელიც იდეალურად ერწყმის ნებისმიერი ფერის მეტალოპლასტმასისა და ალუმინის კარ-ფანჯარას.\n\nმოქნილი მექანიზმები: ხელმისაწვდომია როგორც ჰორიზონტალური/ვერტიკალური გასაწევი (პლისე/აკორდეონის ტიპის), ასევე რულონური და სტაციონარული (ჩასასმელი) მოდელები.\n\nდაბალი ზღურბლი და მარტივი მართვა: იატაკის დონეზე მინიმალური სიმაღლის რელსი უზრუნველყოფს უსაფრთხო და თავისუფალ გადაადგილებას კარებზე მონტაჟისას.\n\nმთავარი უპირატესობები\n\nშეუზღუდავი ვენტილაცია და ხილვადობა: იცავს ოთახს მწერებისგან ისე, რომ არ ბლოკავს ბუნებრივ სინათლესა და გარე ხედს.\n\nსივრცის დაზოგვა: შეკეცვისას პლისეს ტიპის ბადე კომპაქტურად თავსდება პროფილის გვერდით ნაწილში და არ იკავებს გამოსაყენებელ ფართობს.\n\nმარტივი ექსპლუატაცია და მოვლა: ადვილად იწმინდება მტვერსასრუტით ან ნესტიანი ქსოვილით და არ საჭიროებს სეზონურ დემონტაჟს.',
      en: 'Insect screens (pleated / roller systems) are an ergonomic, modern construction for windows and doors that provides a reliable barrier against insects, dust and allergens while allowing clean air to circulate freely.\n\nKey Features\n\nHigh-durability fiberglass mesh: an ultra-thin, fire-resistant, UV-stable weave that doesn\u2019t sag and keeps its original tension over time.\n\nSlim-wall aluminum profile: an elegant anodized or powder-coated aluminum frame that matches any color of uPVC or aluminum door or window.\n\nFlexible mechanisms: available as horizontal/vertical pleated (accordion-style), roller, and fixed (drop-in) models.\n\nLow threshold, simple operation: a minimal-height floor-level rail provides safe, unobstructed movement where fitted on doors.\n\nKey Benefits\n\nUnrestricted ventilation and visibility: keeps insects out of the room without blocking natural light or the outside view.\n\nSpace-saving: when folded, the pleated mesh tucks compactly to the side of the frame and takes up no usable floor area.\n\nEasy operation and upkeep: cleans easily with a vacuum or a damp cloth and needs no seasonal removal.',
      ru: 'Москитная сетка (плиссе / рулонная система) \u2014 эргономичная современная конструкция для окон и дверей, которая обеспечивает надёжный барьер от насекомых, пыли и аллергенов, не препятствуя свободной циркуляции свежего воздуха.\n\nОсновные характеристики\n\nПрочная стекловолоконная сетка (Fiberglass): ультратонкое, огнестойкое и УФ-устойчивое полотно, которое не провисает и со временем не теряет исходное натяжение.\n\nТонкостенный алюминиевый профиль: элегантная анодированная или окрашенная порошковой краской алюминиевая рама, идеально сочетающаяся с любым цветом металлопластиковых и алюминиевых окон и дверей.\n\nГибкие механизмы: доступны горизонтальные/вертикальные раздвижные модели (плиссе/гармошка), а также рулонные и стационарные (съёмные).\n\nНизкий порог и простое управление: рельс минимальной высоты на уровне пола обеспечивает безопасное и свободное перемещение при установке на двери.\n\nОсновные преимущества\n\nНеограниченная вентиляция и видимость: защищает помещение от насекомых, не блокируя естественный свет и вид наружу.\n\nЭкономия пространства: при складывании сетка типа плиссе компактно убирается сбоку профиля и не занимает полезную площадь.\n\nПростая эксплуатация и уход: легко очищается пылесосом или влажной тканью и не требует сезонного демонтажа.',
    },
  },
];
