import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, productId: string, dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    try {
      return await this.prisma.review.create({
        data: { rating: dto.rating, title: dto.title, body: dto.body, userId, productId },
        include: { user: { select: { id: true, name: true } } },
      });
    } catch (e: any) {
      if (e?.code === 'P2002') throw new ConflictException('You already reviewed this product');
      throw e;
    }
  }
}
