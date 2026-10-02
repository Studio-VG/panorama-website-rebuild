export type HoursEntry = {
  day: string;
  hours: string;
};

export type Settings = {
  name: string;
  tagline: string;
  heroLead: string;
  officialName: string;
  officialNameNote: string;
  phone: string;
  phoneAlt: string;
  email: string;
  address: string;
  hours: HoursEntry[];
  latitude: number;
  longitude: number;
  googleBusinessUrl: string;
  portfolioUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappUrl: string;
  websiteUrl: string;
  logoUrl: string;
  about: string;
};

export type PortfolioImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

export type Artist = {
  id: string;
  slug: string;
  name: string;
  styles: string[];
  blurb: string;
  history: string;
  photo: string;
  photoAlt: string;
  portfolio: PortfolioImage[];
};

export type StudioEvent = {
  id: string;
  slug: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  guest: string;
  country: string;
  image: string;
  imageAlt: string;
  featured: boolean;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  artist: string;
  message: string;
  createdAt: string;
};

export type Store = {
  settings: Settings;
  artists: Artist[];
  events: StudioEvent[];
  inquiries: Inquiry[];
};
