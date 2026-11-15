import { ProductsService } from '../products/products.service';
export declare class CartService {
    private readonly productsService;
    private items;
    private idCounter;
    private readonly shipping;
    constructor(productsService: ProductsService);
    getCart(): any[];
    addToCart(data: any): {
        id: number;
        productId: number;
        name: string;
        price: number;
        quantity: number;
        size: number;
    };
    updateItem(id: number, data: any): any;
    removeItem(id: number): {
        message: string;
    };
    clearCart(): {
        message: string;
    };
    getSummary(): {
        items: any[];
        subtotal: number;
        shipping: number;
        total: number;
    };
}
