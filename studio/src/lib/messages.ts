import type { Locale } from "./locale";

export type Messages = {
  nav: { artists: string; styles: string; events: string; about: string; faq: string; book: string; menu: string; close: string; languages: string; kicker: string; skip: string };
  footer: { hours: string; reach: string; note: string; google: string; portfolio: string; aftercare: string; admin: string; newTab: string };
  days: Record<string, string>;
  closed: string;
  status: { Upcoming: string; Past: string; Now: string; featured: string };
  home: { heroTitle: string; intro: string; eventsKicker: string; eventsTitle: string; eventsLead: string; allEvents: string; artistsKicker: string; artistsTitle: string; artistsLead: string; allArtists: string; visitTitle: string; online: string; listing: string; heroAlt: string };
  artistsPage: { title: string; lead: string };
  artistPage: { work: string; request: string; portfolio: string; untranslated: string };
  eventsPage: { title: string; lead: string };
  eventPage: { request: string; all: string; other: string; untranslated: string };
  about: { title: string; publicName: string; reach: string; address: string; phone: string; also: string; email: string; whatsapp: string; hours: string; google: string; booking: string; portfolio: string };
  book: { title: string; lead: string };
  styles: { title: string; lead: string; items: { title: string; body: string }[]; more: string };
  aftercare: { title: string; intro: string; sections: { title: string; body: string }[]; call: string };
  faq: { title: string; items: { q: string; a: string }[] };
  form: { name: string; email: string; phone: string; artist: string; message: string; send: string; sending: string; ok: string; preference: string; error: string };
  notFound: { title: string; body: string; home: string };
  seo: {
    homeTitle: string; homeDescription: string;
    artistsTitle: string; artistsDescription: string;
    aboutTitle: string; aboutDescription: string;
    bookTitle: string; bookDescription: string;
    stylesTitle: string; stylesDescription: string;
    eventsTitle: string; eventsDescription: string;
    aftercareTitle: string; aftercareDescription: string;
    faqTitle: string; faqDescription: string;
  };
};

const daysEn = { Monday: "Monday", Tuesday: "Tuesday", Wednesday: "Wednesday", Thursday: "Thursday", Friday: "Friday", Saturday: "Saturday", Sunday: "Sunday" };

export const messages: Record<Locale, Messages> = {
  en: {
    nav: { artists: "Artists", styles: "Styles", events: "Events", about: "About", faq: "FAQ", book: "Book", menu: "Menu", close: "Close", languages: "Languages", kicker: "Irezumi studio", skip: "Skip to content" },
    footer: { hours: "Hours", reach: "Reach the studio", note: "Portraits and plates on this site are original illustrations.", google: "Google Business", portfolio: "Existing portfolio", aftercare: "Aftercare", admin: "Studio admin", newTab: "opens in a new tab" },
    days: daysEn,
    closed: "Closed",
    status: { Upcoming: "Upcoming", Past: "Past", Now: "Now", featured: "Featured on home" },
    home: {
      heroTitle: "Best tattoo artists",
      intro: "A tattoo studio in Istanbul, on Istiklal Street in Beyoğlu.",
      eventsKicker: "Special events",
      eventsTitle: "Guests and gatherings",
      eventsLead: "Visiting artists from other countries, and days such as the Marmari Tattoo Festival.",
      allEvents: "All events",
      artistsKicker: "The bench",
      artistsTitle: "Artists",
      artistsLead: "Who is working, and the styles they take.",
      allArtists: "All artists",
      visitTitle: "Write, call, or come up",
      online: "Also online",
      listing: "Open the Google listing",
      heroAlt: "A tattoo artist working on a client's leg in the studio",
    },
    artistsPage: { title: "Tattoo shop in Beyoğlu", lead: "The tattoo shop in Beyoğlu, above Istiklal Street in Asmalı Mescit. Open a portrait for the history and the plates." },
    artistPage: { work: "Work", request: "Request this artist", portfolio: "Existing portfolio", untranslated: "This profile has not been translated yet." },
    eventsPage: { title: "Guest tattoo artist in Istanbul", lead: "Guest tattoo artists in Istanbul, and the Marmari Tattoo Festival. Home shows only the featured dates." },
    eventPage: { request: "Request a sitting", all: "All events", other: "Other events", untranslated: "This event has not been translated yet." },
    about: { title: "Istiklal Street tattoo", publicName: "Public name", reach: "Reach", address: "Address", phone: "Phone", also: "Also listed", email: "Email", whatsapp: "WhatsApp", hours: "Hours", google: "Open the Google Business listing", booking: "Open the booking form", portfolio: "Existing portfolio" },
    book: { title: "Tattoo appointment in Beyoğlu", lead: "Request a tattoo appointment in Beyoğlu. Send an idea, the placement, and a rough time. The studio replies by email or WhatsApp." },
    styles: {
      title: "Japanese tattoo in Istanbul",
      lead: "Japanese tattoo in Istanbul is the centre of the bench: irezumi and new traditional, plus the black and grey custom work done here.",
      more: "See who works in these styles",
      items: [
        { title: "Irezumi", body: "Sleeves and larger pieces built from koi, dragon, peony, hannya, and waves. This is the work Vaso Vasiko keeps at the front of the studio." },
        { title: "New traditional", body: "Bold outlines and a limited palette, planned so the tattoo still reads years later." },
        { title: "Black and grey", body: "Weight, negative space, and custom blackwork, including neck pieces." },
        { title: "Also in the history", body: "Geometric, colour, new school, and old school appear in the public biography. Japanese and new traditional stay in front." },
      ],
    },
    aftercare: {
      title: "Aftercare",
      intro: "General care for a fresh tattoo, not medical advice. If the skin is hot, streaking, or you feel unwell, contact a doctor.",
      call: "For ordinary healing questions, call the studio.",
      sections: [
        { title: "The first days", body: "Leave the covering on for the time you were told. Wash with clean hands and a mild, unscented soap. Pat dry. Use a thin layer of the ointment you were given." },
        { title: "While it settles", body: "Do not soak it. Skip swimming, baths, and saunas until the surface has closed. Keep it out of the sun. Wear loose clothing. Do not pick flakes." },
      ],
    },
    faq: {
      title: "Questions",
      items: [
        { q: "How do I book a tattoo appointment in Beyoğlu?", a: "Use the form with an idea or reference, the placement, and a rough time. The existing appointment notes say the studio replies by email or WhatsApp, usually within five working days." },
        { q: "Is there a deposit?", a: "The existing site states a deposit of 200 euros. It is applied to the final cost, it is not refunded, and it holds the date. They ask for 72 hours’ notice to reschedule." },
        { q: "When is the design ready?", a: "After the project is agreed, the design is presented within about 20 working days. The sitting is booked once you approve it." },
        { q: "Do you host a guest tattoo artist?", a: "Yes. Guest spots from other countries are listed on the events page, and the featured ones also appear on the home page." },
        { q: "What about the Marmari Tattoo Festival?", a: "The studio takes part in the Marmari Tattoo Festival in Marmaris. The last announced edition was 3–5 October 2025. The next dates are updated on the events page." },
        { q: "Where is the studio?", a: "Asmalı Mescit Mahallesi, İstiklal Cd. No:164, 34430 Beyoğlu/İstanbul, Türkiye. The map and hours are on the contact page." },
      ],
    },
    form: { name: "Name", email: "Email", phone: "Phone", artist: "Preferred artist", message: "Idea, placement, and rough timing", send: "Send request", sending: "Sending…", ok: "Request received. The studio will reply by email or WhatsApp.", preference: "No preference", error: "The message could not be sent." },
    notFound: { title: "That page is not here", body: "Try the artists, the events, or the front page.", home: "Back home" },
    seo: {
      homeTitle: "Tattoo studio Istanbul",
      homeDescription: "Tattoo studio in Istanbul, on Istiklal Street in Beyoğlu. Japanese work, custom pieces, and guest artists.",
      artistsTitle: "Tattoo shop Beyoğlu",
      artistsDescription: "Tattoo shop in Beyoğlu, on Istiklal Street in Asmalı Mescit. Artists, styles, and portfolios.",
      aboutTitle: "Istiklal Street tattoo",
      aboutDescription: "Istiklal Street tattoo studio in Asmalı Mescit, Beyoğlu. Address, hours, phone, and map.",
      bookTitle: "Tattoo appointment Beyoğlu",
      bookDescription: "Request a tattoo appointment in Beyoğlu. The studio replies by email or WhatsApp.",
      stylesTitle: "Japanese tattoo Istanbul",
      stylesDescription: "Japanese tattoo in Istanbul: irezumi, new traditional, and black and grey custom work.",
      eventsTitle: "Guest tattoo artist Istanbul",
      eventsDescription: "Guest tattoo artists in Istanbul, and the Marmari Tattoo Festival.",
      aftercareTitle: "Aftercare",
      aftercareDescription: "How to look after a fresh tattoo, and when to call the studio.",
      faqTitle: "Questions",
      faqDescription: "Booking a tattoo appointment in Beyoğlu, deposits, guest artists, and the Marmari Tattoo Festival.",
    },
  },
  tr: {
    nav: { artists: "Sanatçılar", styles: "Stiller", events: "Etkinlikler", about: "Hakkında", faq: "Sorular", book: "Randevu", menu: "Menü", close: "Kapat", languages: "Diller", kicker: "Irezumi stüdyosu", skip: "İçeriğe geç" },
    footer: { hours: "Saatler", reach: "Stüdyoya ulaşın", note: "Bu sitedeki portreler ve desenler özgün çizimlerdir.", google: "Google Business", portfolio: "Mevcut portfolyo", aftercare: "Bakım", admin: "Stüdyo yönetimi", newTab: "yeni sekmede açılır" },
    days: { Monday: "Pazartesi", Tuesday: "Salı", Wednesday: "Çarşamba", Thursday: "Perşembe", Friday: "Cuma", Saturday: "Cumartesi", Sunday: "Pazar" },
    closed: "Kapalı",
    status: { Upcoming: "Yaklaşan", Past: "Geçmiş", Now: "Şimdi", featured: "Ana sayfada" },
    home: {
      heroTitle: "En iyi dövme sanatçıları",
      intro: "İstiklal’de, Beyoğlu’nda bir İstanbul dövme stüdyosu.",
      eventsKicker: "Özel etkinlikler",
      eventsTitle: "Misafirler ve buluşmalar",
      eventsLead: "Başka ülkelerden misafir dövme sanatçıları ve Marmari dövme festivali gibi günler.",
      allEvents: "Tüm etkinlikler",
      artistsKicker: "Masa",
      artistsTitle: "Sanatçılar",
      artistsLead: "Kim çalışıyor, hangi stilleri alıyor.",
      allArtists: "Tüm sanatçılar",
      visitTitle: "Yazın, arayın ya da çıkın",
      online: "Çevrimiçi",
      listing: "Google kaydını aç",
      heroAlt: "Stüdyoda bir müşterinin bacağına dövme yapan sanatçı",
    },
    artistsPage: { title: "Beyoğlu dövme", lead: "Asmalı Mescit’te, İstiklal üzerindeki Beyoğlu dövme stüdyosu. Portreye girince tarih ve desenler açılır." },
    artistPage: { work: "İşler", request: "Bu sanatçıyı iste", portfolio: "Mevcut portfolyo", untranslated: "Bu profil henüz çevrilmedi." },
    eventsPage: { title: "Misafir dövme sanatçısı", lead: "İstanbul’da misafir dövme sanatçısı günleri ve Marmari dövme festivali. Ana sayfa yalnızca öne çıkan tarihleri gösterir." },
    eventPage: { request: "Randevu iste", all: "Tüm etkinlikler", other: "Diğer etkinlikler", untranslated: "Bu etkinlik henüz çevrilmedi." },
    about: { title: "İstiklal dövme", publicName: "Kamuya açık ad", reach: "Ulaşın", address: "Adres", phone: "Telefon", also: "Ayrıca kayıtlı", email: "E-posta", whatsapp: "WhatsApp", hours: "Saatler", google: "Google Business kaydını aç", booking: "Randevu formunu aç", portfolio: "Mevcut portfolyo" },
    book: { title: "Dövme randevu Beyoğlu", lead: "Beyoğlu’nda dövme randevusu isteyin. Fikri, bölgeyi ve kabaca zamanı yazın. Stüdyo e-posta ya da WhatsApp ile döner." },
    styles: {
      title: "Japon dövmesi",
      lead: "Stüdyonun ortasında Japon dövmesi var: irezumi ve yeni traditional, yanında siyah-gri özel iş.",
      more: "Bu stillerde kim çalışıyor",
      items: [
        { title: "Irezumi", body: "Koi, ejderha, şakayık, hannya ve dalgalardan kurulan kol ve büyük parçalar. Vaso Vasiko’nun önde tuttuğu iş budur." },
        { title: "Yeni traditional", body: "Kalın kontur ve sınırlı palet. Dövme yıllar sonra da okunur kalsın diye kurulur." },
        { title: "Siyah ve gri", body: "Ağırlık, boşluk ve özel blackwork; boyun işleri de buna girer." },
        { title: "Geçmişte de", body: "Geometrik, renkli, new school ve old school kamuya açık biyografide geçer. Önde Japon ve yeni traditional durur." },
      ],
    },
    aftercare: {
      title: "Bakım",
      intro: "Taze dövme için genel bakım. Tıbbi tavsiye değildir. Deri sıcaksa, çizgi halinde kızarıyorsa ya da kendinizi kötü hissediyorsanız bir hekime başvurun.",
      call: "Olağan iyileşme soruları için stüdyoyu arayın.",
      sections: [
        { title: "İlk günler", body: "Örtüyü söylenen süre boyunca bırakın. Temiz elle ve kokusuz hafif bir sabunla yıkayın. Bastırarak kurulayın. Verilen merhemden ince bir kat sürün." },
        { title: "Yerleşirken", body: "Suya sokmayın. Yüzey kapanana kadar havuz, banyo ve sauna yok. Güneşten kaçının. Bol kıyafet giyin. Kabuğu koparmayın." },
      ],
    },
    faq: {
      title: "Sorular",
      items: [
        { q: "Beyoğlu’nda dövme randevusu nasıl alınır?", a: "Forma fikri ya da referansı, bölgeyi ve kabaca zamanı yazın. Mevcut randevu notlarına göre stüdyo genellikle beş iş günü içinde e-posta ya da WhatsApp ile döner." },
        { q: "Depozito var mı?", a: "Mevcut sitede depozito 200 euro olarak yazar. Son ücrete sayılır, iade edilmez ve tarihi tutar. Erteleme için 72 saat önce haber isterler." },
        { q: "Tasarım ne zaman hazır?", a: "İş kararlaştırıldıktan sonra tasarım yaklaşık 20 iş günü içinde sunulur. Siz onaylayınca en yakın tarihe randevu yazılır." },
        { q: "Misafir dövme sanatçısı geliyor mu?", a: "Evet. Başka ülkelerden misafir günleri etkinlikler sayfasındadır. Öne çıkanlar ana sayfada da durur." },
        { q: "Marmari dövme festivali ne?", a: "Stüdyo, Marmaris’teki Marmari dövme festivaline katılır. Son duyurulan tarih 3–5 Ekim 2025’tir. Yeni tarih etkinlikler sayfasında güncellenir." },
        { q: "Stüdyo nerede?", a: "Asmalı Mescit Mahallesi, İstiklal Cd. No:164, 34430 Beyoğlu/İstanbul, Türkiye. Harita ve saatler iletişim sayfasındadır." },
      ],
    },
    form: { name: "Ad", email: "E-posta", phone: "Telefon", artist: "Tercih edilen sanatçı", message: "Fikir, bölge ve kabaca zaman", send: "İsteği gönder", sending: "Gönderiliyor…", ok: "İstek alındı. Stüdyo e-posta ya da WhatsApp ile döner.", preference: "Fark etmez", error: "Mesaj gönderilemedi." },
    notFound: { title: "Bu sayfa yok", body: "Sanatçılara, etkinliklere ya da ana sayfaya bakın.", home: "Ana sayfa" },
    seo: {
      homeTitle: "İstanbul dövme stüdyosu",
      homeDescription: "Beyoğlu’nda, İstiklal’de İstanbul dövme stüdyosu. Japon dövmesi, özel tasarım ve misafir sanatçılar.",
      artistsTitle: "Beyoğlu dövme",
      artistsDescription: "Asmalı Mescit’te, İstiklal üzerinde Beyoğlu dövme stüdyosu. Sanatçılar ve portfolyolar.",
      aboutTitle: "İstiklal dövme",
      aboutDescription: "Asmalı Mescit, Beyoğlu, İstiklal’de dövme stüdyosu. Adres, saatler, telefon ve harita.",
      bookTitle: "Dövme randevu Beyoğlu",
      bookDescription: "Beyoğlu’nda dövme randevusu isteyin. Stüdyo e-posta ya da WhatsApp ile döner.",
      stylesTitle: "Japon dövmesi",
      stylesDescription: "İstanbul’da Japon dövmesi: irezumi, yeni traditional ve siyah-gri özel iş.",
      eventsTitle: "Misafir dövme sanatçısı",
      eventsDescription: "İstanbul’da misafir dövme sanatçısı günleri ve Marmari dövme festivali.",
      aftercareTitle: "Bakım",
      aftercareDescription: "Taze dövmenin bakımı ve stüdyoyu ne zaman arayacağınız.",
      faqTitle: "Sorular",
      faqDescription: "Beyoğlu dövme randevusu, depozito, misafir sanatçı ve Marmari dövme festivali.",
    },
  },
  de: {
    nav: { artists: "Künstler", styles: "Stile", events: "Termine", about: "Über uns", faq: "Fragen", book: "Termin", menu: "Menü", close: "Schließen", languages: "Sprachen", kicker: "Irezumi-Studio", skip: "Zum Inhalt" },
    footer: { hours: "Zeiten", reach: "Studio erreichen", note: "Porträts und Blätter auf dieser Seite sind eigene Zeichnungen.", google: "Google Business", portfolio: "Bestehendes Portfolio", aftercare: "Pflege", admin: "Studio-Admin", newTab: "öffnet sich in einem neuen Tab" },
    days: { Monday: "Montag", Tuesday: "Dienstag", Wednesday: "Mittwoch", Thursday: "Donnerstag", Friday: "Freitag", Saturday: "Samstag", Sunday: "Sonntag" },
    closed: "Geschlossen",
    status: { Upcoming: "Kommend", Past: "Vergangen", Now: "Jetzt", featured: "Auf der Startseite" },
    home: {
      heroTitle: "Die besten Tätowierer",
      intro: "Ein Tattoo-Studio in Istanbul, an der Istiklal in Beyoğlu.",
      eventsKicker: "Besondere Termine",
      eventsTitle: "Gäste und Treffen",
      eventsLead: "Gasttätowierer aus anderen Ländern und Tage wie das Marmari Tattoo Festival.",
      allEvents: "Alle Termine",
      artistsKicker: "Die Bank",
      artistsTitle: "Künstler",
      artistsLead: "Wer arbeitet, und welche Stile sie annehmen.",
      allArtists: "Alle Künstler",
      visitTitle: "Schreiben, anrufen oder heraufkommen",
      online: "Auch online",
      listing: "Google-Eintrag öffnen",
      heroAlt: "Ein Tätowierer arbeitet im Studio am Bein eines Kunden",
    },
    artistsPage: { title: "Tattoo-Studio Beyoğlu", lead: "Das Tattoo-Studio in Beyoğlu, über der Istiklal in Asmalı Mescit. Ein Porträt öffnet die Geschichte und die Blätter." },
    artistPage: { work: "Arbeiten", request: "Diesen Künstler anfragen", portfolio: "Bestehendes Portfolio", untranslated: "Dieses Profil ist noch nicht übersetzt." },
    eventsPage: { title: "Gasttätowierer in Istanbul", lead: "Gasttätowierer in Istanbul und das Marmari Tattoo Festival. Die Startseite zeigt nur die hervorgehobenen Daten." },
    eventPage: { request: "Sitzung anfragen", all: "Alle Termine", other: "Weitere Termine", untranslated: "Dieser Termin ist noch nicht übersetzt." },
    about: { title: "Tattoo an der Istiklal", publicName: "Öffentlicher Name", reach: "Erreichen", address: "Adresse", phone: "Telefon", also: "Außerdem genannt", email: "E-Mail", whatsapp: "WhatsApp", hours: "Zeiten", google: "Google-Business-Eintrag öffnen", booking: "Zum Terminformular", portfolio: "Bestehendes Portfolio" },
    book: { title: "Tattoo-Termin in Beyoğlu", lead: "Einen Tattoo-Termin in Beyoğlu anfragen. Idee, Stelle und einen groben Zeitpunkt schicken. Das Studio antwortet per E-Mail oder WhatsApp." },
    styles: {
      title: "Japanisches Tattoo in Istanbul",
      lead: "Japanisches Tattoo in Istanbul steht in der Mitte: Irezumi und New Traditional, dazu schwarz-graue Einzelstücke.",
      more: "Wer in diesen Stilen arbeitet",
      items: [
        { title: "Irezumi", body: "Ärmel und größere Stücke aus Koi, Drache, Pfingstrose, Hannya und Wellen. Das ist die Arbeit, die Vaso Vasiko vorne hält." },
        { title: "New Traditional", body: "Kräftige Kontur und eine knappe Palette, damit das Tattoo nach Jahren noch lesbar ist." },
        { title: "Schwarz-grau", body: "Gewicht, freier Raum und Blackwork, auch am Hals." },
        { title: "Auch in der Geschichte", body: "Geometrisch, farbig, New School und Old School stehen in der öffentlichen Biografie. Vorne bleiben japanisch und New Traditional." },
      ],
    },
    aftercare: {
      title: "Nachsorge",
      intro: "Allgemeine Pflege für ein frisches Tattoo, kein medizinischer Rat. Wenn die Haut heiß ist, streifig wird oder Sie sich krank fühlen, gehen Sie zum Arzt.",
      call: "Bei gewöhnlichen Heilungsfragen rufen Sie das Studio an.",
      sections: [
        { title: "Die ersten Tage", body: "Die Folie so lange lassen, wie besprochen. Mit sauberen Händen und milder, duftfreier Seife waschen. Trockentupfen. Eine dünne Schicht der Salbe auftragen." },
        { title: "Während es sitzt", body: "Nicht einweichen. Kein Schwimmen, keine Wanne, keine Sauna, bis die Oberfläche zu ist. Sonne meiden. Lockere Kleidung. Keine Schuppen abziehen." },
      ],
    },
    faq: {
      title: "Fragen",
      items: [
        { q: "Wie buche ich einen Tattoo-Termin in Beyoğlu?", a: "Schicken Sie eine Idee oder Referenz, die Stelle und einen groben Zeitpunkt. Laut den bestehenden Hinweisen antwortet das Studio meist innerhalb von fünf Werktagen per E-Mail oder WhatsApp." },
        { q: "Gibt es eine Anzahlung?", a: "Auf der bestehenden Seite steht eine Anzahlung von 200 Euro. Sie wird verrechnet, nicht erstattet, und sie hält den Termin. Zum Verschieben werden 72 Stunden Vorlauf gebeten." },
        { q: "Wann ist der Entwurf fertig?", a: "Nach der Zusage kommt der Entwurf in etwa 20 Werktagen. Der Sitz wird gebucht, wenn Sie ihn freigeben." },
        { q: "Kommt ein Gasttätowierer?", a: "Ja. Gasttage aus anderen Ländern stehen auf der Terminseite. Hervorgehobene erscheinen auch auf der Startseite." },
        { q: "Was ist das Marmari Tattoo Festival?", a: "Das Studio nimmt am Marmari Tattoo Festival in Marmaris teil. Die letzte angekündigte Ausgabe war der 3.–5. Oktober 2025. Neue Daten stehen auf der Terminseite." },
        { q: "Wo ist das Studio?", a: "Asmalı Mescit Mahallesi, İstiklal Cd. No:164, 34430 Beyoğlu/İstanbul, Türkiye. Karte und Zeiten sind auf der Kontaktseite." },
      ],
    },
    form: { name: "Name", email: "E-Mail", phone: "Telefon", artist: "Wunschkünstler", message: "Idee, Stelle und grober Zeitpunkt", send: "Anfrage senden", sending: "Wird gesendet…", ok: "Anfrage angekommen. Das Studio antwortet per E-Mail oder WhatsApp.", preference: "Keine Vorgabe", error: "Die Nachricht konnte nicht gesendet werden." },
    notFound: { title: "Diese Seite gibt es nicht", body: "Sehen Sie bei den Künstlern, den Terminen oder auf der Startseite nach.", home: "Zur Startseite" },
    seo: {
      homeTitle: "Tattoo-Studio Istanbul",
      homeDescription: "Tattoo-Studio in Istanbul, an der Istiklal in Beyoğlu. Japanische Arbeit, Einzelstücke und Gasttätowierer.",
      artistsTitle: "Tattoo-Studio Beyoğlu",
      artistsDescription: "Tattoo-Studio in Beyoğlu, an der Istiklal in Asmalı Mescit. Künstler und Mappen.",
      aboutTitle: "Tattoo an der Istiklal",
      aboutDescription: "Tattoo-Studio an der Istiklal in Asmalı Mescit, Beyoğlu. Adresse, Zeiten, Telefon und Karte.",
      bookTitle: "Tattoo-Termin Beyoğlu",
      bookDescription: "Tattoo-Termin in Beyoğlu anfragen. Das Studio antwortet per E-Mail oder WhatsApp.",
      stylesTitle: "Japanisches Tattoo Istanbul",
      stylesDescription: "Japanisches Tattoo in Istanbul: Irezumi, New Traditional und schwarz-graue Einzelstücke.",
      eventsTitle: "Gasttätowierer Istanbul",
      eventsDescription: "Gasttätowierer in Istanbul und das Marmari Tattoo Festival.",
      aftercareTitle: "Nachsorge",
      aftercareDescription: "Pflege eines frischen Tattoos und wann Sie das Studio anrufen.",
      faqTitle: "Fragen",
      faqDescription: "Tattoo-Termin in Beyoğlu, Anzahlung, Gasttätowierer und das Marmari Tattoo Festival.",
    },
  },
  ru: {
    nav: { artists: "Мастера", styles: "Стили", events: "События", about: "О студии", faq: "Вопросы", book: "Запись", menu: "Меню", close: "Закрыть", languages: "Языки", kicker: "Студия ирэдзуми", skip: "К содержанию" },
    footer: { hours: "Часы", reach: "Связаться", note: "Портреты и листы на этом сайте — собственные рисунки.", google: "Google Business", portfolio: "Существующее портфолио", aftercare: "Уход", admin: "Админка", newTab: "откроется в новой вкладке" },
    days: { Monday: "Понедельник", Tuesday: "Вторник", Wednesday: "Среда", Thursday: "Четверг", Friday: "Пятница", Saturday: "Суббота", Sunday: "Воскресенье" },
    closed: "Закрыто",
    status: { Upcoming: "Скоро", Past: "Прошло", Now: "Сейчас", featured: "На главной" },
    home: {
      heroTitle: "Лучшие тату-мастера",
      intro: "Тату-студия в Стамбуле, на улице Истикляль в Бейоглу.",
      eventsKicker: "Особые даты",
      eventsTitle: "Гости и встречи",
      eventsLead: "Приглашённые мастера из других стран и дни вроде фестиваля Marmari.",
      allEvents: "Все события",
      artistsKicker: "Мастера",
      artistsTitle: "Кто работает",
      artistsLead: "Кто за станком и какие стили берёт.",
      allArtists: "Все мастера",
      visitTitle: "Напишите, позвоните или поднимитесь",
      online: "Ещё онлайн",
      listing: "Открыть карточку в Google",
      heroAlt: "Тату-мастер делает татуировку на ноге клиента в студии",
    },
    artistsPage: { title: "Тату в Бейоглу", lead: "Тату-студия в Бейоглу, над Истикляль в Асмалы Месджит. Портрет открывает историю и листы." },
    artistPage: { work: "Работы", request: "Запросить этого мастера", portfolio: "Существующее портфолио", untranslated: "Этот профиль ещё не переведён." },
    eventsPage: { title: "Приглашённый тату-мастер в Стамбуле", lead: "Приглашённые тату-мастера в Стамбуле и фестиваль Marmari. На главной только отмеченные даты." },
    eventPage: { request: "Запросить сеанс", all: "Все события", other: "Другие события", untranslated: "Это событие ещё не переведено." },
    about: { title: "Тату на Истикляль", publicName: "Публичное имя", reach: "Связь", address: "Адрес", phone: "Телефон", also: "Также указан", email: "Почта", whatsapp: "WhatsApp", hours: "Часы", google: "Открыть карточку Google Business", booking: "Открыть форму записи", portfolio: "Существующее портфолио" },
    book: { title: "Запись на тату в Бейоглу", lead: "Запись на тату в Бейоглу. Напишите идею, место и примерное время. Студия отвечает почтой или в WhatsApp." },
    styles: {
      title: "Японская татуировка в Стамбуле",
      lead: "В центре студии японская татуировка в Стамбуле: ирэдзуми и нью-традишнл, рядом чёрно-серые заказные вещи.",
      more: "Кто работает в этих стилях",
      items: [
        { title: "Ирэдзуми", body: "Рукава и крупные композиции из кои, дракона, пиона, хання и волн. Это работа, которую Васо Васико держит впереди." },
        { title: "Нью-традишнл", body: "Плотный контур и узкая палитра, чтобы тату читалось и годы спустя." },
        { title: "Чёрно-серое", body: "Вес, пустое место и блэкворк, в том числе на шее." },
        { title: "Ещё в биографии", body: "Геометрия, цвет, нью-скул и олд-скул есть в публичной биографии. Впереди остаются японский стиль и нью-традишнл." },
      ],
    },
    aftercare: {
      title: "Уход",
      intro: "Общий уход за свежей татуировкой, не медицинский совет. Если кожа горячая, идёт полосой или вам плохо, обратитесь к врачу.",
      call: "По обычным вопросам заживления звоните в студию.",
      sections: [
        { title: "Первые дни", body: "Оставьте плёнку на сказанный срок. Мойте чистыми руками и мягким мылом без отдушки. Промокните. Тонкий слой выданной мази." },
        { title: "Пока садится", body: "Не мочите. Без бассейна, ванны и сауны, пока поверхность не закрылась. Берегите от солнца. Свободная одежда. Не сдирайте шелушение." },
      ],
    },
    faq: {
      title: "Вопросы",
      items: [
        { q: "Как записаться на тату в Бейоглу?", a: "В форме напишите идею или референс, место и примерное время. По заметкам на существующем сайте студия отвечает почтой или в WhatsApp, обычно в течение пяти рабочих дней." },
        { q: "Есть задаток?", a: "На существующем сайте задаток 200 евро. Он идёт в стоимость, не возвращается и держит дату. О переносе просят сообщить за 72 часа." },
        { q: "Когда готов эскиз?", a: "После договорённости эскиз показывают примерно за 20 рабочих дней. Сеанс ставят, когда вы его принимаете." },
        { q: "Бывает приглашённый мастер?", a: "Да. Гостевые дни из других стран есть на странице событий. Отмеченные видны и на главной." },
        { q: "Что за фестиваль Marmari?", a: "Студия участвует в фестивале Marmari в Мармарисе. Последние объявленные даты — 3–5 октября 2025. Новые даты обновляют на странице событий." },
        { q: "Где студия?", a: "Asmalı Mescit Mahallesi, İstiklal Cd. No:164, 34430 Beyoğlu/İstanbul, Türkiye. Карта и часы — на странице контактов." },
      ],
    },
    form: { name: "Имя", email: "Почта", phone: "Телефон", artist: "Мастер", message: "Идея, место и примерное время", send: "Отправить запрос", sending: "Отправка…", ok: "Запрос получен. Студия ответит почтой или в WhatsApp.", preference: "Без предпочтения", error: "Сообщение не отправилось." },
    notFound: { title: "Такой страницы нет", body: "Загляните к мастерам, в события или на главную.", home: "На главную" },
    seo: {
      homeTitle: "Тату-студия Стамбул",
      homeDescription: "Тату-студия в Стамбуле, на Истикляль в Бейоглу. Японская работа, заказные вещи и приглашённые мастера.",
      artistsTitle: "Тату Бейоглу",
      artistsDescription: "Тату-студия в Бейоглу, на Истикляль в Асмалы Месджит. Мастера и портфолио.",
      aboutTitle: "Тату на Истикляль",
      aboutDescription: "Тату-студия на Истикляль в Асмалы Месджит, Бейоглу. Адрес, часы, телефон и карта.",
      bookTitle: "Запись на тату Бейоглу",
      bookDescription: "Запись на тату в Бейоглу. Студия отвечает почтой или в WhatsApp.",
      stylesTitle: "Японская татуировка Стамбул",
      stylesDescription: "Японская татуировка в Стамбуле: ирэдзуми, нью-традишнл и чёрно-серые заказные вещи.",
      eventsTitle: "Приглашённый тату-мастер Стамбул",
      eventsDescription: "Приглашённые тату-мастера в Стамбуле и фестиваль Marmari.",
      aftercareTitle: "Уход",
      aftercareDescription: "Как ухаживать за свежей татуировкой и когда звонить в студию.",
      faqTitle: "Вопросы",
      faqDescription: "Запись на тату в Бейоглу, задаток, приглашённый мастер и фестиваль Marmari.",
    },
  },
};
