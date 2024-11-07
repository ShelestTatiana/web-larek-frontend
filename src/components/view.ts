import { ensureElement } from "../utils/utils";
import { Component } from "./base/components";
import { IEvents } from "./base/events";

//Интерфейс страницы
interface IView {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

//Класс Page, наследуется от компонента и использует интерфейс IPage
export class View extends Component<IView> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    /*
    * Конструктор принимает два параметра: Элементы формы и объект с событиями.
    * Конструктор вызывает конструктор родительского класса Component.
    */
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        //Получаем элементы страницы
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        //Обработчики событий
        this._basket.addEventListener('click', () => {
            this.events.emit('basket: open');
        });
    }
       //сеттер counter для установки количества элементов в корзине
        set counter(value: number) {
            this.setText(this._counter, String(value));
        }

        //сеттер catalog для отрисовки карточек
        set catalog(items: HTMLElement[]) {
            this._catalog.replaceChildren(...items);
        }

        //сеттер locked для блокировки прокрутки страницы
        set locked(value: boolean) {
            if(value) {
                this._wrapper.classList.add('page__wrapper_locked');
            } else {
                this._wrapper.classList.remove('page__wrapper_locked');
            }
        }
    }