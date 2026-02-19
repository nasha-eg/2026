
import { Product, Article, Review, SiteConfig, GalleryItem } from '../types';
import { database } from './database';

const DB_KEYS = {
  PRODUCTS: 'capital_charcoal_products',
  ARTICLES: 'capital_charcoal_articles',
  GALLERY: 'capital_charcoal_gallery',
  REVIEWS: 'capital_charcoal_reviews',
  INQUIRIES: 'capital_charcoal_inquiries',
  SETTINGS: 'capital_charcoal_settings'
};

export const apiService = {
  // Products
  async getProducts(): Promise<Product[]> {
    return database.get<Product[]>(DB_KEYS.PRODUCTS);
  },
  async saveProduct(product: Product) {
    database.saveProduct(product);
    return { success: true };
  },
  async deleteProduct(id: string) {
    database.deleteProduct(id);
    return { success: true };
  },

  // Articles
  async getArticles(): Promise<Article[]> {
    return database.get<Article[]>(DB_KEYS.ARTICLES);
  },
  async saveArticle(article: Article) {
    database.saveArticle(article);
    return { success: true };
  },
  async deleteArticle(id: string) {
    database.deleteArticle(id);
    return { success: true };
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    return database.get<GalleryItem[]>(DB_KEYS.GALLERY);
  },
  async saveGalleryItem(item: GalleryItem) {
    const items = database.get<GalleryItem[]>(DB_KEYS.GALLERY);
    items.push(item);
    database.save(DB_KEYS.GALLERY, items);
    return { success: true };
  },
  async deleteGalleryItem(id: string) {
    const items = database.get<GalleryItem[]>(DB_KEYS.GALLERY).filter(i => i.id !== id);
    database.save(DB_KEYS.GALLERY, items);
    return { success: true };
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    return database.get<Review[]>(DB_KEYS.REVIEWS);
  },
  async saveReview(review: Review) {
    const items = database.get<Review[]>(DB_KEYS.REVIEWS);
    items.push(review);
    database.save(DB_KEYS.REVIEWS, items);
    return { success: true };
  },
  async deleteReview(id: string) {
    const items = database.get<Review[]>(DB_KEYS.REVIEWS).filter(r => r.id !== id);
    database.save(DB_KEYS.REVIEWS, items);
    return { success: true };
  },

  // Inquiries
  async getInquiries() {
    return database.get<any[]>(DB_KEYS.INQUIRIES);
  },
  async deleteInquiry(id: string) {
    const items = database.get<any[]>(DB_KEYS.INQUIRIES).filter(i => i.id !== id);
    database.save(DB_KEYS.INQUIRIES, items);
    return { success: true };
  },
  async sendInquiry(inquiry: any) {
    const items = database.get<any[]>(DB_KEYS.INQUIRIES);
    items.unshift(inquiry);
    database.save(DB_KEYS.INQUIRIES, items);
    return { success: true };
  },

  // Settings
  async getSettings(): Promise<SiteConfig> {
    return database.get<SiteConfig>(DB_KEYS.SETTINGS);
  },
  async saveSettings(config: SiteConfig) {
    database.save(DB_KEYS.SETTINGS, config);
    return { success: true };
  }
};
