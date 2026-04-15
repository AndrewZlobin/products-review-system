import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(productId: string, dto: CreateReviewDto, req: {
        user: {
            id: string;
        };
    }): Promise<{
        user: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        rating: number;
        title: string;
        body: string;
        userId: string;
        productId: string;
        updatedAt: Date;
    }>;
}
