import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryProductsDto } from './dto/query-products.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryProductsDto) {
    const { category, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where = category ? { category } : {};

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { reviews: true } },
          reviews: { select: { rating: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const items = products.map((p) => {
      const { reviews, _count, ...rest } = p;
      const reviewCount = _count.reviews;
      const averageRating =
        reviewCount > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
          : 0;

      return {
        ...rest,
        reviewCount,
        averageRating: Math.round(averageRating * 10) / 10,
      };
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    const { reviews, ...rest } = product;
    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const review of reviews) {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    }

    return {
      ...rest,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount,
      ratingDistribution,
      reviews,
    };
  }
}
