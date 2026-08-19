import { FAQItem, ShowroomLocation, TestimonialItem } from '../types';
import { publicAsset } from '../lib/publicAsset';

export const showroomsData: ShowroomLocation[] = [
  {
    id: 'tbilisi-main',
    isMainShowroom: true,
    city: { ka: 'თბილისი', en: 'Tbilisi', ru: 'Тбилиси' },
    name: {
      ka: 'თბილისის ცენტრალური შოურუმი & საინჟინრო ოფისი',
      en: 'Tbilisi Flagship Showroom & Engineering HQ',
      ru: 'Центральный шоурум и инженерный офис в Тбилиси',
    },
    address: {
      ka: 'ვარლამ ჩერქეზიშვილის ქუჩა N6, თბილისი',
      en: 'Varlam Cherkezishvili Street N6, Tbilisi, Georgia',
      ru: 'ул. Варлама Черкезишвили N6, Тбилиси, Грузия',
    },
    phone: '+995 599 58 58 59',
    email: 'support@panorama.ge',
    hours: {
      ka: 'ორშაბათი – შაბათი: 10:00 – 19:00',
      en: 'Monday – Saturday: 10:00 – 19:00',
      ru: 'Понедельник — Суббота: 10:00 — 19:00',
    },
    coordinates: { lat: 41.7225, lng: 44.7554 },
    image: publicAsset('/user-listings/slot-4.jpg'),
  },
  {
    id: 'batumi-branch',
    city: { ka: 'ბათუმი', en: 'Batumi', ru: 'Батуми' },
    name: {
      ka: 'ბათუმის წარმომადგენლობა & სერვის ცენტრი',
      en: 'Batumi Regional Office & Service Center',
      ru: 'Представительство и сервисный центр в Батуми',
    },
    address: {
      ka: 'შოთა რუსთაველის გამზ. 32 / ახალი ბულვარი, ბათუმი',
      en: '32 Shota Rustaveli Ave / New Boulevard, Batumi, Georgia',
      ru: 'пр. Шота Руставели 32 / Новый Бульвар, Батуми, Грузия',
    },
    phone: '+995 599 58 58 59',
    email: 'support@panorama.ge',
    hours: {
      ka: 'ორშაბათი – შაბათი: 10:00 – 18:30',
      en: 'Monday – Saturday: 10:00 – 18:30',
      ru: 'Понедельник — Суббота: 10:00 — 18:30',
    },
    coordinates: { lat: 41.6434, lng: 41.6399 },
    image: publicAsset('/user-listings/slot-3.jpg'),
  },
];

export const testimonialsData: TestimonialItem[] = [
  {
    id: 'test-1',
    clientName: 'გიორგი ხუციშვილი',
    role: {
      ka: 'მთავარი არქიტექტორი, GeoSpace Design',
      en: 'Lead Architect, GeoSpace Design',
      ru: 'Главный архитектор, GeoSpace Design',
    },
    projectTitle: {
      ka: 'კერძო ვილის პროექტი წყნეთში (12მ სლაიდ კედელი)',
      en: 'Luxury Villa Project in Tskneti (12m sliding glass)',
      ru: 'Проект виллы в Цхнети (12м раздвижная стена)',
    },
    location: 'Tbilisi, Georgia',
    quote: {
      ka: '„Panorama-სთან თანამშრომლობა არქიტექტორისთვის უდიდესი კომფორტია. ზუსტი საინჟინრო გათვლები, ჩაფლული ზღურბლები და უმაღლესი ხარისხის პროფილები. 12-მეტრიანი გახსნა წყნეთის ქარებსა და ყინვაში იდეალურად მუშაობს.“',
      en: '"Collaborating with Panorama is pure satisfaction for an architect. Flawless structural calculations, completely flush floor details, and top-tier European profiles. The 12-meter opening withstands Tskneti mountain winds effortlessly."',
      ru: '«Сотрудничество с Panorama — огромное удовольствие для архитектора. Точные инженерные расчеты, идеальные беспороговые стыки и европейский профиль. 12-метровый проем безупречно работает в условиях горных ветров Цхнети.»',
    },
    rating: 5,
  },
  {
    id: 'test-2',
    clientName: 'Nika Chanturia',
    role: {
      ka: 'HoReCa ინვესტორი & რესტორატორი',
      en: 'HoReCa Investor & Restaurant Owner',
      ru: 'Инвестор HoReCa и ресторатор',
    },
    projectTitle: {
      ka: 'რუფტოპ რესტორანი ბათუმში (ბიოკლიმატური პერგოლა)',
      en: 'Rooftop Restaurant in Batumi (Bioclimatic Pergola & Guillotine)',
      ru: 'Руфтоп-ресторан в Батуми (Пергола и гильотины)',
    },
    location: 'Batumi, Georgia',
    quote: {
      ka: '„ბათუმის ზღვისპირა შტორმებისა და ძლიერი წვიმების გამო ხშირად ვკარგავდით სტუმრებს ღია ტერასაზე. Panorama-ს ავტომატურმა პერგოლამ და გილიოტინის მინებმა ჩვენი ტერასა 4-სეზონიან შემოსავლიან სივრცედ აქცია.“',
      en: '"Due to sudden Black Sea rainstorms, we used to lose terrace guests. Panorama\u2019s motorized pergola and guillotine glass converted our terrace into an all-weather revenue generator operating 365 days a year."',
      ru: '«Из-за частых дождей и ветров в Батуми мы теряли гостей на открытой террасе. Биоклиматическая пергола и гильотинное остекление от Panorama превратили веранду во всесезонную прибыльную локацию.»',
    },
    rating: 5,
  },
  {
    id: 'test-3',
    clientName: 'Марина Соколова',
    role: {
      ka: 'ვილის მფლობელი, საგურამო',
      en: 'Private Villa Owner, Saguramo',
      ru: 'Владелица виллы, Сагурамо',
    },
    projectTitle: {
      ka: 'ზამთრის ბაღი და აუზის შემინვა',
      en: 'Winter Garden & Pool Pavilion Enclosure',
      ru: 'Зимний сад и остекление зоны бассейна',
    },
    location: 'Saguramo, Georgia',
    quote: {
      ka: '„საოცარი სიზუსტე და სისუფთავე მონტაჟისას. მინა-პაკეტები იმდენად ენერგოეფექტურია, რომ ზამთარშიც კი ზამთრის ბაღში სითბოა, ზაფხულში კი მზისგან დამცავი საფარი სიგრილეს ინარჩუნებს.“',
      en: '"Impeccable installation discipline and precision. The solar-control glass is so effective that our winter garden stays wonderfully warm in winter and pleasantly cool throughout high summer."',
      ru: '«Потрясающая точность и культура монтажа. Мультифункциональные стеклопакеты работают великолепно: зимой тепло, а жарким летом сохраняется приятная прохлада.»',
    },
    rating: 5,
  },
];

export const faqsData: FAQItem[] = [
  {
    category: 'engineering',
    question: {
      ka: 'რამდენად უძლებს პანორამული სლაიდ-სისტემები საქართველოს კლიმატსა და ქარის დატვირთვას?',
      en: 'How well do panoramic sliding walls withstand Georgia\u2019s climate and wind loads?',
      ru: 'Насколько панорамные раздвижные системы устойчивы к климату и ветрам в Грузии?',
    },
    answer: {
      ka: 'ყველა ჩვენი კონსტრუქცია ინდივიდუალურად იანგარიშება კონკრეტული ლოკაციის მიხედვით (მაგ. ბათუმის ზღვისპირა ქარები, წყნეთის/გუდაურის სიმაღლე და ყინვა). ვიყენებთ ევროპულ თერმოხიდიან ალუმინის პროფილებს, გამაგრებულ მრავალკამერიან მზიდებსა და ნაწრთობ Triplex მინაპაკეტებს, რომლებიც გამოცდილია 2000 Pa-მდე (Class C5) ქარის წნევაზე.',
      en: 'Every system is engineered specifically for its Georgian microclimate (such as coastal gale winds in Batumi or mountain snow in Gudauri). We employ reinforced European multi-chamber thermal break profiles and laminated tempered Triplex glass tested up to Class C5 (2,000 Pa) wind resistance.',
      ru: 'Каждая конструкция рассчитывается под конкретные условия (морские ветра в Батуми, снежные нагрузки в Гудаури или перепады температур в Тбилиси). Мы используем усиленный европейский термопрофиль и безопасный триплекс, сертифицированный по классу ветроустойчивости C5 (до 2000 Па).',
    },
  },
  {
    category: 'engineering',
    question: {
      ka: 'რა არის უბარიერო ჩაფლული ზღურბლი (Flush Floor Track)? შევა თუ არა წვიმის წყალი?',
      en: 'What is a flush zero-threshold floor track, and does it prevent water leakage?',
      ru: 'Что такое скрытый беспороговый рельс (Flush Track) и защищен ли он от протечек?',
    },
    answer: {
      ka: 'ჩაფლული ზღურბლი მონტაჟდება იატაკის საფართან ერთ დონეზე, რაც ქმნის აბსოლუტურად ბრტყელ გადასვლას. პროფილის ქვედა ნაწილში ინტეგრირებულია დაფარული უჟანგავი სადრენაჟო არხები, რომლებიც წვიმის წყალს მომენტალურად გაატარებს სადრენაჟო მილებში (Class E900 ჰიდროიზოლაცია).',
      en: 'A flush track sits completely level with your interior flooring without any trip hazard. The profile houses integrated sub-floor stainless drainage channels capable of evacuating heavy rainwater instantly, certified to Class E900 watertightness.',
      ru: 'Скрытый рельс монтируется вровень с чистовым полом, исключая любые ступени и пороги. Под профилем располагаются интегрированные дренажные лотки из нержавеющей стали, гарантирующие мгновенный отвод ливневой воды (класс E900).',
    },
  },
  {
    category: 'pricing',
    question: {
      ka: 'როგორ იანგარიშება პროექტის ღირებულება და შედის თუ არა მონტაჟი ფასში?',
      en: 'How is the project priced and is professional installation included?',
      ru: 'Как формируется стоимость и входит ли монтаж в общую смету?',
    },
    answer: {
      ka: 'ღირებულება განისაზღვრება კვადრატული მეტრის, არჩეული სისტემის (სლაიდი, პერგოლა, გილიოტინა), მინაპაკეტის ტიპისა და ავტომატიზაციის მიხედვით. ჩვენი ოფიციალური შეთავაზება მოიცავს სრულ პაკეტს: უფასო 3D ლაზერულ აზომვას, საინჟინრო ნახაზებს, ქარხნულ დამზადებას, ტრანსპორტირებასა და სერტიფიცირებულ მონტაჟს 10-წლიანი გარანტიით.',
      en: 'Pricing is calculated per m\u00b2 based on system geometry, profile brand, glass specification (double/triple Low-E), and motorization. Our turn-key quotation includes laser surveying, CAD engineering, factory fabrication, logistics, and certified installation with a 10-year warranty.',
      ru: 'Стоимость рассчитывается за м\u00b2 с учетом типа системы, толщины стеклопакета, профильной марки и автоматики. В итоговую смету «под ключ» входят бесплатный лазерный замер, CAD-проект, заводское изготовление, доставка и сертифицированный монтаж с гарантией 10 лет.',
    },
  },
  {
    category: 'timeline',
    question: {
      ka: 'რა დრო სჭირდება დამზადებასა და მონტაჟს თბილისის საწარმოში?',
      en: 'What is the production and installation timeframe at your Tbilisi plant?',
      ru: 'Каковы сроки изготовления и монтажа на заводе в Тбилиси?',
    },
    answer: {
      ka: 'ვინაიდან გვაქვს საკუთარი 2,500 მ² CNC საწარმო თბილისში და პროფილების მუდმივი მარაგი, სტანდარტული სისტემების დამზადება ხდება 15–25 სამუშაო დღეში. მონტაჟი უშუალოდ ობიექტზე გრძელდება 2-დან 5 დღემდე.',
      en: 'Because we operate our own 2,500 m\u00b2 CNC facility in Tbilisi with continuous profile inventory, standard production takes 15\u201325 working days. On-site installation is typically completed in 2 to 5 days.',
      ru: 'Благодаря собственному заводу 2500 м\u00b2 в Тбилиси и постоянному складскому запасу профилей, срок изготовления составляет 15\u201325 рабочих дней. Монтаж на объекте занимает от 2 до 5 дней.',
    },
  },
  {
    category: 'warranty',
    question: {
      ka: 'რა გარანტია ვრცელდება კონსტრუქციებზე და როგორ ხდება სერვისი?',
      en: 'What warranty is provided and how is maintenance serviced?',
      ru: 'Какая гарантия предоставляется и как осуществляется сервисное обслуживание?',
    },
    answer: {
      ka: 'ალუმინის პროფილებსა და მზიდ კონსტრუქციებზე გაიცემა 10-წლიანი გარანტია; მინაპაკეტების ჰერმეტულობაზე — 5 წელი; Somfy/Becker ძრავებზე — 5 წელი. გვყავს საკუთარი მობილური სერვის-ჯგუფები თბილისსა და ბათუმში.',
      en: 'We provide a 10-year warranty on aluminum profiles and structural stability; 5 years on glass seal integrity; and 5 years on Somfy/Becker motorized drives. Our dedicated mobile service teams cover all regions of Georgia.',
      ru: '10 лет гарантии на профили и несущие конструкции; 5 лет на герметичность стеклопакетов; 5 лет на автоматику Somfy и Becker. Собственные мобильные сервисные бригады в Тбилиси и Батуми.',
    },
  },
];

export const partnerBrands = [
  { name: 'Sch\u00fcco', country: 'Germany', desc: 'Premium Aluminum Systems' },
  { name: 'Reynaers Aluminium', country: 'Belgium', desc: 'Architectural Glazing Systems' },
  { name: 'Cortizo', country: 'Spain', desc: 'Minimalist Sliding Profiles' },
  { name: 'Alumil', country: 'Greece', desc: 'High-Performance Architectural Systems' },
  { name: 'Guardian Glass', country: 'USA / Europe', desc: 'Solar Control & Low-E Glazing' },
  { name: 'Saint-Gobain', country: 'France', desc: 'High-End Safety & Acoustic Glass' },
  { name: 'Somfy', country: 'France', desc: 'Smart Automation & Tubular Motors' },
  { name: 'Becker', country: 'Germany', desc: 'Industrial Motorization' },
];
