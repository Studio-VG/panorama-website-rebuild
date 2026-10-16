import type { Locale } from "./locale";

type Copy = {
  blurb: string;
  history: string;
  photoAlt: string;
  styles: string[];
  captions: Record<string, string>;
  alts: Record<string, string>;
  seoTitle: string;
  seoDescription: string;
};

export const briefArtists: Record<string, Partial<Record<Locale, Copy>>> = {
  "artist-vaso": {
    tr: {
      seoTitle: "Vaso Vasiko",
      seoDescription: "Vasil Kurakhchishvili, 1980 Gürcistan doğumlu, 2000’den beri dövme yapıyor. İstiklal’de irezumi ve neo-traditional.",
      styles: ["Japon irezumi", "Neo-traditional", "Siyah ve gri", "Geometrik", "Realizm", "Old school", "New school"],
      photoAlt: "Vaso Vasiko stüdyoda dövme yapıyor.",
      blurb: "Vasil Kurakhchishvili 1980’de Gürcistan’da doğdu ve 2000’den beri profesyonel dövme yapıyor. Kariyerin büyük kısmı Türkiye’de kuruldu: İstiklal Caddesi’nde irezumi ve neo-traditional, Avrupa stüdyolarında sık misafirlik.",
      history: "Vasil Kurakhchishvili 1980’de Gürcistan’da doğdu. 2000’den beri profesyonel dövme yapıyor ve bu kariyer esas olarak Türkiye’de kuruldu. Stüdyo İstanbul’da İstiklal Caddesi’ndedir. Avrupa’daki stüdyolarda da sık sık misafir olarak çalışır.\n\nBilinen işi Japon irezumi ve neo-traditional’dır. Siyah-gri, geometrik, realizm, old school ve new school da yapar. Büyük özel işler kol, sırt ve bacak takımlarıdır: ejderha, hannya, samuray, yılan, şakayık ve koi. Çizim vücudu izler. Kontrast ağır, çizgiler kalın, fonlar hareketlidir ve renk yıllar sonra da duracak şekilde seçilir.\n\n2000’lerin başından itibaren, çoğunlukla küçük tribal ve flash’tan ibaret bir sahnede büyük ölçekli özel Japon ve neo-traditional işi öne çıkardı. Tek kullanımlık iğne, daha iyi pigment ve Avrupa hijyen pratiğini savundu. İstiklal’deki stüdyo görünür bir odadır. Avrupa stüdyolarıyla işbirlikleri ve işin standardı, genç sanatçılar için bir referans oldu.\n\nBu pratik için adı geçen sponsorlar: Cheyenne Tattoo Equipment, Radiant Tattoo Ink ve Aloe Tattoo.\n\nBu sayfadaki levhalar o motiflerin stüdyo çalışmalarıdır. İyileşmiş dövme fotoğrafı değildir.",
      captions: { "vaso-koi": "Koi çalışması", "vaso-dragon": "Ejderha çalışması", "vaso-hannya": "Hannya ve şakayık", "vaso-tiger": "Kaplan ve dalga", "vaso-shishi": "Shishi" },
      alts: { "vaso-koi": "Koi ve şakayık çalışması.", "vaso-dragon": "Ejderha çalışması.", "vaso-hannya": "Hannya ve şakayık.", "vaso-tiger": "Kaplan çalışması.", "vaso-shishi": "Shishi çalışması." },
    },
    de: {
      seoTitle: "Vaso Vasiko",
      seoDescription: "Vasil Kurakhchishvili, geboren 1980 in Georgien, tätowiert seit 2000. Irezumi und Neo-Traditional an der İstiklal.",
      styles: ["Japanisches Irezumi", "Neo-Traditional", "Schwarz-grau", "Geometrisch", "Realismus", "Old School", "New School"],
      photoAlt: "Vaso Vasiko tätowiert im Studio.",
      blurb: "Vasil Kurakhchishvili wurde 1980 in Georgien geboren und tätowiert seit 2000 professionell. Die Laufbahn entstand vor allem in der Türkei: japanisches Irezumi und Neo-Traditional an der İstiklal, dazu häufige Gastauftritte in europäischen Studios.",
      history: "Vasil Kurakhchishvili wurde 1980 in Georgien geboren. Er tätowiert seit 2000 professionell, und diese Laufbahn entstand vor allem in der Türkei. Das Studio liegt an der İstiklal-Allee in Istanbul. Er gastiert häufig in Studios in Europa.\n\nBekannt ist er für japanisches Irezumi und Neo-Traditional, außerdem für Schwarz-Grau, Geometrie, Realismus sowie Old und New School. Die großen Einzelstücke sind Ärmel, Rücken und Beinanzüge: Drachen, Hannya, Samurai, Schlangen, Pfingstrosen und Koi. Die Zeichnung folgt dem Körper. Der Kontrast ist schwer, die Linien sind kräftig, die Hintergründe bewegen sich, und die Farbe ist so gewählt, dass sie altert.\n\nSeit den frühen 2000ern brachte er großformatige japanische und neo-traditionelle Einzelstücke in eine türkische Szene, die vor allem kleines Tribal und Flash war. Er drängte auf Einwegnadeln, bessere Pigmente und europäische Hygiene. Das Studio an der İstiklal ist ein sichtbarer Raum. Zusammenarbeit mit europäischen Studios und der Standard der Arbeit machten ihn zu einem Bezug für jüngere Künstler.\n\nGenannte Sponsoren: Cheyenne Tattoo Equipment, Radiant Tattoo Ink und Aloe Tattoo.\n\nDie Blätter auf dieser Seite sind Studien dieser Motive. Sie sind keine Fotos geheilter Tattoos.",
      captions: { "vaso-koi": "Koi-Studie", "vaso-dragon": "Drachenstudie", "vaso-hannya": "Hannya und Pfingstrose", "vaso-tiger": "Tiger und Welle", "vaso-shishi": "Shishi" },
      alts: { "vaso-koi": "Koi-Studie.", "vaso-dragon": "Drachenstudie.", "vaso-hannya": "Hannya-Studie.", "vaso-tiger": "Tigerstudie.", "vaso-shishi": "Shishi-Studie." },
    },
    ru: {
      seoTitle: "Васо Васико",
      seoDescription: "Васил Курахчишвили, родился в Грузии в 1980 году, татуирует с 2000-го. Ирэдзуми и нео-традишнл на Истикляль.",
      styles: ["Японское ирэдзуми", "Нео-традишнл", "Чёрно-серое", "Геометрия", "Реализм", "Олд-скул", "Нью-скул"],
      photoAlt: "Васо Васико делает татуировку в студии.",
      blurb: "Васил Курахчишвили родился в Грузии в 1980 году и профессионально татуирует с 2000-го. Карьера сложилась в основном в Турции: японское ирэдзуми и нео-традишнл на проспекте Истикляль в Стамбуле и частые гостевые работы в студиях Европы.",
      history: "Васил Курахчишвили родился в Грузии в 1980 году. Он профессионально татуирует с 2000 года, и эта карьера сложилась в основном в Турции. Студия на проспекте Истикляль в Стамбуле. Он часто работает гостем в европейских студиях.\n\nЕго знают по японскому ирэдзуми и нео-традишнл, а также по чёрно-серому, геометрии, реализму, олд-скулу и нью-скулу. Крупные заказные вещи — рукава, спины и комплекты на ноги: драконы, хання, самураи, змеи, пионы и кои. Рисунок идёт по телу. Контраст тяжёлый, линии жирные, фоны двигаются, а цвет выбран так, чтобы стареть достойно.\n\nС начала 2000-х он принёс крупную заказную японскую и нео-традиционную работу в турецкую сцену, где тогда были в основном мелкий трайбл и флеш. Он настаивал на одноразовых иглах, лучших пигментах и европейской гигиене. Студия на Истикляль — заметная комната. Совместная работа с европейскими студиями и уровень работы сделали его ориентиром для младших мастеров.\n\nНазванные спонсоры: Cheyenne Tattoo Equipment, Radiant Tattoo Ink и Aloe Tattoo.\n\nЛисты на этой странице — студийные этюды этих мотивов. Это не фотографии заживших татуировок.",
      captions: { "vaso-koi": "Этюд кои", "vaso-dragon": "Этюд дракона", "vaso-hannya": "Хання и пион", "vaso-tiger": "Тигр и волна", "vaso-shishi": "Сиси" },
      alts: { "vaso-koi": "Этюд кои.", "vaso-dragon": "Этюд дракона.", "vaso-hannya": "Этюд хання.", "vaso-tiger": "Этюд тигра.", "vaso-shishi": "Этюд сиси." },
    },
    ka: {
      seoTitle: "Vaso Vasiko",
      seoDescription: "Vasil Kurakhchishvili, დაიბადა საქართველოში 1980 წელს, ტატუირებს 2000 წლიდან. ირეზუმი და ნეო-ტრადიციული İstiklal-ზე.",
      styles: ["იაპონური ირეზუმი", "ნეო-ტრადიციული", "შავ-ნაცრისფერი", "გეომეტრიული", "რეალიზმი", "old school", "new school"],
      photoAlt: "Vaso Vasiko სტუდიაში ტატუს აკეთებს.",
      blurb: "Vasil Kurakhchishvili დაიბადა საქართველოში 1980 წელს და პროფესიონალურად ტატუირებს 2000 წლიდან. კარიერა ძირითადად თურქეთში აშენდა: იაპონური ირეზუმი და ნეო-ტრადიციული სტამბოლში, İstiklal-ის გამზირზე, და ხშირი სტუმრობა ევროპის სტუდიებში.",
      history: "Vasil Kurakhchishvili დაიბადა საქართველოში 1980 წელს. პროფესიონალურად ტატუირებს 2000 წლიდან, და ეს კარიერა ძირითადად თურქეთში აშენდა. სტუდია სტამბოლში, İstiklal-ის გამზირზეა. ხშირად მუშაობს სტუმრად ევროპის სტუდიებში.\n\nცნობილია იაპონური ირეზუმითა და ნეო-ტრადიციული ნამუშევრით. ასევე მუშაობს შავ-ნაცრისფერში, გეომეტრიაში, რეალიზმში, old school-სა და new school-ში. დიდი შეკვეთითი ნამუშევრებია სახელოები, ზურგის კომპოზიციები და ფეხის კომპლექტები: დრაკონები, hannya, სამურაი, გველები, პიონები და koi. ნახატი სხეულს მიჰყვება. კონტრასტი მძიმეა, ხაზები სქელია, ფონები მოძრაობს, ფერი კი ისეა შერჩეული, რომ წლების შემდეგაც ღირსეულად დარჩეს.\n\n2000-იანი წლების დასაწყისიდან მან დიდი ზომის შეკვეთითი იაპონური და ნეო-ტრადიციული ნამუშევარი შემოიტანა თურქულ სცენაზე, რომელიც მაშინ ძირითადად პატარა tribal და flash იყო. ის ამყარებდა ერთჯერად ნემსებს, უკეთეს პიგმენტს და ევროპულ ჰიგიენას. İstiklal-ის სტუდია თვალსაჩინო სივრცეა. ევროპულ სტუდიებთან თანამშრომლობამ და ნამუშევრის დონემ ის ახალგაზრდა ოსტატებისთვის საყრდენად აქცია.\n\nამ პრაქტიკისთვის დასახელებული სპონსორები: Cheyenne Tattoo Equipment, Radiant Tattoo Ink და Aloe Tattoo.\n\nამ გვერდის ფირფიტები ამ მოტივების სტუდიური ეტიუდებია. ისინი არ არის განკურნებული ტატუს ფოტოები.",
      captions: { "vaso-koi": "koi-ს ეტიუდი", "vaso-dragon": "დრაკონის ეტიუდი", "vaso-hannya": "hannya და პიონი", "vaso-tiger": "ვეფხვი და ტალღა", "vaso-shishi": "shishi" },
      alts: { "vaso-koi": "koi-სა და პიონის ეტიუდი.", "vaso-dragon": "დრაკონის ეტიუდი.", "vaso-hannya": "hannya-სა და პიონის ეტიუდი.", "vaso-tiger": "ვეფხვის ეტიუდი.", "vaso-shishi": "shishi-ს ეტიუდი." },
    },
  },
  "artist-andrei": {
    tr: {
      seoTitle: "Andrei Aivazian",
      seoDescription: "Tiflis’te Andrei Aivazian: realizm, portre ve siyah-gri. Black Kiss Tattoo ve kendi stüdyosu.",
      styles: ["Realizm", "Portre", "Siyah ve gri", "Japon", "Renk"],
      photoAlt: "Andrei Aivazian’ın portre fotoğrafı yok. Bu bir yer tutucudur.",
      blurb: "Andrei Aivazian, Tiflis’te yerleşik kıdemli bir dövme sanatçısıdır. Black Kiss Tattoo ve kendi stüdyosuyla anılır. Realizm, portre ve siyah-gri; on yıldan uzun kongre, misafirlik ve öğretim.",
      history: "Andrei Aivazian, Gürcistan’ın Tiflis kentinde yerleşik kıdemli bir dövme sanatçısıdır. Black Kiss Tattoo ve kendi stüdyosuyla anılır. İşin arkasında on yıldan uzun kongre, misafirlik ve öğretim vardır.\n\nÇekirdek realizm, portre ve siyah-gridir. Japon ve oryantal iş ile renk bunların yanındadır. Hiper-gerçek portreler, doku, derin kontrast ve yumuşak geçişlerle bilinir.\n\nTiflis’te sanatçılar yetiştirdi; aralarında Tatia Godibadze de vardır. Makine, iğne seçimi ve meslek etiği üzerine çalıştılar. Stüdyoları yerel sahneyi özel portfolyoya ve uluslararası hijyen standardına itti. Misafirlikler ve işin standardı, Tiflis’i Gürcistan dışındaki müşterilerin önüne koyan şeydir.\n\nBu pratik için adı geçen sponsorlar: Kwadron, World Famous Tattoo Ink ve Dragon Tattoo Supply.\n\nAndrei’nin portre fotoğrafı bu sayfada yok. Üstteki işaret yer tutucudur, onun resmi değildir.",
      captions: { "andrei-portrait": "Çalışma, iyileşmiş dövme değil", "andrei-contrast": "Kontrast çalışması" },
      alts: { "andrei-portrait": "Turna çalışması, dövme fotoğrafı değil.", "andrei-contrast": "Ağır kontrastlı blackwork çalışması." },
    },
    de: {
      seoTitle: "Andrei Aivazian",
      seoDescription: "Andrei Aivazian in Tiflis: Realismus, Porträt und Schwarz-Grau. Black Kiss Tattoo und das eigene Studio.",
      styles: ["Realismus", "Porträt", "Schwarz-grau", "Japanisch", "Farbe"],
      photoAlt: "Kein Porträtfoto von Andrei Aivazian. Dies ist ein Platzhalter.",
      blurb: "Andrei Aivazian ist ein erfahrener Tätowierer in Tiflis, Georgien, verbunden mit Black Kiss Tattoo und dem eigenen Studio. Realismus, Porträt und Schwarz-Grau, nach mehr als einem Jahrzehnt Kongresse, Gastspiele und Unterricht.",
      history: "Andrei Aivazian ist ein erfahrener Tätowierer in Tiflis, Georgien. Er ist mit Black Kiss Tattoo und mit dem eigenen Studio verbunden. Hinter der Arbeit liegen mehr als zehn Jahre Kongresse, Gastauftritte und Unterricht.\n\nDer Kern ist Realismus, Porträt und Schwarz-Grau. Japanische und orientalische Arbeit und Farbe stehen daneben. Bekannt ist er für hyperreale Porträts, Textur, tiefen Kontrast und weiche Verläufe.\n\nEr hat Künstler in Tiflis ausgebildet, darunter Tatia Godibadze, an der Maschine, an der Nadelwahl und an der Berufsethik. Die Studios haben die lokale Szene zu eigenen Portfolios und zu internationalen Hygienestandards geschoben. Gastspiele und der Standard der Arbeit sind das, was Tiflis vor Kunden außerhalb Georgiens gestellt hat.\n\nGenannte Sponsoren: Kwadron, World Famous Tattoo Ink und Dragon Tattoo Supply.\n\nEin Porträtfoto von Andrei liegt für diese Seite nicht vor. Die Marke oben ist ein Platzhalter, kein Bild von ihm.",
      captions: { "andrei-portrait": "Studie, kein geheiltes Tattoo", "andrei-contrast": "Kontraststudie" },
      alts: { "andrei-portrait": "Kranichstudie, kein Tattoolfoto.", "andrei-contrast": "Blackwork-Studie mit schwerem Kontrast." },
    },
    ru: {
      seoTitle: "Андрей Айвазян",
      seoDescription: "Андрей Айвазян в Тбилиси: реализм, портрет и чёрно-серое. Black Kiss Tattoo и собственная студия.",
      styles: ["Реализм", "Портрет", "Чёрно-серое", "Японское", "Цвет"],
      photoAlt: "Портрета Андрея Айвазяна нет. Это заполнитель.",
      blurb: "Андрей Айвазян — опытный тату-мастер из Тбилиси, связан с Black Kiss Tattoo и собственной студией. Реализм, портрет и чёрно-серое после более чем десяти лет конвенций, гостевых работ и преподавания.",
      history: "Андрей Айвазян — опытный тату-мастер из Тбилиси, Грузия. Его связывают с Black Kiss Tattoo и с собственной студией. За работой больше десяти лет конвенций, гостевых сессий и преподавания.\n\nОснова — реализм, портрет и чёрно-серое. Рядом японская и восточная работа и цвет. Его знают по гиперреалистичным портретам, фактуре, глубокому контрасту и мягким градиентам.\n\nОн учил мастеров в Тбилиси, в том числе Татию Годибадзе: машина, выбор иглы и профессиональная этика. Его студии двигали местную сцену к заказным портфолио и международным нормам гигиены. Гостевые работы и уровень работы — то, что поставило Тбилиси перед клиентами за пределами Грузии.\n\nНазванные спонсоры: Kwadron, World Famous Tattoo Ink и Dragon Tattoo Supply.\n\nПортретной фотографии Андрея для этой страницы нет. Знак сверху — заполнитель, не его снимок.",
      captions: { "andrei-portrait": "Этюд, не зажившая татуировка", "andrei-contrast": "Этюд контраста" },
      alts: { "andrei-portrait": "Этюд журавля, не фото татуировки.", "andrei-contrast": "Этюд блэкворка с тяжёлым контрастом." },
    },
    ka: {
      seoTitle: "Andrei Aivazian",
      seoDescription: "Andrei Aivazian თბილისში: რეალიზმი, პორტრეტი და შავ-ნაცრისფერი. Black Kiss Tattoo და საკუთარი სტუდია.",
      styles: ["რეალიზმი", "პორტრეტი", "შავ-ნაცრისფერი", "იაპონური", "ფერი"],
      photoAlt: "Andrei Aivazian-ის პორტრეტის ფოტო არ არის. ეს ჩანაცვლებული ნიშანია.",
      blurb: "Andrei Aivazian არის გამოცდილი ტატუ-ოსტატი თბილისში, საქართველო, დაკავშირებული Black Kiss Tattoo-სთან და საკუთარ სტუდიასთან. რეალიზმი, პორტრეტი და შავ-ნაცრისფერი, ათწლეულზე მეტი კონვენციის, სტუმრობისა და სწავლების შემდეგ.",
      history: "Andrei Aivazian არის გამოცდილი ტატუ-ოსტატი თბილისში, საქართველო. მას აკავშირებენ Black Kiss Tattoo-სთან და საკუთარ სტუდიასთან. ნამუშევრის უკან ათწლეულზე მეტი კონვენცია, სტუმრობა და სწავლება დგას.\n\nბირთვი რეალიზმი, პორტრეტი და შავ-ნაცრისფერია. გვერდით არის იაპონური და ორიენტალური ნამუშევარი და ფერი. ცნობილია ჰიპერრეალური პორტრეტებით, ფაქტურით, ღრმა კონტრასტით და რბილი გრადიენტებით.\n\nთბილისში ამზადებდა ოსტატებს, მათ შორის Tatia Godibadze-ს, მანქანაზე მუშაობაში, ნემსის არჩევაში და პროფესიულ ეთიკაში. მისმა სტუდიებმა ადგილობრივი სცენა შეკვეთითი პორტფოლიოებისა და საერთაშორისო ჰიგიენის სტანდარტისკენ წაიყვანა. სტუმრობებმა და ნამუშევრის დონემ თბილისი საქართველოს გარეთ მყოფი კლიენტების წინაშე დააყენა.\n\nამ პრაქტიკისთვის დასახელებული სპონსორები: Kwadron, World Famous Tattoo Ink და Dragon Tattoo Supply.\n\nAndrei Aivazian-ის პორტრეტის ფოტო ამ გვერდზე არ დევს. ზედა ნიშანი ჩანაცვლებულია, ეს მისი სურათი არ არის.",
      captions: { "andrei-portrait": "ეტიუდი, არა განკურნებული ტატუ", "andrei-contrast": "კონტრასტის ეტიუდი" },
      alts: { "andrei-portrait": "წეროს ეტიუდი, ტატუს ფოტო არ არის.", "andrei-contrast": "blackwork-ის ეტიუდი მძიმე კონტრასტით." },
    },
  },
  "artist-sample-guest": {
    tr: {
      seoTitle: "Örnek misafir",
      seoDescription: "Misafir sanatçı için örnek koltuk. İletişim sitede kalır.",
      styles: ["Misafir"],
      photoAlt: "Örnek misafir için yer tutucu.",
      blurb: "Ziyaretçi bir sanatçı için örnek koltuk. Misafirler kendi metinlerini ve resimlerini buraya koyar. Müşteriler onlara bu sitede yazar.",
      history: "Bu profil örnek misafirdir; portal ve yönetici görünümü açılsın diye durur. Instagram, Facebook, telefon, e-posta veya WhatsApp yoktur. Misafir giriş yapar, bu metni ve portfolyoyu düzenler, müşterilere buradan cevap verir. Vaso Vasiko ve Andrei Aivazian için stüdyo randevusu formu ayrıdır.",
      captions: { "guest-waves": "Örnek levha" },
      alts: { "guest-waves": "Örnek misafir portfolyosunda dalga çalışması." },
    },
    de: {
      seoTitle: "Beispielgast",
      seoDescription: "Ein Beispielplatz für einen Gastkünstler. Der Kontakt bleibt auf der Seite.",
      styles: ["Gast"],
      photoAlt: "Platzhalter für den Beispielgast.",
      blurb: "Ein Beispielplatz für einen Gast. Gäste setzen hier ihren eigenen Text und ihre Bilder. Kunden schreiben ihnen auf dieser Seite.",
      history: "Dieses Profil ist der Beispielgast, damit Portal und Manageransicht geöffnet werden können. Es gibt kein Instagram, Facebook, Telefon, E-Mail oder WhatsApp. Der Gast meldet sich an, bearbeitet diesen Text und das Portfolio und antwortet Kunden hier. Termine für Vaso Vasiko und Andrei Aivazian bleiben im Formular.",
      captions: { "guest-waves": "Beispielblatt" },
      alts: { "guest-waves": "Wellenstudie im Beispielportfolio." },
    },
    ru: {
      seoTitle: "Пример гостя",
      seoDescription: "Пример места для приглашённого мастера. Переписка остаётся на сайте.",
      styles: ["Гость"],
      photoAlt: "Заполнитель для примера гостя.",
      blurb: "Пример места для приезжего мастера. Гости сами кладут сюда текст и картинки. Клиенты пишут им на этом сайте.",
      history: "Этот профиль — пример гостя, чтобы можно было открыть портал и вид менеджера. Здесь нет Instagram, Facebook, телефона, почты и WhatsApp. Гость входит, правит этот текст и портфолио и отвечает клиентам здесь. Запись к Васо Васико и Андрею Айвазяну остаётся в форме студии.",
      captions: { "guest-waves": "Пример листа" },
      alts: { "guest-waves": "Этюд волны в примерном портфолио." },
    },
    ka: {
      seoTitle: "Sample Guest",
      seoDescription: "სანიმუშო ადგილი სტუმარი ოსტატისთვის. მიმოწერა საიტზე რჩება.",
      styles: ["სტუმრობა"],
      photoAlt: "ჩანაცვლებული ნიშანი Sample Guest-ისთვის.",
      blurb: "სანიმუშო ადგილი სტუმარი ოსტატისთვის. სტუმრები აქ დებენ საკუთარ ტექსტს და სურათებს. კლიენტები მათ ამ საიტზე სწერენ.",
      history: "ეს პროფილი სანიმუშო სტუმარია, რომ პორტალი და მენეჯერის ხედი გაიხსნას. აქ არ არის Instagram, Facebook, ტელეფონი, ელფოსტა ან WhatsApp. სტუმარი შედის, ასწორებს ამ ტექსტს და პორტფოლიოს და კლიენტებს აქ პასუხობს. Vaso Vasiko-სა და Andrei Aivazian-ის ჩაწერა ფორმაზე რჩება.",
      captions: { "guest-waves": "სანიმუშო ფირფიტა" },
      alts: { "guest-waves": "ტალღის ეტიუდი სანიმუშო პორტფოლიოში." },
    },
  },
};
