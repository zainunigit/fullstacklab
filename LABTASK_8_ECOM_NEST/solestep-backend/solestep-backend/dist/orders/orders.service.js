"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("../cart/cart.service");
let OrdersService = class OrdersService {
    constructor(cartService) {
        this.cartService = cartService;
        this.orders = [];
        this.idCounter = 1;
    }
    createOrder(data) {
        const summary = this.cartService.getSummary();
        if (!summary.items.length)
            throw new common_1.BadRequestException('Cannot place an order with an empty cart');
        const order = {
            id: this.idCounter++,
            customer: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                address: data.address,
                city: data.city,
                postalCode: data.postalCode,
            },
            paymentMethod: data.paymentMethod,
            items: [...summary.items],
            subtotal: summary.subtotal,
            shipping: summary.shipping,
            total: summary.total,
            status: 'Pending',
            createdAt: new Date().toISOString(),
        };
        this.orders.push(order);
        this.cartService.clearCart();
        return order;
    }
    getAllOrders() {
        return this.orders;
    }
    getOrderById(id) {
        const order = this.orders.find((item) => item.id === id);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    updateOrder(id, data) {
        const order = this.getOrderById(id);
        Object.assign(order.customer, data);
        return order;
    }
    updateStatus(id, status) {
        const order = this.getOrderById(id);
        order.status = status;
        return order;
    }
    cancelOrder(id) {
        const order = this.getOrderById(id);
        order.status = 'Cancelled';
        return { message: 'Order cancelled', order };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map