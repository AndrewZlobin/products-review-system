import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, productId: string, dto: CreateReviewDto): Promise<{
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
