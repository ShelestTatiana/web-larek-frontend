/**
 * Абстрактный класс, который служит основой для создания других компонентов.
 * Использует дженерики <T>, что позволяет использовать ему работать с разными типами данных
 */
export abstract class Component<T> {
    /**
     * принимает HTML элемент, который будет использоваться как контейнер для компонента. 
     * protected означает, что этот конструктор можно использовать только в наследующих классах 
     */
    protected constructor(protected readonly container: HTMLElement) {}

    //Инструментарий для работы с DOM в дочерних компонентах
    //переключение класса у элемента
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    //установить текстовое содержимое у элемента
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    //установить состояние disabled у элемента 
    setDisable(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    //скрыть элемент
    protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    //отобразить элемент
    protected setVisible(element: HTMLElement) {
        element.style.removeProperty('display')
    }

    //Установить изображение с alt 
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if(element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    //Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}