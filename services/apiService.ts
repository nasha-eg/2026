
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
    const items = database.get<Product[]>(DB_KEYS.PRODUCTS);
    const index = items.findIndex(p => p.id === product.id);
    if (index > -1) items[index] = product;
    else items.push(product);
    database.save(DB_KEYS.PRODUCTS, items);
    return { success: true };
  },
  async deleteProduct(id: string) {
    const items = database.get<Product[]>(DB_KEYS.PRODUCTS).filter(p => p.id !== id);
    database.save(DB_KEYS.PRODUCTS, items);
    return { success: true };
  },

  // Articles
  async getArticles(): Promise<Article[]> {
    return database.get<Article[]>(DB_KEYS.ARTICLES);
  },
  async saveArticle(article: Article) {
    const items = database.get<Article[]>(DB_KEYS.ARTICLES);
    const index = items.findIndex(a => a.id === article.id);
    if (index > -1) items[index] = article;
    else items.push(article);
    database.save(DB_KEYS.ARTICLES, items);
    return { success: true };
  },
  async deleteArticle(id: string) {
    const items = database.get<Article[]>(DB_KEYS.ARTICLES).filter(a => a.id !== id);
    database.save(DB_KEYS.ARTICLES, items);
    return { success: true };
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    return database.get<GalleryItem[]>(DB_KEYS.GALLERY);
  },
  async saveGalleryItem(item: GalleryItem) {
    const items = database.get<GalleryItem[]>(DB_KEYS.GALLERY);
    const index = items.findIndex(i => i.id === item.id);
    if (index > -1) items[index] = item;
    else items.push(item);
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
    const index = items.findIndex(r => r.id === review.id);
    if (index > -1) items[index] = review;
    else items.push(review);
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
    const cfg = database.get<SiteConfig>(DB_KEYS.SETTINGS);
    return cfg || {} as SiteConfig;
  },
  async saveSettings(config: SiteConfig) {
    database.save(DB_KEYS.SETTINGS, config);
    return { success: true };
  }
};
