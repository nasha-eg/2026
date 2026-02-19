
import { Product, Article, Review, SiteConfig, GalleryItem } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ARTICLES, INITIAL_REVIEWS, INITIAL_CONFIG } from '../constants';

const DB_KEYS = {
  PRODUCTS: 'capital_charcoal_products',
  ARTICLES: 'capital_charcoal_articles',
  GALLERY: 'capital_charcoal_gallery',
  REVIEWS: 'capital_charcoal_reviews',
  INQUIRIES: 'capital_charcoal_inquiries',
  SETTINGS: 'capital_charcoal_settings'
};

export const database = {
  // Initialize with constants if empty
  init() {
    if (!localStorage.getItem(DB_KEYS.PRODUCTS)) localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    if (!localStorage.getItem(DB_KEYS.ARTICLES)) localStorage.setItem(DB_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
    if (!localStorage.getItem(DB_KEYS.REVIEWS)) localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    if (!localStorage.getItem(DB_KEYS.SETTINGS)) localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(INITIAL_CONFIG));
    if (!localStorage.getItem(DB_KEYS.GALLERY)) localStorage.setItem(DB_KEYS.GALLERY, JSON.stringify([]));
    if (!localStorage.getItem(DB_KEYS.INQUIRIES)) localStorage.setItem(DB_KEYS.INQUIRIES, JSON.stringify([]));
  },

  get<T>(key: string): T {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [] as any;
  },

  save<T>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // Helper for products
  saveProduct(product: Product) {
    // Use database.get to resolve "Untyped function calls may not accept type arguments"
    const products = database.get<Product[]>(DB_KEYS.PRODUCTS);
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) products[index] = product;
    else products.push(product);
    database.save(DB_KEYS.PRODUCTS, products);
  },

  deleteProduct(id: string) {
    // Use database.get to resolve "Untyped function calls may not accept type arguments"
    const products = database.get<Product[]>(DB_KEYS.PRODUCTS).filter(p => p.id !== id);
    database.save(DB_KEYS.PRODUCTS, products);
  },

  // Helper for articles
  saveArticle(article: Article) {
    // Use database.get to resolve "Untyped function calls may not accept type arguments"
    const articles = database.get<Article[]>(DB_KEYS.ARTICLES);
    const index = articles.findIndex(a => a.id === article.id);
    if (index > -1) articles[index] = article;
    else articles.push(article);
    database.save(DB_KEYS.ARTICLES, articles);
  },

  deleteArticle(id: string) {
    // Use database.get to resolve "Untyped function calls may not accept type arguments"
    const articles = database.get<Article[]>(DB_KEYS.ARTICLES).filter(a => a.id !== id);
    database.save(DB_KEYS.ARTICLES, articles);
  }
};

// Auto-run init
database.init();
