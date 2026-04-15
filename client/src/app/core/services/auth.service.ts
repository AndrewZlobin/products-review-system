import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
}

function loadStoredUser(): CurrentUser | null {
  const raw = localStorage.getItem('current_user');
  return raw ? (JSON.parse(raw) as CurrentUser) : null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  currentUser = signal<CurrentUser | null>(loadStoredUser());
  isLoggedIn = computed(() => this.currentUser() !== null);
  userName = computed(() => this.currentUser()?.name ?? '');

  login(email: string, password: string): Observable<void> {
    return this.http
      .post<{ access_token: string; user: CurrentUser }>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('current_user', JSON.stringify(res.user));
          this.currentUser.set(res.user);
        }),
        map(() => void 0),
      );
  }

  register(name: string, email: string, password: string): Observable<void> {
    return this.http
      .post(`${this.apiUrl}/auth/register`, { name, email, password })
      .pipe(switchMap(() => this.login(email, password)));
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    this.currentUser.set(null);
  }
}
