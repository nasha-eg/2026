
import { Product, Article, Review, SiteConfig, GalleryItem } from '../types';

const API_BASE = '/api';

export const apiService = {
  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    return res.json();
  },
  async saveProduct(product: Product) {
    const items = await this.getProducts();
    const index = items.findIndex(p => p.id === product.id);
    if (index > -1) items[index] = product;
    else items.push(product);
    await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return { success: true };
  },
  async deleteProduct(id: string) {
    const items = (await this.getProducts()).filter(p => p.id !== id);
    await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return { success: true };
  },

  // Articles
  async getArticles(): Promise<Article[]> {
    const res = await fetch(`${API_BASE}/articles`);
    return res.json();
  },
  async saveArticle(article: Article) {
    const items = await this.getArticles();
    const index = items.findIndex(a => a.id === article.id);
    if (index > -1) items[index] = article;
    else items.push(article);
    await fetch(`${API_BASE}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return { success: true };
  },
  async deleteArticle(id: string) {
    const items = (await this.getArticles()).filter(a => a.id !== id);
    await fetch(`${API_BASE}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return { success: true };
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    const res = await fetch(`${API_BASE}/gallery`);
    return res.json();
  },
  async saveGalleryItem(item: GalleryItem) {
    const items = await this.getGallery();
    const index = items.findIndex(i => i.id === item.id);
    if (index > -1) items[index] = item;
    else items.push(item);
    await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return { success: true };
  },
  async deleteGalleryItem(id: string) {
    const items = (await this.getGallery()).filter(i => i.id !== id);
    await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return { success: true };
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/reviews`);
    return res.json();
  },
  async saveReview(review: Review) {
    const items = await this.getReviews();
    const index = items.findIndex(r => r.id === review.id);
    if (index > -1) items[index] = review;
    else items.push(review);
    await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return { success: true };
  },
  async deleteReview(id: string) {
    const items = (await this.getReviews()).filter(r => r.id !== id);
    await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return { success: true };
  },

  // Inquiries
  async getInquiries() {
    const res = await fetch(`${API_BASE}/inquiries`);
    return res.json();
  },
  async deleteInquiry(id: string) {
    const items = (await this.getInquiries()).filter((i: any) => i.id !== id);
    await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return { success: true };
  },
  async sendInquiry(inquiry: any) {
    const items = await this.getInquiries();
    items.unshift(inquiry);
    await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return { success: true };
  },

  // Settings
  async getSettings(): Promise<SiteConfig> {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },
  async saveSettings(config: SiteConfig) {
    await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return { success: true };
  }
};
