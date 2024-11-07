//Интерфейс карточки товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

//Интерфейсы форм
export interface IOrderForm {
    payment: string;
    email: string;
    phone: string;
    address: string;  
}

export interface IOrder extends IOrderForm{
    total: number;
    items: string[];
}


export interface IOrderResult {
    id: string;
    total: number;  
}

//Интерфейс API-клиента
export interface IAppState {
    catalog: IProduct[];
    preview: string | null;
    order: IOrder | null;
}

//Ошибки валидации
export type FormErrors = Partial<Record<keyof IOrder, string>>

//Типы оплаты
export type PaymentMethod = 'cash' | 'card' | '';

export type CategoryPayment = {
  [Key in PaymentMethod]: string;
};
