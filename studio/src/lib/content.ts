import type { Locale } from "./locale";
import type { Artist, Settings, StudioEvent } from "./types";

type Copy = { blurb: string; history: string; photoAlt: string; styles: string[]; captions: Record<string, string>; alts: Record<string, string>; seoTitle: string; seoDescription: string };

const artists: Record<string, Partial<Record<Locale, Copy>>> = {
  "artist-vaso": {
    tr: {
      seoTitle: "Irezumi",
      seoDescription: "Vaso Vasiko, Beyoğlu’nda irezumi ve yeni traditional. Kol kaplama ve Japon dövmesi.",
      styles: ["Japon irezumi", "Yeni traditional", "Kol kaplama"],
      photoAlt: "Vaso Vasiko için özgün çizilmiş portre. Sanatçının fotoğrafı değildir.",
      blurb: "Vasil Kurakhchishvili, 2000’den beri dövme yapıyor. İstanbul’da irezumi ve yeni traditional; 2015’ten beri Avrupa stüdyolarıyla da çalışıyor.",
      history: "Vasil Kurakhchishvili 1980’de Gürcistan’da doğdu ve 2000’den beri Vaso Vasiko adıyla dövme yapıyor. İşin çoğu Türkiye’de. 2015’ten beri Avrupa stüdyolarıyla da çalışıyor. Siyah-gri, geometrik, renkli, new school, old school, yeni traditional ve Japon stillerinde çalıştı. Önde tuttuğu stiller irezumi ve yeni traditional: dövme yıllar sonra da düzgün durmalı.\n\nMevcut portfolyo bitmiş işleri kavram olarak gösterir: koi, kaplan, samuray ve yılan, çiçek, leylek, hannya, fu dog ve ejderha. Bu sayfadaki levhalar o temaların özgün çalışmalarıdır, dövme fotoğrafı değildir.",
      captions: { "vaso-koi": "Koi çalışması, kol kavramı", "vaso-dragon": "Ejderha çalışması", "vaso-hannya": "Hannya ve şakayık", "vaso-tiger": "Kaplan ve dalga", "vaso-shishi": "Fu dog (shishi)" },
      alts: { "vaso-koi": "Siyah, kırmızı ve altın rengi koi ve şakayık çalışması.", "vaso-dragon": "Siyah pullu, kırmızı gözlü ejderha çalışması.", "vaso-hannya": "Hannya maskesi ve şakayık.", "vaso-tiger": "Dalga ve bambu içinde kaplan.", "vaso-shishi": "Şakayık yaprakları arasında shishi." },
    },
    de: {
      seoTitle: "Irezumi",
      seoDescription: "Vaso Vasiko, Irezumi und New Traditional in Beyoğlu. Ärmel und japanisches Tattoo.",
      styles: ["Japanisches Irezumi", "New Traditional", "Ganzarm"],
      photoAlt: "Gezeichnetes Porträt für Vaso Vasiko, keine Fotografie des Künstlers.",
      blurb: "Vasil Kurakhchishvili tätowiert seit 2000. Irezumi und New Traditional in Istanbul, seit 2015 auch mit Studios in Europa.",
      history: "Vasil Kurakhchishvili wurde 1980 in Georgien geboren und tätowiert seit 2000 als Vaso Vasiko. Der größte Teil der Arbeit entstand in der Türkei, seit 2015 auch mit europäischen Studios. Er hat schwarz-grau, geometrisch, farbig, New School, Old School, New Traditional und japanisch gearbeitet. Vorne bleiben Irezumi und New Traditional, weil ein Tattoo Jahre später noch stimmen soll.\n\nDas bestehende Portfolio zeigt fertige Stücke als Konzepte: Koi, Tiger, Samurai und Schlange, Blüten, Storch, Hannya, Fu-Hund und Drache. Die Blätter hier sind eigene Studien dieser Themen, keine Fotos der Tattoos.",
      captions: { "vaso-koi": "Koi-Studie für einen Ärmel", "vaso-dragon": "Drachenstudie", "vaso-hannya": "Hannya und Pfingstrose", "vaso-tiger": "Tiger und Welle", "vaso-shishi": "Fu-Hund (Shishi)" },
      alts: { "vaso-koi": "Koi- und Pfingstrosenstudie in Schwarz, Zinnober und Gold.", "vaso-dragon": "Drache mit schwarzen Schuppen und rotem Auge.", "vaso-hannya": "Hannya-Maske und Pfingstrose.", "vaso-tiger": "Tiger zwischen Wellen und Bambus.", "vaso-shishi": "Shishi zwischen Pfingstrosenblättern." },
    },
    ru: {
      seoTitle: "Ирэдзуми",
      seoDescription: "Васо Васико: ирэдзуми и нью-традишнл в Бейоглу. Рукава и японская татуировка.",
      styles: ["Японское ирэдзуми", "Нью-традишнл", "Рукав"],
      photoAlt: "Рисованный портрет Васо Васико, не фотография мастера.",
      blurb: "Васил Курахчишвили татуирует с 2000 года. Ирэдзуми и нью-традишнл в Стамбуле, с 2015 года ещё и с европейскими студиями.",
      history: "Васил Курахчишвили родился в Грузии в 1980 году и с 2000 года работает как Васо Васико. Большая часть пути прошла в Турции, с 2015 года он сотрудничает со студиями в Европе. Он работал в чёрно-сером, геометрии, цвете, нью-скуле, олд-скуле, нью-традишнл и японском стиле. Впереди ирэдзуми и нью-традишнл: тату должно читаться и годы спустя.\n\nСуществующее портфолио показывает готовые вещи как концепции: кои, тигр, самурай и змея, цветы, аист, хання, фу-дог и дракон. Листы здесь — собственные этюды этих тем, не фотографии тату.",
      captions: { "vaso-koi": "Этюд кои для рукава", "vaso-dragon": "Этюд дракона", "vaso-hannya": "Хання и пион", "vaso-tiger": "Тигр и волна", "vaso-shishi": "Фу-дог (сиси)" },
      alts: { "vaso-koi": "Кои и пион чёрным, киноварью и золотом.", "vaso-dragon": "Дракон с чёрной чешуёй и красным глазом.", "vaso-hannya": "Маска хання и пион.", "vaso-tiger": "Тигр среди волн и бамбука.", "vaso-shishi": "Сиси среди листьев пиона." },
    },
  },
  "artist-fahriye": {
    tr: {
      seoTitle: "Şakayık",
      seoDescription: "Fahriye Kayıhan, Beyoğlu’nda Japon çiçek dövmesi: şakayık ve dalga.",
      styles: ["Japon çiçekleri", "Şakayık", "Dalgalar"],
      photoAlt: "Fahriye Kayıhan için özgün çizilmiş portre. Sanatçının fotoğrafı değildir.",
      blurb: "Google yorumlarında stüdyodaki Japon işi, özellikle çiçek parçaları için adı geçer. Mevcut sitede ayrı bir biyografisi yoktur.",
      history: "Fahriye Kayıhan, stüdyoda dövme yaptıranların Google yorumlarında geçer. Japon işinden ve klasik çiçeğe yakın parçalardan söz ederler. vasovasiko.com tek sanatçı sitesi olarak yazılmıştır, ayrı sayfa vermez. Bu profil o yorumların dışına çıkmaz.\n\nResimler stüdyo paletinde özgün şakayık, turna ve dalga çalışmalarıdır. İyileşmiş dövme fotoğrafı değillerdir.",
      captions: { "fahriye-peony": "Şakayık çalışması", "fahriye-crane": "Su üzerinde turna", "fahriye-waves": "Dalga çalışması" },
      alts: { "fahriye-peony": "Siyah konturlu, kırmızı yapraklı şakayık.", "fahriye-crane": "Su üzerinde uçan turna.", "fahriye-waves": "Siyah mürekkep dalga ve kırmızı vurgu." },
    },
    de: {
      seoTitle: "Pfingstrose",
      seoDescription: "Fahriye Kayıhan, japanische Blumen in Beyoğlu: Pfingstrose und Wellen.",
      styles: ["Japanische Blumen", "Pfingstrose", "Wellen"],
      photoAlt: "Gezeichnetes Porträt für Fahriye Kayıhan, keine Fotografie.",
      blurb: "In öffentlichen Google-Rezensionen wird sie für japanische Arbeit im Studio genannt, vor allem florale Stücke. Die bestehende Seite hat keine eigene Biografie.",
      history: "Fahriye Kayıhan wird in Google-Rezensionen von Leuten genannt, die im Studio tätowiert wurden. Sie beschreiben japanische Arbeit, nahe an klassischen Blüten. vasovasiko.com ist als Seite einer Person geschrieben und gibt ihr kein eigenes Profil. Dieser Text bleibt bei dem, was die Rezensionen sagen.\n\nDie Bilder sind eigene Pfingstrosen-, Kranich- und Wellenstudien, keine Fotos geheilter Tattoos.",
      captions: { "fahriye-peony": "Pfingstrosenstudie", "fahriye-crane": "Kranich über Wasser", "fahriye-waves": "Wellenstudie" },
      alts: { "fahriye-peony": "Pfingstrose mit schwarzer Kontur und roten Blüten.", "fahriye-crane": "Kranich im Flug über Wasser.", "fahriye-waves": "Wellen in schwarzer Tusche mit rotem Akzent." },
    },
    ru: {
      seoTitle: "Пион",
      seoDescription: "Фахрие Кайыхан: японские цветы в Бейоглу, пион и волны.",
      styles: ["Японские цветы", "Пион", "Волны"],
      photoAlt: "Рисованный портрет Фахрие Кайыхан, не фотография.",
      blurb: "В публичных отзывах Google её называют за японскую работу в студии, особенно за цветы. На существующем сайте отдельной биографии нет.",
      history: "Фахрие Кайыхан упоминают в отзывах Google люди, которые делали тату в студии. Они пишут о японской работе, близкой к классическому цветку. vasovasiko.com написан как сайт одного мастера и не даёт ей отдельной страницы. Этот текст не выходит за отзывы.\n\nКартины — собственные этюды пиона, журавля и волн, не фотографии заживших тату.",
      captions: { "fahriye-peony": "Этюд пиона", "fahriye-crane": "Журавль над водой", "fahriye-waves": "Этюд волн" },
      alts: { "fahriye-peony": "Пион с чёрным контуром и красными лепестками.", "fahriye-crane": "Журавль в полёте над водой.", "fahriye-waves": "Волны чёрной тушью с красным акцентом." },
    },
  },
  "artist-ahmet": {
    tr: {
      seoTitle: "Blackwork",
      seoDescription: "Ahmet (Mr Amo), Beyoğlu’nda siyah-gri ve özel blackwork, boyun işleri dahil.",
      styles: ["Siyah ve gri", "Özel blackwork", "Boyun"],
      photoAlt: "Ahmet için özgün çizilmiş portre. Sanatçının fotoğrafı değildir.",
      blurb: "Google yorumlarında Ahmet, Mr Amo olarak da geçer: sabırlı özel iş ve boyun dövmeleri.",
      history: "Google yorumları Ahmet’i, müşterilerin Mr Amo dediği isimle, sabırlı özel iş ve boyun dövmeleri için anar. Mevcut portfolyo onu ayrı listelemez. Bu profil, kamuya açık adları kadroya koymak ve biri ayrılınca ya da gelince düzenlenebilsin diye durur.\n\nLevhalar özgün blackwork çalışmalarıdır, dövme fotoğrafı değildir.",
      captions: { "ahmet-blackwork": "Blackwork bant çalışması", "ahmet-collar": "Yaka çalışması" },
      alts: { "ahmet-blackwork": "Ağır bantlar ve boşluklu geometri.", "ahmet-collar": "Tek altın çizgili yaka biçimli blackwork." },
    },
    de: {
      seoTitle: "Blackwork",
      seoDescription: "Ahmet (Mr Amo), schwarz-grau und Blackwork in Beyoğlu, auch am Hals.",
      styles: ["Schwarz-grau", "Blackwork", "Hals"],
      photoAlt: "Gezeichnetes Porträt für Ahmet, keine Fotografie.",
      blurb: "Google-Rezensionen nennen Ahmet, auch Mr Amo, für geduldige Einzelstücke und Halstattoos.",
      history: "Google-Rezensionen nennen Ahmet, von Kunden Mr Amo genannt, für geduldige Einzelarbeit und Tattoos am Hals. Das bestehende Portfolio führt ihn nicht einzeln. Dieses Profil steht hier, damit die öffentlichen Namen im Kader sind und sich ändern lassen, wenn jemand kommt oder geht.\n\nDie Blätter sind eigene Blackwork-Studien, keine Fotos seiner Tattoos.",
      captions: { "ahmet-blackwork": "Blackwork-Band", "ahmet-collar": "Kragenstudie" },
      alts: { "ahmet-blackwork": "Schwere Bänder und Geometrie aus freiem Raum.", "ahmet-collar": "Kragenförmiges Blackwork mit einer Goldlinie." },
    },
    ru: {
      seoTitle: "Блэкворк",
      seoDescription: "Ахмет (Mr Amo): чёрно-серое и блэкворк в Бейоглу, в том числе на шее.",
      styles: ["Чёрно-серое", "Блэкворк", "Шея"],
      photoAlt: "Рисованный портрет Ахмета, не фотография.",
      blurb: "В отзывах Google Ахмета, его же зовут Mr Amo, благодарят за терпеливую заказную работу и тату на шее.",
      history: "Отзывы Google называют Ахмета, клиенты говорят Mr Amo, за терпеливые заказные вещи и тату на шее. Существующее портфолио не выделяет его отдельно. Профиль здесь, чтобы публичные имена были в составе и их можно было править, когда кто-то приходит или уходит.\n\nЛисты — собственные этюды блэкворка, не фотографии его тату.",
      captions: { "ahmet-blackwork": "Этюд блэкворк-ленты", "ahmet-collar": "Этюд ворота" },
      alts: { "ahmet-blackwork": "Тяжёлые полосы и геометрия из пустого места.", "ahmet-collar": "Блэкворк в форме ворота с одной золотой линией." },
    },
  },
};

const events: Record<string, Partial<Record<Locale, { title: string; description: string; guest: string; country: string; imageAlt: string; seoDescription: string }>>> = {
  "event-osaka": {
    tr: {
      title: "Misafir günü — irezumi sanatçısı",
      guest: "Osaka’dan misafir sanatçı",
      country: "Japonya",
      imageAlt: "Dalga paravanlı loş stüdyo çizimi, Japonya misafir günü için.",
      seoDescription: "İstanbul’da misafir dövme sanatçısı: Japonya’dan irezumi haftası, 12–16 Kasım 2026.",
      description: "Stüdyo başka ülkelerden misafir dövme sanatçısı ağırlar. Bu Kasım haftası, Japonya’dan bir irezumi sanatçısı için örnek kayıttır. Haber sayfalarında bu tarihler için bir ad yoktu. Gerçek misafir netleşince adı, tarihi ve görseli buradan değiştirin.",
    },
    de: {
      title: "Gasttag — Irezumi-Künstler",
      guest: "Gast aus Osaka",
      country: "Japan",
      imageAlt: "Zeichnung eines dunklen Studios mit Wellenparavent, für den Japan-Gasttag.",
      seoDescription: "Gasttätowierer in Istanbul: eine Irezumi-Woche aus Japan, 12.–16. November 2026.",
      description: "Das Studio lädt Gasttätowierer aus anderen Ländern ein. Diese Novemberwoche ist ein Beispiel für einen Irezumi-Gast aus Japan. Auf den Nachrichtenseiten stand kein Name für diese Daten. Tauschen Sie Name, Datum und Bild aus, wenn der Gast feststeht.",
    },
    ru: {
      title: "Гостевой день — мастер ирэдзуми",
      guest: "Гость из Осаки",
      country: "Япония",
      imageAlt: "Рисунок тёмной студии с ширмой волн, для гостевого дня из Японии.",
      seoDescription: "Приглашённый тату-мастер в Стамбуле: неделя ирэдзуми из Японии, 12–16 ноября 2026.",
      description: "Студия принимает приглашённых мастеров из других стран. Эта ноябрьская неделя — пример гостя ирэдзуми из Японии. На страницах новостей имени на эти даты не было. Когда гость подтвердится, замените имя, даты и картинку.",
    },
  },
  "event-marmaris": {
    en: {
      title: "Marmari Tattoo Festival",
      guest: "Studio at the festival",
      country: "Turkey",
      imageAlt: "Dusk illustration of a seaside gathering drawn as Japanese waves, for the Marmari Tattoo Festival.",
      seoDescription: "Marmari Tattoo Festival in Marmaris, 3–5 October 2025. The studio is a partner of the convention.",
      description: "The Marmari Tattoo Festival is the international gathering in Marmaris, also listed on the existing partners page as Marmaris Tattoo Convention. The last announced edition ran 3–5 October 2025 at Green Nature Diamond Hotel. A later date was not on the studio news pages. Update this entry when the next edition is confirmed.",
    },
    tr: {
      title: "Marmari dövme festivali",
      guest: "Festivalde stüdyo",
      country: "Türkiye",
      imageAlt: "Japon dalgalarıyla çizilmiş sahil buluşması, Marmari dövme festivali için.",
      seoDescription: "Marmaris’te Marmari dövme festivali, 3–5 Ekim 2025. Stüdyo bu buluşmanın ortağıdır.",
      description: "Marmari dövme festivali, Marmaris’teki uluslararası buluşmadır. Mevcut ortaklar sayfasında Marmaris Tattoo Convention olarak da durur. Son duyurulan tarih 3–5 Ekim 2025, Green Nature Diamond Hotel. Daha yeni bir tarih haber sayfalarında yoktu. Yeni edisyon netleşince bu kaydı güncelleyin.",
    },
    de: {
      title: "Marmari Tattoo Festival",
      guest: "Studio auf dem Festival",
      country: "Türkei",
      imageAlt: "Abendliche Zeichnung eines Treffens am Meer als japanische Wellen, für das Marmari Tattoo Festival.",
      seoDescription: "Marmari Tattoo Festival in Marmaris, 3.–5. Oktober 2025. Das Studio ist Partner der Convention.",
      description: "Das Marmari Tattoo Festival ist das internationale Treffen in Marmaris, auf der Partnerseite auch Marmaris Tattoo Convention genannt. Die letzte angekündigte Ausgabe lief vom 3. bis 5. Oktober 2025 im Green Nature Diamond Hotel. Ein späteres Datum stand nicht auf den Nachrichtenseiten. Aktualisieren Sie den Eintrag, wenn die nächste Ausgabe feststeht.",
    },
    ru: {
      title: "Фестиваль Marmari",
      guest: "Студия на фестивале",
      country: "Турция",
      imageAlt: "Вечерний рисунок встречи у моря японскими волнами, для фестиваля Marmari.",
      seoDescription: "Фестиваль Marmari в Мармарисе, 3–5 октября 2025. Студия участвует в этой встрече.",
      description: "Фестиваль Marmari — международная встреча в Мармарисе. На странице партнёров она же названа Marmaris Tattoo Convention. Последние объявленные даты — 3–5 октября 2025, отель Green Nature Diamond. Более новой даты на страницах новостей не было. Обновите запись, когда станет известен следующий год.",
    },
  },
  "event-hamburg": {
    tr: {
      title: "Misafir günü — Almanya’dan sanatçı",
      guest: "Hamburg’dan misafir sanatçı",
      country: "Almanya",
      imageAlt: "Dalga ve altın ufuk çizgisine indirgenmiş liman suyu, Almanya misafir günü için.",
      seoDescription: "İstanbul’da Avrupa’dan misafir dövme sanatçısı örneği, 18–22 Mart 2026.",
      description: "Avrupa’dan bir misafir haftasının örneği. Stüdyo 2015’ten beri Avrupa stüdyolarıyla çalışıyor. Bu hafta için yayımlanmış bir ad yok. Kaydı yönetim panelinden düzenleyin ya da silin.",
    },
    de: {
      title: "Gasttag — Künstler aus Deutschland",
      guest: "Gast aus Hamburg",
      country: "Deutschland",
      imageAlt: "Hafenwasser, auf Wellen und eine goldene Horizontlinie reduziert, für den Deutschland-Gasttag.",
      seoDescription: "Beispiel eines Gasttätowierers aus Europa in Istanbul, 18.–22. März 2026.",
      description: "Ein Beispiel für eine europäische Gastwoche. Das Studio arbeitet seit 2015 mit Studios in Europa. Für diese Woche wurde kein Name veröffentlicht. Bearbeiten oder löschen Sie den Eintrag im Admin.",
    },
    ru: {
      title: "Гостевой день — мастер из Германии",
      guest: "Гость из Гамбурга",
      country: "Германия",
      imageAlt: "Вода гавани, сведённая к волнам и золотой линии горизонта, для гостевого дня из Германии.",
      seoDescription: "Пример приглашённого мастера из Европы в Стамбуле, 18–22 марта 2026.",
      description: "Пример европейской гостевой недели. Студия с 2015 года работает с европейскими студиями. Имени на эту неделю не публиковали. Правьте или удалите запись в админке.",
    },
  },
};

const studioCopy: Partial<Record<Locale, { tagline: string; heroLead: string; about: string; note: string }>> = {
  tr: {
    tagline: "Kalıcı Japon dövmesi.",
    heroLead: "İstiklal’de irezumi ve yeni traditional. Başka ülkelerden misafirler ve Marmari dövme festivali gibi buluşmalar.",
    note: "Mevcut site (vasovasiko.com) pratiği Vaso Vasiko olarak sunar. Google kaydı byvasovasiko adını kullanır. ByVasoVasiko, ayarlardan değiştirilene kadar bu sitedeki geçici addır.",
    about: "ByVasoVasiko, Asmalı Mescit’te İstiklal Caddesi üzerindeki Demirhan Apartmanı’nın üçüncü katındaki Japon dövme stüdyosunun geçici adıdır. Arkasındaki isim Vasil Kurakhchishvili, bilinen adıyla Vaso Vasiko. 1980’de Gürcistan’da doğdu, 2000’den beri dövme yapıyor. Yolun çoğu Türkiye’de geçti; 2015’ten beri Avrupa stüdyolarıyla çalışıyor.\n\nMasa, yıllar sonra da okunan özel Japon dövmesi, yani irezumi, ve yeni traditional üzerine kurulu. Siyah-gri, geometrik, renkli, new school ve old school da geçmişte var. İğneler tek kullanımlık, boyalar Avrupa standartlarında. Mevcut sitede adı geçen destekçiler arasında Cheyenne, Radiant, Aloe Tattoo ve Onyx var.\n\nBitmiş dövmeler mevcut portfolyoda kavram levhaları olarak durur: koi, kaplan, samuray ve yılan, çiçek, leylek, hannya, fu dog ve ejderha. Bu site o fotoğrafları kopyalamaz.\n\nGoogle işletmeyi byvasovasiko olarak listeler, pazartesiden cumartesiye açıktır, 22 yorumda 4,7 puanı vardır. Stüdyo misafir sanatçı ağırlar ve Marmari dövme festivaliyle bağlantılıdır.",
  },
  de: {
    tagline: "Japanisches Tattoo, das bleibt.",
    heroLead: "Irezumi und New Traditional an der Istiklal, mit Gästen aus anderen Ländern und Treffen wie dem Marmari Tattoo Festival.",
    note: "Die bestehende Seite (vasovasiko.com) nennt die Praxis Vaso Vasiko. Google führt das Geschäft als byvasovasiko. ByVasoVasiko ist der vorläufige Name dieser Seite, bis er in den Einstellungen geändert wird.",
    about: "ByVasoVasiko ist der vorläufige Name des japanischen Tattoo-Studios im dritten Stock des Demirhan-Apartments an der İstiklal in Asmalı Mescit. Dahinter steht Vasil Kurakhchishvili, bekannt als Vaso Vasiko. Er wurde 1980 in Georgien geboren und tätowiert seit 2000. Den größten Teil der Laufbahn verbrachte er in der Türkei, seit 2015 arbeitet er mit Studios in Europa.\n\nDie Bank steht auf japanischem Tattoo, Irezumi, und auf New Traditional, das Jahre später noch lesbar ist. Schwarz-grau, geometrisch, Farbe, New School und Old School gehören zur Geschichte. Nadeln sind Einweg, Farben folgen europäischen Normen. Auf der bestehenden Seite genannte Partner sind Cheyenne, Radiant, Aloe Tattoo und Onyx.\n\nFertige Tattoos stehen im bestehenden Portfolio als Konzeptblätter: Koi, Tiger, Samurai und Schlange, Blüten, Storch, Hannya, Fu-Hund und Drache. Diese Seite kopiert jene Fotos nicht.\n\nGoogle führt das Geschäft als byvasovasiko, geöffnet Montag bis Samstag, mit 4,7 aus 22 Rezensionen. Das Studio lädt Gastkünstler ein und ist mit dem Marmari Tattoo Festival verbunden.",
  },
  ru: {
    tagline: "Японская татуировка, которая остаётся.",
    heroLead: "Ирэдзуми и нью-традишнл на Истикляль, с гостями из других стран и встречами вроде фестиваля Marmari.",
    note: "Существующий сайт (vasovasiko.com) представляет практику как Vaso Vasiko. В Google бизнес указан как byvasovasiko. ByVasoVasiko — временное имя этого сайта, пока его не сменят в настройках.",
    about: "ByVasoVasiko — временное имя японской тату-студии на третьем этаже дома Демирхан, на Истикляль в Асмалы Месджит. За ним стоит Васил Курахчишвили, известный как Васо Васико. Он родился в Грузии в 1980 году и татуирует с 2000-го. Большая часть пути прошла в Турции, с 2015 года он работает со студиями в Европе.\n\nСтанок собран вокруг японской татуировки, ирэдзуми, и нью-традишнл, которые читаются и годы спустя. В истории есть чёрно-серое, геометрия, цвет, нью-скул и олд-скул. Иглы одноразовые, краски по европейским нормам. На существующем сайте среди спонсоров названы Cheyenne, Radiant, Aloe Tattoo и Onyx.\n\nГотовые тату лежат в существующем портфолио как концепт-листы: кои, тигр, самурай и змея, цветы, аист, хання, фу-дог и дракон. Этот сайт те фотографии не копирует.\n\nGoogle ведёт бизнес как byvasovasiko, открыт с понедельника по субботу, оценка 4,7 по 22 отзывам. Студия принимает гостей и связана с фестивалем Marmari.",
  },
};

export function localizeSettings(settings: Settings, lang: Locale): Settings {
  const copy = studioCopy[lang];
  if (!copy || lang === "en") return settings;
  return { ...settings, tagline: copy.tagline, heroLead: copy.heroLead, about: copy.about, officialNameNote: copy.note };
}

export function artistIsLocalized(artist: Artist, lang: Locale) {
  return lang === "en" || Boolean(artists[artist.id]?.[lang]);
}

export function eventIsLocalized(event: StudioEvent, lang: Locale) {
  return lang === "en" || Boolean(events[event.id]?.[lang]);
}

export function localizeArtist(artist: Artist, lang: Locale): Artist & { seoTitle: string; seoDescription: string } {
  const copy = artists[artist.id]?.[lang];
  if (!copy) {
    return {
      ...artist,
      seoTitle: artist.name,
      seoDescription: artist.blurb,
    };
  }
  return {
    ...artist,
    styles: copy.styles,
    blurb: copy.blurb,
    history: copy.history,
    photoAlt: copy.photoAlt,
    seoTitle: copy.seoTitle,
    seoDescription: copy.seoDescription,
    portfolio: artist.portfolio.map((image) => ({
      ...image,
      alt: copy.alts[image.id] || image.alt,
      caption: copy.captions[image.id] || image.caption,
    })),
  };
}

export function localizeEvent(event: StudioEvent, lang: Locale): StudioEvent & { seoDescription: string } {
  const copy = events[event.id]?.[lang];
  if (!copy) return { ...event, seoDescription: event.description };
  return { ...event, ...copy };
}

export function artistSeo(artist: Artist, lang: Locale) {
  if (!artistIsLocalized(artist, lang)) return { title: artist.name, description: artist.name };
  if (lang === "en") {
    if (artist.id === "artist-vaso") return { title: "Irezumi", description: `${artist.name} tattoos irezumi and new traditional in Beyoğlu, Istanbul.` };
    if (artist.id === "artist-fahriye") return { title: "Japanese florals", description: `${artist.name} works Japanese florals in Beyoğlu: peony and waves.` };
    if (artist.id === "artist-ahmet") return { title: "Blackwork", description: `${artist.name} works black and grey and custom blackwork in Beyoğlu, including neck pieces.` };
  }
  const view = localizeArtist(artist, lang);
  return { title: view.seoTitle, description: view.seoDescription };
}
