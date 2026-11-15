import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  private orders: any[] = [];
  private idCounter = 1;

  constructor(private readonly cartService: CartService) {}

  createOrder(data: any) {
    const summary = this.cartService.getSummary();
    if (!summary.items.length) throw new BadRequestException('Cannot place an order with an empty cart');

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

  getOrderById(id: number) {
    const order = this.orders.find((item) => item.id === id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  updateOrder(id: number, data: any) {
    const order = this.getOrderById(id);
    Object.assign(order.customer, data);
    return order;
  }

  updateStatus(id: number, status: string) {
    const order = this.getOrderById(id);
    order.status = status;
    return order;
  }

  cancelOrder(id: number) {
    const order = this.getOrderById(id);
    order.status = 'Cancelled';
    return { message: 'Order cancelled', order };
  }
}
