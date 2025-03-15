export type Product = {
    id: number;
    name: string;
    price: string;
    image: string;
    rating?: number;
    reviews?: number;
    description?: string;
};

export type CartItem = Product & {
    quantity: number;
    selectedSize: string;
};

export type RootTabParamList = {
    HomeTab: undefined;
    CartTab: undefined;
    ProfileTab: undefined;
};

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Main: { screen?: keyof RootTabParamList };
    ProductDetail: { product: Product };
    Cart: undefined;
    Checkout: { cartItems: CartItem[] };
    EditProfile: undefined;
}; 