export type Language = 'ka' | 'en' | 'ru';

export type Currency = 'GEL' | 'USD' | 'EUR';

export type TrilingualText = {
  ka: string;
  en: string;
  ru: string;
};

export type TrilingualList = {
  ka: string[];
  en: string[];
  ru: string[];
};

/**
 * A single catalog system (what used to be split across two disconnected
 * models - ProductSystem with rich-but-empty fields, and the simpler
 * ListingItem that actually held real content). This is the one source of
 * truth now: the catalog cards, the description modal, the cost
 * calculator, and the footer links all read from this same array.
 */
export interface SystemListing {
  id: string;
  slug: string;
  slotNumber: number;
  category: 'sliding' | 'pergola' | 'guillotine' | 'glazing' | 'shading' | 'screen' | 'facade';
  name: TrilingualText;
  tagline: TrilingualText;
  /** Long-form description. Paragraphs separated by blank lines; a line
   * starting with a features/benefits heading keyword (in any of the three
   * languages) is rendered as a section header - see FormattedDescription. */
  description: TrilingualText;
  image: string;
  gallery?: string[];
  specs: {
    profileWidth: string;
    thermalInsulation: string;
    soundInsulation: string;
    maxGlassThickness: string;
    maxPanelWeight: string;
    maxPanelHeight: string;
    waterTightness: string;
    windLoadResistance: string;
    airPermeability: string;
  };
  profilePartners: string[];
  automationOptions: TrilingualList;
  idealFor: TrilingualList;
  /**
   * Indicative starting rate per m2, used by the cost calculator.
   * These are realistic placeholder figures based on typical market
   * positioning for each system type, NOT verified Panorama price-list
   * numbers - see the comment above CATALOG in data/catalog.ts.
   */
  startingPricePerM2: {
    GEL: number;
    USD: number;
    EUR: number;
  };
}

export interface ProjectItem {
  id: string;
  title: TrilingualText;
  location: TrilingualText;
  city: 'Tbilisi' | 'Batumi' | 'Kakheti' | 'Bakuriani' | 'Gudauri' | 'Mtskheta';
  category: 'villa' | 'commercial' | 'penthouse' | 'residence';
  year: number;
  area: string;
  image: string;
  beforeAfterImage?: {
    before: string;
    after: string;
  };
  systemsUsed: string[];
  description: TrilingualText;
  architect?: string;
  highlightSpecs: TrilingualList;
}

export interface FAQItem {
  question: TrilingualText;
  answer: TrilingualText;
  category: 'engineering' | 'pricing' | 'timeline' | 'warranty';
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  role: TrilingualText;
  projectTitle: TrilingualText;
  location: string;
  quote: TrilingualText;
  avatar?: string;
  rating: number;
}

export interface ShowroomLocation {
  id: string;
  city: TrilingualText;
  name: TrilingualText;
  address: TrilingualText;
  phone: string;
  email: string;
  hours: TrilingualText;
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string;
  isMainShowroom?: boolean;
}

export interface TikTokVideoItem {
  id: number;
  thumbnail: string;
  url: string;
  title: TrilingualText;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  city: string;
  message: string;
  width?: number;
  height?: number;
  preferredContact: 'phone' | 'whatsapp' | 'email' | 'showroom';
  language: Language;
}

export interface InquiryResponse {
  success: boolean;
  referenceNumber?: string;
  message?: string;
  error?: string;
  details?: {
    referenceNumber: string;
    name: string;
    phone: string;
    serviceType: string;
    city: string;
    estimatedResponseTime: string;
    hotline: string;
    whatsapp: string;
    showroomAddress: string;
  };
}

/** Carries context from "Calculate cost" / "Request this project" / "Book a
 * visit" actions elsewhere on the page into the contact form, so the quote
 * request already has the visitor's system, dimensions and estimate on it
 * instead of landing as a blank form. */
export interface QuoteIntent {
  serviceType?: string;
  city?: string;
  message?: string;
  preferredContact?: ContactFormData['preferredContact'];
  width?: number;
  height?: number;
}
