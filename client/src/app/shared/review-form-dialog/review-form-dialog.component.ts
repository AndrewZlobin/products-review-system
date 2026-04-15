import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReviewsService } from '../../core/services/reviews.service';

export interface ReviewDialogData {
  productId: string;
  productName: string;
}

@Component({
  selector: 'app-review-form-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>Review "{{ data.productName }}"</h2>

    <mat-dialog-content>
      <div class="rating-row">
        @for (star of stars; track star) {
          <button
            type="button"
            class="star-btn"
            [class.active]="star <= rating()"
            (click)="rating.set(star)"
            [attr.aria-label]="star + ' stars'"
          >★</button>
        }
        @if (rating() === 0) {
          <span class="rating-hint">Select a rating</span>
        }
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Title</mat-label>
        <input matInput [(ngModel)]="title" placeholder="Summarise your experience" maxlength="120" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Review</mat-label>
        <textarea matInput [(ngModel)]="body" placeholder="Tell others what you think" rows="4"></textarea>
      </mat-form-field>

      @if (serverError()) {
        <p class="error">{{ serverError() }}</p>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button
        mat-flat-button
        color="primary"
        [disabled]="!canSubmit() || submitting()"
        (click)="submit()"
      >{{ submitting() ? 'Submitting…' : 'Submit' }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .rating-row {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin-bottom: 1.25rem;
    }

    .star-btn {
      background: none;
      border: none;
      font-size: 1.75rem;
      cursor: pointer;
      color: #d1d5db;
      padding: 0;
      line-height: 1;
      transition: color 0.1s;
    }

    .star-btn.active { color: #f59e0b; }
    .star-btn:hover { color: #f59e0b; }

    .rating-hint {
      font-size: 0.8rem;
      color: #9ca3af;
      margin-left: 0.5rem;
    }

    .full-width { width: 100%; }

    .error {
      color: #dc2626;
      font-size: 0.875rem;
      margin: 0.25rem 0 0;
    }
  `],
})
export class ReviewFormDialogComponent {
  readonly data = inject<ReviewDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ReviewFormDialogComponent>);
  private readonly reviewsService = inject(ReviewsService);

  readonly stars = [1, 2, 3, 4, 5];

  rating = signal(0);
  title = '';
  body = '';
  submitting = signal(false);
  serverError = signal('');

  canSubmit(): boolean {
    return this.rating() > 0 && this.title.trim().length > 0 && this.body.trim().length > 0;
  }

  submit(): void {
    this.submitting.set(true);
    this.serverError.set('');

    this.reviewsService
      .createReview(this.data.productId, {
        rating: this.rating(),
        title: this.title.trim(),
        body: this.body.trim(),
      })
      .subscribe({
        next: (review) => this.dialogRef.close(review),
        error: (err) => {
          this.submitting.set(false);
          if (err?.status === 409) {
            this.serverError.set('You already reviewed this product.');
          } else {
            this.serverError.set('Something went wrong. Please try again.');
          }
        },
      });
  }
}
