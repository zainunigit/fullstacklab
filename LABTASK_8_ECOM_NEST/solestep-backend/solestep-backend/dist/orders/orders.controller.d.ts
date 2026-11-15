import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(order: any): {
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
    updateStatus(id: number, body: any): any;
    updateOrder(id: number, data: any): any;
    cancelOrder(id: number): {
        message: string;
        order: any;
    };
}
