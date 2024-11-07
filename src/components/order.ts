import { IOrderForm } from "../types";
import { Form } from "./common/form";
import { IEvents } from "./base/events";
import { PaymentMethod } from "../types";

//Интерфейс событий при нажатии мышью
interface IOrderActions {
    onClick: (event: MouseEvent) => void;
}

//Класс Order, который наследуется от класса Form и использует интерфейс IOrderForm.
export class Order extends Form<IOrderForm> {
    protected _paymentCard: HTMLButtonElement;
    protected _paymentCash: HTMLButtonElement;

    /* 
    * Конструктор принимает три параметра: Элемент формы, объект с событиями + объект с действиями при нажатии мышью (необязательный).
    * Конструктор вызывает конструктор родительского класса Form.
    */
    constructor(container: HTMLFormElement, events: IEvents, actions?: IOrderActions) {
        super(container, events);

        //Получаем элементы заказа
        this._paymentCash = this.container.elements.namedItem('cash') as HTMLButtonElement;
        this._paymentCard = this.container.elements.namedItem('card') as HTMLButtonElement;

        //Обработчик событий (при нажатии на кнопку "наличные" вызывается метод onClick и генерируется событие о смене метода оплаты. Аналогично для кнопки "карта").
        if(actions?.onClick) {
            this._paymentCash.addEventListener('click', (evt)=> {
                actions.onClick(evt);
                events.emit('order.payment: change', {
                    field: 'payment',
                    value: 'cash'
                });
            });
            this._paymentCard.addEventListener('click', (evt) => {
                actions.onClick(evt);
                events.emit('order.payment: change', {
                    field: 'payment',
                    value: 'card'
                });
            });
        }
    }

    //сеттер payment для установки метода оплаты
    set payment(value: PaymentMethod) {
        const paymentMethods: { [key in Exclude<PaymentMethod, "">]: HTMLButtonElement } = {
            cash: this._paymentCash,
            card: this._paymentCard
        };
    
        this._paymentCash.classList.remove('button_alt-active');
        this._paymentCard.classList.remove('button_alt-active');
    
        if (value && value in paymentMethods) {
            paymentMethods[value].classList.add('button_alt-active');
        }
    }

    //сеттер address для установки адреса доставки
    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    } 
}

//Класс ClientContacts, который наследуется от класса Form и использует интерфейс IOrderForm.
export class ClientContacts extends Form<IOrderForm> {

    /* 
    * Конструктор принимает три параметра: Элемент формы, объект с событиями.
    * Конструктор вызывает конструктор родительского класса Form.
    */
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events)   
    }

    //сеттер phone для установки значения телефона
     set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    //сеттер email для установки значения электронной почты
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}