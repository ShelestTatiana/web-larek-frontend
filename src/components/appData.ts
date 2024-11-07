import { IAppState, IOrder, IProduct, FormErrors, IOrderForm } from "../types";
import { Model } from "./base/model";

//начальное состояние заказа
export const orderStart: IOrder = {
    address: '',
    email: '',
    phone: '',
    payment: '',
    items: [],
    total: 0
}

//класс состояния приложения наследуется от класса Model и использует интерфейс IAppState
export class AppState extends Model<IAppState> {
    catalog: IProduct[];
    order: IOrder = Object.assign({}, orderStart)
    preview: string | null;
    formErrors: FormErrors = {};

    //каталог
    setCatalog(items: IProduct[]) {
        this.catalog = items;
        this.emitChanges('items: changed', {catalog: this.catalog});
    }

    //предпросмотр и уведомление об изменениях
    setPreview(item: IProduct) {
        this.preview = item.id;
        this.emitChanges('preview: changed', item);
    }

    //значения полей заказа, вызов валидации
    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        
        if(this.validateOrder()) {
            this.events.emit('order: ready', this.order);
        }
    }

    //товары добавленные в корзину
    getOrderProducts() {
        return this.catalog.filter((item) => this.order.items.includes(item.id));
    }

    //общая сумма заказа
    getTotal() {
        return this.order.items.reduce((total, itemId) => {
            const item = this.catalog.find(it => it.id === itemId);
            return total + (item?.price || 0);
        }, 0);
    }

    //валидация формы заказа
    validateOrder() {
        const errors: typeof this.formErrors = {};

        if(!this.order.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        if(!this.order.address) {
            errors.address = 'Необходимимо указать адрес';
        }
        if(!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if(!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        this.formErrors = errors;

        this.events.emit('formError: change', this.formErrors);

        return Object.keys(errors).length === 0;
    }

    //добавление товара в корзину
    addItemsToBasket(item: IProduct) {
        if(item.price === null){
            alert('Извините, этот товар не продается')
        } else {
        this.order.items.push(item.id);
        this.emitChanges('basket: change', item)}
    }

    //удаление товара из корзины
    deleteItemsFromBasket(item: IProduct) {
        this.order.items = this.order.items.filter((OrderedItem) => OrderedItem !== item.id);
        this.emitChanges('basket: change', item);
    }

    //очистка корзины
    clearBasket() {
       this.order = Object.assign({}, orderStart, { items: []});
        this.emitChanges('basket: change', {}) 
    }

    //проверка добавлен ли товар в корзину
    isItemAdded(item: IProduct) {
        if(this.order.items.includes(item.id)) {
            return true;
        } 
        return false;
    }

    //проверка наличия установленной цены
    isItemHasPrice(item: IProduct) {
        return Boolean(item.price);
    }
}