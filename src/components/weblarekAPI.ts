import { Api, ApiListResponse } from "./base/api";
import { IProduct, IOrderResult, IOrderForm } from "../types";

//интерфейс IWebLarekApi
export interface IWebLarekApi {
    getProducts: () => Promise<IProduct[]>;
    orderProduct: (order: IOrderForm) => Promise<IOrderResult>; 
}

//класс WeLarekApi наследуется от Api и реализует все методы интерфейса ILarekApi
export class WebLarekApi extends Api implements IWebLarekApi {
    readonly cdn: string;   

    /*
    * Конструктор принимает три параметра: строку, представляющую адрес CDN. Этот параметр передается при создании объекта WebLarekApi.
    * базовый URL для API, который также передается в конструктор. Дополнительные (опциональные) параметры для настройки запросов. 
    */
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    //получение списка продуктов
    getProducts(): Promise<IProduct[]> {
        return this.get('/product').then (
            (data: ApiListResponse<IProduct>) => 
                data.items.map((item) => ({
                    ...item,
                    image: this.cdn + item.image
                })));
    }

    //отправка заказа продукта
    orderProduct(order: IOrderForm): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}