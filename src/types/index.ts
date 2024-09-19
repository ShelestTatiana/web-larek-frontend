//карточка товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: TCategory;
    price: number | null;
}

//заказ
export interface IOrder {
    payment: TPaymentMethod;
    email: string;
    address: string;
    phone: string;
    items: string[];
    checkValidation(data: Record<keyof TClientOrder, string>): boolean;
}

//массив товаров и методы работы с ним
export interface IProductsData {
    products: IProduct[];
    preview: string | null;
    getProducts(): IProduct[]; 
    getProduct(id: string): IProduct; 
    setProduct(product: IProduct[]): void; 
    savePreview(product: IProduct): void; 
    saveProduct(product: IProduct): void; 
}

//тип оплаты
export type TPaymentMethod = 'card' | 'cash';

//категория товара
export type TCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

//данные клиента при заказе
export type TClientOrder = Pick<IOrder, 'payment' | 'address' | 'phone' | 'email'>;

//товары в корзине 
export type TCartProduct = Pick<IProduct, 'id' | 'title' | 'price'>;

