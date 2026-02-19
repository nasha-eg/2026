
import { Product, Article, Review, SiteConfig, GalleryItem } from '../types';

const API_BASE_URL = '/api'; 

const safeFetchJson = async (url: string, options?: RequestInit) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    return null;
  } catch (e) {
    console.error(`API Error at ${url}:`, e);
    return null;
  }
};

export const apiService = {
  // Products
  async getProducts(): Promise<Product[] | null> {
    return safeFetchJson(`${API_BASE_URL}/products.php`);
  },
  async saveProduct(product: Product) {
    return fetch(`${API_BASE_URL}/products.php`, {
      method: 'POST',
      body: JSON.stringify(product),
      headers: { 'Content-Type': 'application/json' }
    });
  },
  async deleteProduct(id: string) {
    return fetch(`${API_BASE_URL}/products.php?id=${id}`, { method: 'DELETE' });
  },

  // Articles
  async getArticles(): Promise<Article[] | null> {
    return safeFetchJson(`${API_BASE_URL}/articles.php`);
  },
  async saveArticle(article: Article) {
    return fetch(`${API_BASE_URL}/articles.php`, {
      method: 'POST',
      body: JSON.stringify(article),
      headers: { 'Content-Type': 'application/json' }
    });
  },
  async deleteArticle(id: string) {
    return fetch(`${API_BASE_URL}/articles.php?id=${id}`, { method: 'DELETE' });
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[] | null> {
    return safeFetchJson(`${API_BASE_URL}/gallery.php`);
  },
  async saveGalleryItem(item: GalleryItem) {
    return fetch(`${API_BASE_URL}/gallery.php`, {
      method: 'POST',
      body: JSON.stringify(item),
      headers: { 'Content-Type': 'application/json' }
    });
  },
  async deleteGalleryItem(id: string) {
    return fetch(`${API_BASE_URL}/gallery.php?id=${id}`, { method: 'DELETE' });
  },

  // Reviews
  async getReviews(): Promise<Review[] | null> {
    return safeFetchJson(`${API_BASE_URL}/reviews.php`);
  },
  async saveReview(review: Review) {
    return fetch(`${API_BASE_URL}/reviews.php`, {
      method: 'POST',
      body: JSON.stringify(review),
      headers: { 'Content-Type': 'application/json' }
    });
  },
  async deleteReview(id: string) {
    return fetch(`${API_BASE_URL}/reviews.php?id=${id}`, { method: 'DELETE' });
  },

  // Inquiries
  async getInquiries() {
    return safeFetchJson(`${API_BASE_URL}/inquiries.php`);
  },
  async deleteInquiry(id: string) {
    return fetch(`${API_BASE_URL}/inquiries.php?id=${id}`, { method: 'DELETE' });
  },
  async sendInquiry(inquiry: any) {
    return fetch(`${API_BASE_URL}/inquiries.php`, {
      method: 'POST',
      body: JSON.stringify(inquiry),
      headers: { 'Content-Type': 'application/json' }
    });
  },

  // Settings
  async getSettings(): Promise<SiteConfig | null> {
    return safeFetchJson(`${API_BASE_URL}/settings.php`);
  },
  async saveSettings(config: SiteConfig) {
    return fetch(`${API_BASE_URL}/settings.php`, {
      method: 'POST',
      body: JSON.stringify(config),
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
