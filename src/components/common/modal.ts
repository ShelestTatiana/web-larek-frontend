import { ensureElement } from "../../utils/utils";
import { Component } from "../base/components";
import { IEvents } from "../base/events";

//Интерфейс модального окна
interface IModal {
    content: HTMLElement;
}

//класс Modal, который наследуется от класса Component и использует интерфейс IModal. 
export class Modal extends Component<IModal> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    /*
    * Конструктор принимает два параметра: Элементы модального окна и объект с событиями.
    * Конструктор вызывает конструктор родительского класса Component.
    */
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        //Получаем элементы модального окна
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        //Обработчики событий
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    //сеттер content для установки содержимого модального окна
    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    //открытие модального окна
    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal: open')
    }

    //закрытие модального окна
    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal: close')
    }

    //рендер модального окна
    render(data: IModal): HTMLElement {
        super.render(data);
        this.open();

        return this.container;
    }
}