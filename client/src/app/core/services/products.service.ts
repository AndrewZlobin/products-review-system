import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  user: { id: string; name: string };
}

export interface ProductDetail extends Product {
  ratingDistribution: Record<number, number>;
  reviews: Review[];
}

export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  getProducts(params: { page?: number; limit?: number; category?: string } = {}): Observable<ProductsResponse> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.limit) httpParams = httpParams.set('limit', params.limit);
    if (params.category) httpParams = httpParams.set('category', params.category);
    return this.http.get<ProductsResponse>(`${this.apiUrl}/products`, { params: httpParams });
  }

  getProductById(id: string): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.apiUrl}/products/${id}`);
  }
}
