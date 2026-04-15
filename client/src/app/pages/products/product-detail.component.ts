import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ProductsService, ProductDetail } from '../../core/services/products.service';
import { AuthService } from '../../core/services/auth.service';
import { ReviewFormDialogComponent } from '../../shared/review-form-dialog/review-form-dialog.component';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatIconModule,
    SlicePipe,
    ReviewFormDialogComponent,
  ],
  template: `
    @if (loading()) {
      <div class="skeleton-page">
        <div class="skeleton-hero"></div>
        <div class="skeleton-lines">
          <div class="skeleton-line wide"></div>
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
    } @else if (error()) {
      <div class="state-center">
        <p class="error-text">{{ error() }}</p>
        <a mat-stroked-button routerLink="/products">← Back to products</a>
      </div>
    } @else if (product()) {
      <div class="page">
        <a mat-button routerLink="/products" class="back-link">
          <mat-icon>arrow_back</mat-icon> Products
        </a>

        <div class="layout">
          <!-- Left: image -->
          <div class="image-col">
            @if (product()!.imageUrl) {
              <img class="product-image" [src]="product()!.imageUrl" [alt]="product()!.name" />
            } @else {
              <div class="image-placeholder">No image</div>
            }
          </div>

          <!-- Right: info -->
          <div class="info-col">
            <mat-chip-set>
              <mat-chip>{{ product()!.category }}</mat-chip>
            </mat-chip-set>

            <h1 class="name">{{ product()!.name }}</h1>
            <p class="description">{{ product()!.description }}</p>

            <mat-divider />

            <!-- Rating summary -->
            <div class="rating-summary">
              <span class="avg-rating">★ {{ product()!.averageRating.toFixed(1) }}</span>
              <span class="review-count">{{ product()!.reviewCount }} review{{ product()!.reviewCount !== 1 ? 's' : '' }}</span>
            </div>

            <!-- Rating distribution -->
            @if (product()!.reviewCount > 0) {
              <div class="rating-distribution">
                @for (star of [5, 4, 3, 2, 1]; track star) {
                  <div class="dist-row">
                    <span class="star-label">{{ star }} ★</span>
                    <mat-progress-bar
                      mode="determinate"
                      [value]="getDistPercent(star)"
                      class="dist-bar"
                    />
                    <span class="dist-count">{{ product()!.ratingDistribution[star] }}</span>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <mat-divider />

        <!-- Reviews -->
        <section class="reviews-section">
          <div class="reviews-header">
            <h2>Reviews</h2>
            @if (authService.isLoggedIn()) {
              <button mat-flat-button color="primary" (click)="openReviewDialog()">Write Review</button>
            }
          </div>
          @if (product()!.reviews.length === 0) {
            <p class="no-reviews">No reviews yet. Be the first!</p>
          } @else {
            <div class="reviews-list">
              @for (review of product()!.reviews; track review.id) {
                <mat-card appearance="outlined" class="review-card">
                  <mat-card-header>
                    <mat-card-title>{{ review.title }}</mat-card-title>
                    <mat-card-subtitle>
                      <span class="review-rating">{{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}</span>
                      &nbsp;·&nbsp; {{ review.user.name }}
                      &nbsp;·&nbsp; {{ review.createdAt | slice: 0 : 10 }}
                    </mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p>{{ review.body }}</p>
                  </mat-card-content>
                </mat-card>
              }
            </div>
          }
        </section>
      </div>
    }
  `,
  styles: [`
    .page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .back-link {
      margin-bottom: 1.5rem;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .layout {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 2.5rem;
      align-items: start;
      margin-bottom: 2rem;
    }

    @media (max-width: 720px) {
      .layout { grid-template-columns: 1fr; }
    }

    .image-col .product-image {
      width: 100%;
      border-radius: 10px;
      object-fit: cover;
      max-height: 340px;
    }

    .image-placeholder {
      width: 100%;
      height: 240px;
      border-radius: 10px;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
    }

    .info-col {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .name {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1.25;
    }

    .description {
      margin: 0;
      color: #6b7280;
      line-height: 1.6;
    }

    .rating-summary {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
    }

    .avg-rating {
      font-size: 1.5rem;
      font-weight: 700;
      color: #f59e0b;
    }

    .review-count {
      font-size: 0.9rem;
      color: #6b7280;
    }

    .rating-distribution {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .dist-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .star-label {
      width: 2.5rem;
      font-size: 0.8rem;
      color: #6b7280;
      text-align: right;
      flex-shrink: 0;
    }

    .dist-bar {
      flex: 1;
    }

    .dist-count {
      width: 1.5rem;
      font-size: 0.8rem;
      color: #6b7280;
      text-align: right;
      flex-shrink: 0;
    }

    .reviews-section {
      margin-top: 2rem;
    }

    .reviews-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .reviews-header h2 {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
    }

    .no-reviews {
      color: #9ca3af;
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .review-card p {
      margin: 0;
      color: #374151;
      line-height: 1.6;
    }

    .review-rating {
      color: #f59e0b;
      letter-spacing: 0.05em;
    }

    /* Skeleton */
    .skeleton-page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 1.5rem;
      display: flex;
      gap: 2rem;
    }

    .skeleton-hero {
      width: 340px;
      height: 300px;
      border-radius: 10px;
      flex-shrink: 0;
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }

    .skeleton-lines {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-top: 0.5rem;
    }

    .skeleton-line {
      height: 14px;
      border-radius: 4px;
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }

    .skeleton-line.wide { width: 70%; }
    .skeleton-line.medium { width: 45%; }
    .skeleton-line.short { width: 25%; }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Error */
    .state-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 1rem;
      gap: 1rem;
    }

    .error-text { color: #dc2626; }
  `]
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly dialog = inject(MatDialog);
  readonly authService = inject(AuthService);

  product = signal<ProductDetail | null>(null);
  loading = signal(true);
  error = signal('');

  private productId = '';

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.productsService.getProductById(this.productId).subscribe({
      next: (p) => {
        this.product.set(p);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Product not found.');
        this.loading.set(false);
      },
    });
  }

  openReviewDialog(): void {
    this.dialog
      .open(ReviewFormDialogComponent, {
        width: '480px',
        data: { productId: this.productId, productName: this.product()!.name },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.load();
      });
  }

  getDistPercent(star: number): number {
    const p = this.product();
    if (!p || p.reviewCount === 0) return 0;
    return (p.ratingDistribution[star] / p.reviewCount) * 100;
  }
}
