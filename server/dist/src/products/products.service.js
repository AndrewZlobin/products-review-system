"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
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
            const averageRating = reviewCount > 0
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
    async findOne(id) {
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
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const { reviews, ...rest } = product;
        const reviewCount = reviews.length;
        const averageRating = reviewCount > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
            : 0;
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        for (const review of reviews) {
            ratingDistribution[review.rating]++;
        }
        return {
            ...rest,
            averageRating: Math.round(averageRating * 10) / 10,
            reviewCount,
            ratingDistribution,
            reviews,
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map