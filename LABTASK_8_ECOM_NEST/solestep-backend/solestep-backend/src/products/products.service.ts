import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductsService {
  private products = [
    { id: 1, name: 'Aero Runner', category: 'Running', description: 'Lightweight running shoes with breathable comfort.', price: 79.99 },
    { id: 2, name: 'Mountain Trek', category: 'Outdoor', description: 'Durable outdoor shoes built for your adventures.', price: 109.99 },
    { id: 3, name: 'Classic Oxford', category: 'Formal', description: 'Elegant leather-inspired shoes for formal occasions.', price: 89.99 },
    { id: 4, name: 'Urban Street', category: 'Casual', description: 'Modern everyday sneakers made for city life.', price: 69.99 },
    { id: 5, name: 'Velocity Pro', category: 'Sports', description: 'Performance shoes designed for speed and training.', price: 119.99 },
    { id: 6, name: 'Urban Boots', category: 'Boots', description: 'Stylish boots combining durability and comfort.', price: 129.99 },
    { id: 7, name: 'Cloud Walk', category: 'Lifestyle', description: 'Soft and comfortable shoes for everyday walking.', price: 74.99 },
    { id: 8, name: 'Elite Runner', category: 'Premium', description: 'Premium performance sneakers for serious runners.', price: 149.99 },
  ];

  getAllProducts() {
    return this.products;
  }

  getProductById(id: number) {
    const product = this.products.find((item) => item.id === id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  getProductsByCategory(category: string) {
    return this.products.filter((item) => item.category.toLowerCase() === category.toLowerCase());
  }

  addProduct(data: any) {
    const product = { id: this.nextId(), ...data };
    this.products.push(product);
    return product;
  }

  updateProduct(id: number, data: any) {
    const product = this.getProductById(id);
    Object.assign(product, data, { id });
    return product;
  }

  deleteProduct(id: number) {
    this.getProductById(id);
    this.products = this.products.filter((item) => item.id !== id);
    return { message: 'Product deleted successfully' };
  }

  private nextId() {
    return this.products.length ? Math.max(...this.products.map((item) => item.id)) + 1 : 1;
  }
}
