"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
let ProductsService = class ProductsService {
    constructor() {
        this.products = [
            { id: 1, name: 'Aero Runner', category: 'Running', description: 'Lightweight running shoes with breathable comfort.', price: 79.99 },
            { id: 2, name: 'Mountain Trek', category: 'Outdoor', description: 'Durable outdoor shoes built for your adventures.', price: 109.99 },
            { id: 3, name: 'Classic Oxford', category: 'Formal', description: 'Elegant leather-inspired shoes for formal occasions.', price: 89.99 },
            { id: 4, name: 'Urban Street', category: 'Casual', description: 'Modern everyday sneakers made for city life.', price: 69.99 },
            { id: 5, name: 'Velocity Pro', category: 'Sports', description: 'Performance shoes designed for speed and training.', price: 119.99 },
            { id: 6, name: 'Urban Boots', category: 'Boots', description: 'Stylish boots combining durability and comfort.', price: 129.99 },
            { id: 7, name: 'Cloud Walk', category: 'Lifestyle', description: 'Soft and comfortable shoes for everyday walking.', price: 74.99 },
            { id: 8, name: 'Elite Runner', category: 'Premium', description: 'Premium performance sneakers for serious runners.', price: 149.99 },
        ];
    }
    getAllProducts() {
        return this.products;
    }
    getProductById(id) {
        const product = this.products.find((item) => item.id === id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    getProductsByCategory(category) {
        return this.products.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    }
    addProduct(data) {
        const product = { id: this.nextId(), ...data };
        this.products.push(product);
        return product;
    }
    updateProduct(id, data) {
        const product = this.getProductById(id);
        Object.assign(product, data, { id });
        return product;
    }
    deleteProduct(id) {
        this.getProductById(id);
        this.products = this.products.filter((item) => item.id !== id);
        return { message: 'Product deleted successfully' };
    }
    nextId() {
        return this.products.length ? Math.max(...this.products.map((item) => item.id)) + 1 : 1;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)()
], ProductsService);
//# sourceMappingURL=products.service.js.map