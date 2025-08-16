import { Controller, Get, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':listingId')
  list(@Param('listingId') id: string) {
    return this.reviewsService.list(Number(id));
  }
}
