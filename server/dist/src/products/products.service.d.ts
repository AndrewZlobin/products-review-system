import { PrismaService } from '../prisma/prisma.service';
import { QueryProductsDto } from './dto/query-products.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryProductsDto): Promise<{
        items: {
            reviewCount: number;
            averageRating: number;
            name: string;
            id: string;
            createdAt: Date;
            category: string;
            description: string;
            imageUrl: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        averageRating: number;
        reviewCount: number;
        ratingDistribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
        reviews: ({
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
        })[];
        name: string;
        id: string;
        createdAt: Date;
        category: string;
        description: string;
        imageUrl: string | null;
    }>;
}
