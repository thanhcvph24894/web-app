export type Product = {
  id: number;
  name: string;
  price: string;
  image: string;
  rating?: number;
  reviews?: number;
  description?: string;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  ProductDetail: { product: Product };
}; 