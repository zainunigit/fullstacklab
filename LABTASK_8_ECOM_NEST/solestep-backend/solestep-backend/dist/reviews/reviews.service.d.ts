export declare class ReviewsService {
    private reviews;
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
    addReview(data: any): any;
    updateReview(id: number, data: any): {
        id: number;
        customerName: string;
        rating: number;
        comment: string;
    };
    deleteReview(id: number): {
        message: string;
    };
    private nextId;
}
