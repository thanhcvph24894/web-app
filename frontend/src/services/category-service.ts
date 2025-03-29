import { request } from './api-client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
  productCount?: number;
}

export interface CategoryWithProducts {
  category: Category;
  products: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const categoryService = {
  getCategories: () => {
    return request<Category[]>('categories');
  },
  
  getCategoriesWithProducts: () => {
    return request<Category[]>('categories/with-products');
  },
  
  getCategoryDetail: (slug: string) => {
    return request<Category>(`categories/${slug}`);
  },
  
  getCategoryWithProducts: (slug: string, page: number = 1, limit: number = 10) => {
    return request<CategoryWithProducts>(`categories/${slug}?page=${page}&limit=${limit}`);
  },
  
  getCategoryProducts: (categorySlug: string, page: number = 1, limit: number = 10) => {
    const url = `products?category=${categorySlug}&page=${page}&limit=${limit}`;
    return request(url);
  }
};

export default categoryService; 