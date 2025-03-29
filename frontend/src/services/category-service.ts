import { request } from './api-client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
}

const categoryService = {
  getCategories: () => {
    return request<Category[]>('categories');
  },
  
  getCategoryDetail: (slug: string) => {
    return request<Category>(`categories/${slug}`);
  },
  
  getCategoryProducts: (categorySlug: string, page: number = 1, limit: number = 10) => {
    const url = `products?category=${categorySlug}&page=${page}&limit=${limit}`;
    return request(url);
  }
};

export default categoryService; 