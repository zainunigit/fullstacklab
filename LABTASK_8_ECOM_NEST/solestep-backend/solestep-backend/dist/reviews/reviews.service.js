"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
let ReviewsService = class ReviewsService {
    constructor() {
        this.reviews = [
            { id: 1, customerName: 'Ahmed Khan', rating: 5, comment: 'The Aero Runner shoes are extremely comfortable. They are perfect for my daily runs.' },
            { id: 2, customerName: 'Sarah Ali', rating: 5, comment: 'Great quality and the shoes look even better in person. Very happy with my purchase.' },
            { id: 3, customerName: 'Usman Raza', rating: 5, comment: 'Fast delivery and excellent quality. The Classic Oxford shoes are perfect.' },
        ];
    }
    getAllReviews() {
        return this.reviews;
    }
    getReviewById(id) {
        const review = this.reviews.find((item) => item.id === id);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        return review;
    }
    addReview(data) {
        const review = { id: this.nextId(), ...data };
        this.reviews.push(review);
        return review;
    }
    updateReview(id, data) {
        const review = this.getReviewById(id);
        Object.assign(review, data, { id });
        return review;
    }
    deleteReview(id) {
        this.getReviewById(id);
        this.reviews = this.reviews.filter((item) => item.id !== id);
        return { message: 'Review deleted successfully' };
    }
    nextId() {
        return this.reviews.length ? Math.max(...this.reviews.map((item) => item.id)) + 1 : 1;
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)()
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map