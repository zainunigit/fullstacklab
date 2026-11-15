import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    getAllReviews(): {
        id: number;
        customerName: string;
        rating: number;
        comment: string;
    }[];
    getReviewById(id: number): {
        id: number;
        customerName: string;
        rating: number;
        comment: string;
    };
    addReview(review: any): any;
    updateReview(id: number, review: any): {
        id: number;
        customerName: string;
        rating: number;
        comment: string;
    };
    deleteReview(id: number): {
        message: string;
    };
}
