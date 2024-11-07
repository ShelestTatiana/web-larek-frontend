import './scss/styles.scss';
import { WebLarekApi } from './components/weblarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppState, orderStart } from './components/appData';
import { Basket } from './components/common/basket';
import { ClientContacts, Order } from './components/order';
import { View } from './components/view';
import { Modal } from './components/common/modal';
import { Card, CardInBasket, CardPreview } from './components/card';
import { IProduct , IOrderForm, PaymentMethod } from './types';
import { Success } from './components/success';

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

//Мониторинг событий
events.onAll(({eventName, data}) => {
    console.log(eventName, data);
})

//Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemlate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const constantsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

//Модель данных приложения
const appData = new AppState({}, events);

//Глобальные контейнеры
const view = new View(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('.modal'), events);

//Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemlate), events);
const clientContacts = new ClientContacts(cloneTemplate(constantsTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events, {
    onClick: (event: MouseEvent) => {
        const target = (event.target as HTMLButtonElement).name as PaymentMethod;
        if (target === 'cash' || target === 'card') {
            order.payment = target;
        }
        
    }
})

//Получаем товар с сервера 
api.getProducts()
.then(appData.setCatalog.bind(appData))
.catch(err => {
    console.log(err);
});

//Отрисовка карточек товара
events.on('items: changed', () => {
   view.catalog = appData.catalog.map((item) => {
    const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
        onClick: () => events.emit('card: selected', item)
    });
    
    card.id = item.id;
    return card.render({
        title: item.title,
        category: item.category,
        image: item.image,
        price: item.price
    });
   });

   view.counter = appData.getOrderProducts().length;
});

//Открытие карточки товара
events.on('card: selected', (item: IProduct) => {
    appData.setPreview(item);
});

// Изменение карточки товара, добавление в корзину
events.on('preview: changed', (item: IProduct) => {  
    if (!item) {
        modal.close();
        return;
    }

    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            appData.addItemsToBasket(item);
            modal.close();
        }
    });

    updateCardButtonState(card, item);
    
    modal.render({   
        content: card.render({
            title: item.title,
            category: item.category,
            image: item.image,
            price: item.price,
            description: item.description
        })
    });
});

// Обновление состояния кнопки карточки
function updateCardButtonState(card: CardPreview, item: IProduct) {
    if (item.price === null) {
        card.setButtonText('Извините, товар не продается');
        card.addBlockButton(true);
    } else if (appData.isItemHasPrice(item) && !appData.isItemAdded(item)) {
        card.addBlockButton(false);
    } else {
        card.addBlockButton(true);
    }
}

//Открытие корзины
events.on('basket: open', () => {
    modal.render({content: basket.render()})
});

//Изменение корзины
events.on('basket: change', () => {
    
    const order = appData.getOrderProducts();
    view.counter = order.length;
    basket.items = order.map((item, index) => {
        const card = new CardInBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                appData.deleteItemsFromBasket(item);
            }
        });
        return card.render({
            index: String(index + 1),
            title: item.title,
            price: item.price
        });
    });
    basket.total = appData.getTotal();
})

//Открытие формы заказа
events.on('order: open', () => {
    appData.order = Object.assign({}, orderStart, {
        items: appData.order.items
    });

    modal.render({
        content: order.render({
            payment: '',
            address: '',
            valid: false,
            errors: []
        })
    });
    appData.order.total = appData.getTotal();
});

//Валидация формы
events.on('formError: change', (errors: Partial<IOrderForm>) => {
    const {payment, email, phone, address} = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({payment, address}).filter((e) => !!e).join('; ');
    clientContacts.valid = !email && !phone;
    clientContacts.errors = Object.values({email, phone}).filter((e) => !!e).join('; ');
})

events.on(/^(order\..*|contacts\..*): change/, (data: {
    field: keyof IOrderForm;
    value: string
}) => {
    appData.setOrderField(data.field, data.value);
})
//Отправка формы заказа
events.on('order: submit', () => {
    modal.render({
        content: clientContacts.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
 
    });
})

//Отправка контактной информации
events.on('contacts: submit', () => {
    appData.getOrderProducts().filter(p => p.price === null).forEach(product => 
        appData.order.items = appData.order.items.filter(i => i != product.id)
    ) 
api.orderProduct(appData.order)
.then(() => {
    const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
            modal.close();
        }
    });
    modal.render({
        content: success.render({
            total: appData.order.total
        })
    });
    appData.clearBasket();
    order.payment = '';
})
.catch((err) => console.error(err));
}
);

// Блокируем  и разблокируем прокрутку страницы
events.on('modal: open', () => {
	view.locked = true;
});

events.on('modal: close', () => {
	view.locked = false;
}); 