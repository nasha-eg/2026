
export type Language = 'ar' | 'en';

export interface Product {
  id: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  images: string[];
  category: string;
  price?: string;
}

export interface Article {
  id: string;
  title: { ar: string; en: string };
  content: { ar: string; en: string };
  image: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: { ar: string; en: string };
  category: 'products' | 'factory' | 'process';
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: { ar: string; en: string };
  avatar: string;
}

export interface SiteConfig {
  phone: string;
  whatsapp: string;
  logo: string;
  address: { ar: string; en: string };
  heroTitle: { ar: string; en: string };
  heroSub: { ar: string; en: string };
  heroImage: string;
}
