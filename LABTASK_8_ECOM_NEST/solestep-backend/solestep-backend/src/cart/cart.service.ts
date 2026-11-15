import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  private items: any[] = [];
  private idCounter = 1;
  private readonly shipping = 10;

  constructor(private readonly productsService: ProductsService) {}

  getCart() {
    return this.items;
  }

  addToCart(data: any) {
    const product = this.productsService.getProductById(Number(data.productId));
    const quantity = Number(data.quantity ?? 1);
    const size = Number(data.size);
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new BadRequestException('Quantity must be a positive whole number');
    }
    const item = {
      id: this.idCounter++,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: Number.isFinite(size) ? size : null,
    };
    this.items.push(item);
    return item;
  }

  updateItem(id: number, data: any) {
    const item = this.items.find((entry) => entry.id === id);
    if (!item) throw new NotFoundException('Cart item not found');
    if (data.quantity !== undefined) {
      const quantity = Number(data.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new BadRequestException('Quantity must be a positive whole number');
      }
      item.quantity = quantity;
    }
    if (data.size !== undefined) item.size = Number(data.size);
    return item;
  }

  removeItem(id: number) {
    const exists = this.items.some((item) => item.id === id);
    if (!exists) throw new NotFoundException('Cart item not found');
    this.items = this.items.filter((item) => item.id !== id);
    return { message: 'Cart item removed successfully' };
  }

  clearCart() {
    this.items = [];
    return { message: 'Cart emptied successfully' };
  }

  getSummary() {
    const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = this.items.length ? this.shipping : 0;
    return { items: this.items, subtotal: Number(subtotal.toFixed(2)), shipping, total: Number((subtotal + shipping).toFixed(2)) };
  }
}
