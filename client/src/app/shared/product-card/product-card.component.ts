import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../core/services/products.service';
import { AuthService } from '../../core/services/auth.service';
import { ReviewFormDialogComponent } from '../review-form-dialog/review-form-dialog.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatChipsModule, MatButtonModule],
  template: `
    <a class="card-link" [routerLink]="['/products', product().id]">
      <mat-card appearance="outlined" class="product-card">
        <div class="image-wrap">
          @if (product().imageUrl) {
            <img mat-card-image [src]="product().imageUrl" [alt]="product().name" />
          } @else {
            <div class="placeholder">No image</div>
          }
        </div>
        <mat-card-header>
          <mat-card-subtitle>
            <mat-chip-set>
              <mat-chip>{{ product().category }}</mat-chip>
            </mat-chip-set>
          </mat-card-subtitle>
          <mat-card-title>{{ product().name }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="desc">{{ product().description }}</p>
        </mat-card-content>
        <mat-card-footer class="card-footer">
          <span class="rating">★ {{ product().averageRating.toFixed(1) }}</span>
          <span class="count">{{ product().reviewCount }} review{{ product().reviewCount !== 1 ? 's' : '' }}</span>
          @if (authService.isLoggedIn()) {
            <button mat-stroked-button class="review-btn" (click)="openReviewDialog($event)">
              Write Review
            </button>
          }
        </mat-card-footer>
      </mat-card>
    </a>
  `,
  styles: [`
    .card-link {
      display: block;
      text-decoration: none;
      color: inherit;
      height: 100%;
    }

    .product-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: box-shadow 0.15s, transform 0.15s;
      cursor: pointer;
    }

    .product-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .image-wrap {
      height: 180px;
      overflow: hidden;
      background: #f3f4f6;
    }

    .image-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .placeholder {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      font-size: 0.85rem;
    }

    .desc {
      font-size: 0.825rem;
      color: #6b7280;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin: 0;
    }

    .card-footer {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      margin-top: auto;
      border-top: 1px solid #f3f4f6;
    }

    .rating {
      font-size: 0.875rem;
      font-weight: 600;
      color: #f59e0b;
    }

    .count {
      font-size: 0.8rem;
      color: #9ca3af;
    }

    .review-btn {
      margin-left: auto;
      font-size: 0.75rem;
      line-height: 28px;
      min-height: 28px;
      padding: 0 0.75rem;
    }
  `]
})
export class ProductCardComponent {
  product = input.required<Product>();
  reviewAdded = output<void>();

  readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  openReviewDialog(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.dialog
      .open(ReviewFormDialogComponent, {
        width: '480px',
        data: { productId: this.product().id, productName: this.product().name },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.reviewAdded.emit();
      });
  }
}
