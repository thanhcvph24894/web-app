import {request, authRequest} from './api-client';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  averageRating: number;
  specifications?: Array<{
    name: string;
    value: string;
  }>;
  stock?: number;
  sold?: number;
  tags?: string[];
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
}

const productService = {
  getProducts: (params?: ProductListParams) => {
    const url = new URL('products', 'http://dummy.url');
    if (params?.page) url.searchParams.append('page', params.page.toString());
    if (params?.limit)
      url.searchParams.append('limit', params.limit.toString());
    if (params?.category) url.searchParams.append('category', params.category);

    return request<ProductListResponse>(url.pathname + url.search);
  },

  getProductDetail: (slug: string) => {
    return request<Product>(`products/${slug}`);
  },

  getFeaturedProducts: () => {
    return request<Product[]>('products/featured');
  },

  searchProducts: (keyword: string, params?: ProductListParams) => {
    const url = new URL('products/search', 'http://dummy.url');
    url.searchParams.append('keyword', keyword);
    if (params?.page) url.searchParams.append('page', params.page.toString());
    if (params?.limit)
      url.searchParams.append('limit', params.limit.toString());
    if (params?.category) url.searchParams.append('category', params.category);

    return request<ProductListResponse>(url.pathname + url.search);
  },
};

export default productService;
