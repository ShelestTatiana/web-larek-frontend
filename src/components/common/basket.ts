import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/components";
import { EventEmitter } from "../base/events";

//Интерфейс корзины
interface IBasket {
    items: HTMLElement[];
    total: number; 
}

//класс Basket, который наследуется от класса Component и использует интерфейс IBasket.
export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    /*
    * Конструктор принимает два параметра: Элементы корзины и объект с событиями.
    * Конструктор вызывает конструктор родительского класса Component.
    */
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        //Получаем элементы корзины
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = ensureElement<HTMLElement>('.basket__price', this.container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        //Обработчик событий
        if(this._button) {
            this._button.addEventListener('click', (event) => {
                events.emit('order: open');
            });
        }

        this.items = [];
    }

    //сеттер items для установки содержимого корзины
    set items(items: HTMLElement[]) {
            if(items.length) {
            this._list.replaceChildren(...items);
            this.setDisable(this._button, false);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            })
            );
            this.setDisable(this._button, true);
        }
    }

    //сеттер total для установки суммы корзины
    set total(total: number) {
        this.setText(this._total, `${total} синапсов`)
    }
}