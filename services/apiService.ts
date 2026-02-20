
import { Product, Article, Review, SiteConfig, GalleryItem } from '../types';

const API_BASE = '/api'; // Change to '/php-api/api.php?action=' when using PHP
const IS_PHP = false; // Set to true when moving to PHP hosting

const getUrl = (key: string) => IS_PHP ? `/php-api/api.php?action=${key}` : `${API_BASE}/${key}`;

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error: ${res.status} - ${text}`);
  }
  return res.json();
};

export const apiService = {
  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch(getUrl('products'));
    return handleResponse(res);
  },
  async saveProduct(product: Product) {
    const items = await apiService.getProducts();
    const index = items.findIndex(p => p.id === product.id);
    if (index > -1) items[index] = product;
    else items.push(product);
    const res = await fetch(getUrl('products'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return handleResponse(res);
  },
  async deleteProduct(id: string) {
    const items = (await apiService.getProducts()).filter(p => p.id !== id);
    const res = await fetch(getUrl('products'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return handleResponse(res);
  },

  // Articles
  async getArticles(): Promise<Article[]> {
    const res = await fetch(getUrl('articles'));
    return handleResponse(res);
  },
  async saveArticle(article: Article) {
    const items = await apiService.getArticles();
    const index = items.findIndex(a => a.id === article.id);
    if (index > -1) items[index] = article;
    else items.push(article);
    const res = await fetch(getUrl('articles'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return handleResponse(res);
  },
  async deleteArticle(id: string) {
    const items = (await apiService.getArticles()).filter(a => a.id !== id);
    const res = await fetch(getUrl('articles'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return handleResponse(res);
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    const res = await fetch(getUrl('gallery'));
    return handleResponse(res);
  },
  async saveGalleryItem(item: GalleryItem) {
    const items = await apiService.getGallery();
    const index = items.findIndex(i => i.id === item.id);
    if (index > -1) items[index] = item;
    else items.push(item);
    const res = await fetch(getUrl('gallery'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return handleResponse(res);
  },
  async deleteGalleryItem(id: string) {
    const items = (await apiService.getGallery()).filter(i => i.id !== id);
    const res = await fetch(getUrl('gallery'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return handleResponse(res);
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    const res = await fetch(getUrl('reviews'));
    return handleResponse(res);
  },
  async saveReview(review: Review) {
    const items = await apiService.getReviews();
    const index = items.findIndex(r => r.id === review.id);
    if (index > -1) items[index] = review;
    else items.push(review);
    const res = await fetch(getUrl('reviews'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return handleResponse(res);
  },
  async deleteReview(id: string) {
    const items = (await apiService.getReviews()).filter(r => r.id !== id);
    const res = await fetch(getUrl('reviews'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return handleResponse(res);
  },

  // Inquiries
  async getInquiries() {
    const res = await fetch(getUrl('inquiries'));
    return handleResponse(res);
  },
  async deleteInquiry(id: string) {
    const items = (await apiService.getInquiries()).filter((i: any) => i.id !== id);
    const res = await fetch(getUrl('inquiries'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return handleResponse(res);
  },
  async sendInquiry(inquiry: any) {
    const items = await apiService.getInquiries();
    items.unshift(inquiry);
    const res = await fetch(getUrl('inquiries'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return handleResponse(res);
  },

  // Settings
  async getSettings(): Promise<SiteConfig> {
    const res = await fetch(getUrl('settings'));
    return handleResponse(res);
  },
  async saveSettings(config: SiteConfig) {
    const res = await fetch(getUrl('settings'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return handleResponse(res);
  }
};
