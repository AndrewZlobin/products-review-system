import { Body, Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products/:productId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.reviewsService.create(req.user.id, productId, dto);
  }
}
