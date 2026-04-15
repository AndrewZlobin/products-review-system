import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="login-wrapper">
      <form class="login-card" (ngSubmit)="onSubmit()">
        <h1>Sign in</h1>

        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            [(ngModel)]="email"
            name="email"
            placeholder="you@example.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            [(ngModel)]="password"
            name="password"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        @if (error()) {
          <p class="error">{{ error() }}</p>
        }

        <button type="submit" [disabled]="loading()">
          {{ loading() ? 'Signing in…' : 'Sign in' }}
        </button>

        <p class="footer">
          No account? <a routerLink="/register">Register</a>
        </p>
      </form>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    }

    .login-card {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 2.5rem 2rem;
      width: 100%;
      max-width: 380px;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #111;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #444;
    }

    input {
      padding: 0.625rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.15s;
    }

    input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }

    .error {
      margin: 0;
      font-size: 0.875rem;
      color: #dc2626;
    }

    button {
      padding: 0.65rem;
      background: #6366f1;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s;
    }

    button:hover:not(:disabled) {
      background: #4f46e5;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .footer {
      margin: 0;
      text-align: center;
      font-size: 0.875rem;
      color: #666;
    }

    .footer a {
      color: #6366f1;
      text-decoration: none;
    }

    .footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private router: Router) {}

  onSubmit(): void {
    this.error.set('');
    this.loading.set(true);

    // TODO: replace with real auth service call
    setTimeout(() => {
      this.loading.set(false);
      this.error.set('Invalid email or password.');
    }, 800);
  }
}
