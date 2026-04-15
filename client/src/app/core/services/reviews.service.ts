import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from './products.service';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  createReview(
    productId: string,
    body: { rating: number; title: string; body: string },
  ): Observable<Review> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<Review>(`${this.apiUrl}/products/${productId}/reviews`, body, { headers });
  }
}
