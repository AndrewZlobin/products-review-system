import { Component, inject, signal, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ProductsService, Product } from '../../core/services/products.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { AuthService } from '../../core/services/auth.service';
import { LoginDialogComponent } from '../../shared/login-dialog/login-dialog.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    ProductCardComponent,
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav class="sidenav" mode="side" opened>
        <div class="sidenav-header">
          <span class="sidenav-title">Categories</span>
        </div>
        <mat-divider />
        <mat-nav-list>
          <mat-list-item
            [activated]="selectedCategory === ''"
            (click)="selectCategory('')"
          >
            All
          </mat-list-item>
          @for (cat of categories(); track cat) {
            <mat-list-item
              [activated]="selectedCategory === cat"
              (click)="selectCategory(cat)"
              class="category-item"
            >
              {{ cat }}
            </mat-list-item>
          }
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="content">
        <header class="page-header">
          <h1>Products</h1>
          <div class="header-actions">
            @if (authService.isLoggedIn()) {
              <button mat-button (click)="authService.logout()" matTooltip="Sign out" class="user-btn">
                <mat-icon>account_circle</mat-icon>
                <span class="user-name">{{ authService.userName() }}</span>
              </button>
            } @else {
              <button mat-flat-button (click)="openLoginDialog()">Login</button>
            }
          </div>
        </header>

        @if (loading()) {
          <div class="grid">
            @for (s of skeletons; track s) {
              <div class="skeleton-card">
                <div class="skeleton-img"></div>
                <div class="skeleton-body">
                  <div class="skeleton-line short"></div>
                  <div class="skeleton-line"></div>
                  <div class="skeleton-line medium"></div>
                </div>
              </div>
            }
          </div>
        } @else if (error()) {
          <div class="error-state">
            <p>{{ error() }}</p>
            <button mat-flat-button color="primary" (click)="load()">Retry</button>
          </div>
        } @else if (products().length === 0) {
          <div class="empty-state">
            <p>No products found.</p>
          </div>
        } @else {
          <div class="grid">
            @for (product of products(); track product.id) {
              <app-product-card [product]="product" (reviewAdded)="load()" />
            }
          </div>

          @if (totalPages() > 1) {
            <div class="pagination">
              <button mat-stroked-button [disabled]="page() === 1" (click)="setPage(page() - 1)">← Prev</button>
              <span>Page {{ page() }} of {{ totalPages() }}</span>
              <button mat-stroked-button [disabled]="page() === totalPages()" (click)="setPage(page() + 1)">Next →</button>
            </div>
          }
        }
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .sidenav-container {
      height: 100%;
    }

    .sidenav {
      width: 200px;
      border-right: 1px solid #e5e7eb;
    }

    .sidenav-header {
      padding: 1.25rem 1rem 0.75rem;
    }

    .sidenav-title {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #6b7280;
    }

    .category-item {
      text-transform: capitalize;
    }

    .content {
      padding: 2rem 1.5rem;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 500;
      max-width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    h1 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #111;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.25rem;
    }

    /* Skeleton */
    .skeleton-card {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 1px 6px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .skeleton-img {
      height: 160px;
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }

    .skeleton-body {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .skeleton-line {
      height: 12px;
      border-radius: 4px;
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }

    .skeleton-line.short { width: 40%; }
    .skeleton-line.medium { width: 65%; }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* States */
    .error-state, .empty-state {
      text-align: center;
      padding: 4rem 1rem;
      color: #6b7280;
    }

    .error-state p { color: #dc2626; margin-bottom: 1rem; }

    /* Pagination */
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 2.5rem;
    }

    .pagination span {
      font-size: 0.9rem;
      color: #4b5563;
    }
  `]
})
export class ProductsListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly dialog = inject(MatDialog);
  readonly authService = inject(AuthService);

  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal('');
  page = signal(1);
  totalPages = signal(1);
  categories = signal<string[]>([]);
  selectedCategory = '';

  readonly skeletons = Array(8).fill(0);
  readonly limit = 12;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');

    this.productsService
      .getProducts({
        page: this.page(),
        limit: this.limit,
        category: this.selectedCategory || undefined,
      })
      .subscribe({
        next: (res) => {
          this.products.set(res.items);
          this.totalPages.set(res.totalPages);
          if (!this.selectedCategory) {
            const unique = [...new Set(res.items.map((p) => p.category))].sort();
            if (unique.length) {
              this.categories.set(unique);
            }
          }
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load products. Is the server running?');
          this.loading.set(false);
        },
      });
  }

  openLoginDialog(): void {
    this.dialog.open(LoginDialogComponent, { width: '400px' });
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
    this.page.set(1);
    this.load();
  }

  setPage(p: number): void {
    this.page.set(p);
    this.load();
  }
}
