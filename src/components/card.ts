import { categoryChange } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/components";

//Интерфейс карточки (структура)
export interface ICard {
    title: string;
    description?: string;
    image: string;
    category: string;
    price: number;
    index?: string;
}

//Интерфейс событий при нажатии на карточку мышкой
export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

//Класс Card, который наследуется от класса Component и использует интерфейс ICard
export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;

    /* 
    * Конструктор принимает три параметра: имя блока, элемент, в котором будет компонент и объект с событием (нажатие на карточку мышкой).
    * Конструктор вызывает конструктор родительского класса Component.
    */
    constructor(protected blockName: string, container: HTMLElement, actions: ICardActions) {
        super(container);

        //Получаем элементы карточки
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);

        //Обработчик событий (нажатие на карточку мышкой активно)
        if(actions?.onClick) {
            container.addEventListener('click', actions.onClick)
        }
    }

    //сеттер id для установки идентификатора
    set id(value: string) {
        this.container.dataset.id = value;
    }
    
    //геттер id для получения идентификатора
    get id(): string {
        return this.container.dataset.id || '';
    }

    //сеттер title для установки названия
    set title(value: string) {
        this.setText(this._title, value);
    }

    //геттер title для получения названия
    get title(): string {
        return this._title.textContent || '';
    }

    //сеттер image для установки изображения
    set image(value: string) {
        this.setImage(this._image, value, this._title.textContent);
    }

    //сеттер category для установки значения категории
    set category(value: string) {
        this.setText(this._category, value);
        this._category.className = `card__category ${categoryChange[value]}`;
    }

    //сеттер price для установки цены
    set price(value: number) {
        if(value === null) {
            this.setText(this._price, 'Бесценно')
        } else {
            this.setText(this._price, `${value.toString()} синапсов`)
        }
    }
}

//Класс CardPreview, который наследуется от класса Card
export class CardPreview extends Card {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    /* 
    * Конструктор принимает два параметра: элемент, в котором будет компонент и объект с событием (нажатие на карточку мышкой) (необязательный).
    * Конструктор вызывает конструктор родительского класса Card, передавая ему три аргумента: строку 'card', контейнер и событие.
    */
    constructor(container: HTMLElement, actions?:ICardActions) {
        super('card', container, actions);

        //Получаем элементы карточки
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);
        
        //Обработчик событий (если переданы события и есть обработчик onClick, добавляем его как слушатель). Затем удаляем.
        if(actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
            container.removeEventListener('click', actions.onClick);
        }
    }

    //сеттер description для установки описания
    set description(value: string) {
        this.setText(this._description, value);
    }

    //метод для управления состоянием кнопки
    addBlockButton(state: boolean) {
        this.setDisable(this._button, state);
    }

    //метод для установки текста кнопки
    setButtonText(value: string) {
        this._button.textContent = value;
    }
}

//Класс CardInBasket, который наследуется от класса Component и использует интерфейс ICard
export class CardInBasket extends Component<ICard> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _index: HTMLElement;

    /* 
    * Конструктор принимает два параметра: элемент, в котором будет компонент и объект с событием (необязательный).
    * Конструктор вызывает конструктор родительского класса Component.
    */
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        //Получаем элементы карточки
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);

        //Обработчик событий (если переданы события и есть обработчик onClick, добавляем его как слушатель). 
        if(actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    //сеттер index для установки значения индекса
    set index(value: string) {
        this.setText(this._index, value);
    }

    //сеттер title для установки названия
    set title(value: string) {
        this.setText(this._title, value);
    }

    //сеттер price для установки цены
    set price(value: string) {
        this.setText(this._price, value);
    }

    //геттер title для получения названия
    get title(): string {
        return this._title.textContent || '';
    } 

    //геттер price для получения цены
    get price(): string {
        return this._price.textContent || '';
    }
}