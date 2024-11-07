import { ensureElement } from "./../utils/utils";
import { Component } from "./base/components";

//Интерфейс формы (при успешном оформлении)
interface ISuccess {
    total: number;
}

//Интерфейс событий при нажатии на кнопку (при успешном оформлении)
interface ISuccessAction {
    onClick: () => void;
}

//Класс Success, который наследуется от класса Component и использует интерфейс ISuccess.
export class Success extends Component<ISuccess> {
    protected _close: HTMLButtonElement;
    protected _total: HTMLElement;

    /*
    * Конструктор принимает два параметра: Элемент, в котором будет компонент и объект с событием (нажатие на кнопку).
    * Конструктор вызывает конструктор родительского класса Component.
    */
    constructor(container: HTMLElement, { onClick }: ISuccessAction) {
        super(container);
    
        //Получаем элементы формы (при успешном оформлении)
        this._close = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

        //Обработчик событий (нажатие на кнопку активно)
        if(onClick) {
            this._close.addEventListener('click', onClick);
        }
    }

    //сеттер total для установки количества синапсов
    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`)
    }
}