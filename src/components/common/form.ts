import { ensureElement } from "../../utils/utils";
import { Component } from "../base/components";
import { IEvents } from "../base/events";

//Интерфейс формы (структура формы)
interface IForm {
    valid: boolean;
    errors: string[];
}

/*
* класс Form, который наследуется от класса Component и использует интерфейс IForm.
* Класс Form может использовать любые типы данных (<T>).
*/
export class Form<T> extends Component<IForm> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    /*
    * Конструктор принимает два параметра: Элементы формы и объект с событиями.
    * Конструктор вызывает конструктор родительского класса Component.
    */
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        //Получаем элементы формы
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        //Обработчики событий
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}: submit`);
        });
    }

    //метод обработки изменений в полях формы
    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}: change`, {
            field,
            value
        });
    }

    //сеттер valid для управления состоянием кнопки отправки
    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    //сеттер errors для установки текста ошибок 
    set errors(value: string) {
        this.setText(this._errors, value);
    }  

    /* 
    * метод для обновления состояния формы - принимает объект, который может содержать как часть данных типа T, так и данные из интерфейса IForm.
    * Извлекает значения valid и errors, а остальные поля сохраняет в объекте inputs.
    * Вызывает метод render родительского класса и возвращает контейнер формы.
    */
    render(state: Partial<T> & IForm) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;
    }
}