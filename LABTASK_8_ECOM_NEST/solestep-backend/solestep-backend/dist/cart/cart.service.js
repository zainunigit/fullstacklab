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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("../products/products.service");
let CartService = class CartService {
    constructor(productsService) {
        this.productsService = productsService;
        this.items = [];
        this.idCounter = 1;
        this.shipping = 10;
    }
    getCart() {
        return this.items;
    }
    addToCart(data) {
        const product = this.productsService.getProductById(Number(data.productId));
        const quantity = Number(data.quantity ?? 1);
        const size = Number(data.size);
        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new common_1.BadRequestException('Quantity must be a positive whole number');
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
    updateItem(id, data) {
        const item = this.items.find((entry) => entry.id === id);
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        if (data.quantity !== undefined) {
            const quantity = Number(data.quantity);
            if (!Number.isInteger(quantity) || quantity < 1) {
                throw new common_1.BadRequestException('Quantity must be a positive whole number');
            }
            item.quantity = quantity;
        }
        if (data.size !== undefined)
            item.size = Number(data.size);
        return item;
    }
    removeItem(id) {
        const exists = this.items.some((item) => item.id === id);
        if (!exists)
            throw new common_1.NotFoundException('Cart item not found');
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
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], CartService);
//# sourceMappingURL=cart.service.js.map