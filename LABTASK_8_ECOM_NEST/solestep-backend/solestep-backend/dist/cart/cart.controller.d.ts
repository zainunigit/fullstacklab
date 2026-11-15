import { CartService } from './cart.service';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(): any[];
    getSummary(): {
        items: any[];
        subtotal: number;
        shipping: number;
        total: number;
    };
    addToCart(item: any): {
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
}
