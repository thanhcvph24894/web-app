import {request, authRequest} from './api-client';

export interface Product {
  id: string;
  _id?: string;
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
    let url = 'products';
    const queryParams: string[] = [];

    if (params?.page) {
      queryParams.push(`page=${params.page}`);
    }
    if (params?.limit) {
      queryParams.push(`limit=${params.limit}`);
    }
    if (params?.category) {
      queryParams.push(`category=${params.category}`);
    }

    if (queryParams.length > 0) {
      url = `${url}?${queryParams.join('&')}`;
    }

    return request<ProductListResponse>(url);
  },

  getProductDetail: (slug: string) => {
    return request<Product>(`products/${slug}`);
  },

  getFeaturedProducts: () => {
    return request<Product[]>('products/featured');
  },

  searchProducts: (keyword: string, params?: ProductListParams) => {
    let url = 'products/search';
    const queryParams: string[] = [`keyword=${keyword}`];

    if (params?.page) {
      queryParams.push(`page=${params.page}`);
    }
    if (params?.limit) {
      queryParams.push(`limit=${params.limit}`);
    }
    if (params?.category) {
      queryParams.push(`category=${params.category}`);
    }

    url = `${url}?${queryParams.join('&')}`;

    return request<ProductListResponse>(url);
  },
};

export default productService;
