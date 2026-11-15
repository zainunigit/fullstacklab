import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  getAllReviews() {
    return this.reviewsService.getAllReviews();
  }

  @Get(':id')
  getReviewById(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.getReviewById(id);
  }

  @Post()
  addReview(@Body() review: any) {
    return this.reviewsService.addReview(review);
  }

  @Patch(':id')
  updateReview(@Param('id', ParseIntPipe) id: number, @Body() review: any) {
    return this.reviewsService.updateReview(id, review);
  }

  @Delete(':id')
  deleteReview(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.deleteReview(id);
  }
}
