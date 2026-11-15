import { CartService } from '../cart/cart.service';
export declare class OrdersService {
    private readonly cartService;
    private orders;
    private idCounter;
    constructor(cartService: CartService);
    createOrder(data: any): {
        id: number;
        customer: {
            firstName: any;
            lastName: any;
            email: any;
            address: any;
            city: any;
            postalCode: any;
        };
        paymentMethod: any;
        items: any[];
        subtotal: number;
        shipping: number;
        total: number;
        status: string;
        createdAt: string;
    };
    getAllOrders(): any[];
    getOrderById(id: number): any;
    updateOrder(id: number, data: any): any;
    updateStatus(id: number, status: string): any;
    cancelOrder(id: number): {
        message: string;
        order: any;
    };
}
