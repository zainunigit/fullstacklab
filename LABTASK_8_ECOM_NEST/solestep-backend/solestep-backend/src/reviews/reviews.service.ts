import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ReviewsService {
  private reviews = [
    { id: 1, customerName: 'Ahmed Khan', rating: 5, comment: 'The Aero Runner shoes are extremely comfortable. They are perfect for my daily runs.' },
    { id: 2, customerName: 'Sarah Ali', rating: 5, comment: 'Great quality and the shoes look even better in person. Very happy with my purchase.' },
    { id: 3, customerName: 'Usman Raza', rating: 5, comment: 'Fast delivery and excellent quality. The Classic Oxford shoes are perfect.' },
  ];

  getAllReviews() {
    return this.reviews;
  }

  getReviewById(id: number) {
    const review = this.reviews.find((item) => item.id === id);
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  addReview(data: any) {
    const review = { id: this.nextId(), ...data };
    this.reviews.push(review);
    return review;
  }

  updateReview(id: number, data: any) {
    const review = this.getReviewById(id);
    Object.assign(review, data, { id });
    return review;
  }

  deleteReview(id: number) {
    this.getReviewById(id);
    this.reviews = this.reviews.filter((item) => item.id !== id);
    return { message: 'Review deleted successfully' };
  }

  private nextId() {
    return this.reviews.length ? Math.max(...this.reviews.map((item) => item.id)) + 1 : 1;
  }
}
