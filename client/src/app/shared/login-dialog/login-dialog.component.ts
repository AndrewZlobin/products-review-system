import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
  ],
  template: `
    <mat-dialog-content class="dialog-content">
      <mat-tab-group (selectedIndexChange)="onTabChange()" animationDuration="150ms">

        <!-- Sign in tab -->
        <mat-tab label="Sign in">
          <form [formGroup]="loginForm" (ngSubmit)="submitLogin()" id="login-form" class="form">
            <mat-form-field appearance="outline" class="field">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" autocomplete="email" />
              @if (loginForm.controls.email.invalid && loginForm.controls.email.touched) {
                <mat-error>Enter a valid email address</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="field">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" autocomplete="current-password" />
              @if (loginForm.controls.password.invalid && loginForm.controls.password.touched) {
                <mat-error>Password is required</mat-error>
              }
            </mat-form-field>

            @if (loginError()) {
              <p class="server-error">{{ loginError() }}</p>
            }
          </form>
        </mat-tab>

        <!-- Sign up tab -->
        <mat-tab label="Sign up">
          <form [formGroup]="registerForm" (ngSubmit)="submitRegister()" id="register-form" class="form">
            <mat-form-field appearance="outline" class="field">
              <mat-label>Name</mat-label>
              <input matInput type="text" formControlName="name" autocomplete="name" />
              @if (registerForm.controls.name.invalid && registerForm.controls.name.touched) {
                <mat-error>Name is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="field">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" autocomplete="email" />
              @if (registerForm.controls.email.invalid && registerForm.controls.email.touched) {
                <mat-error>Enter a valid email address</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="field">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" autocomplete="new-password" />
              @if (registerForm.controls.password.invalid && registerForm.controls.password.touched) {
                <mat-error>Password must be at least 6 characters</mat-error>
              }
            </mat-form-field>

            @if (registerError()) {
              <p class="server-error">{{ registerError() }}</p>
            }
          </form>
        </mat-tab>

      </mat-tab-group>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close type="button">Cancel</button>
      @if (activeTab() === 0) {
        <button mat-flat-button type="submit" form="login-form" [disabled]="loading()">
          {{ loading() ? 'Signing in…' : 'Sign in' }}
        </button>
      } @else {
        <button mat-flat-button type="submit" form="register-form" [disabled]="loading()">
          {{ loading() ? 'Creating account…' : 'Sign up' }}
        </button>
      }
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content {
      padding-top: 0;
      min-width: 360px;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding-top: 1.25rem;
    }

    .field {
      width: 100%;
    }

    .server-error {
      margin: 0;
      font-size: 0.875rem;
      color: var(--mat-sys-error, #dc2626);
    }
  `]
})
export class LoginDialogComponent {
  private readonly authService = inject(AuthService);
  private readonly dialogRef = inject(MatDialogRef<LoginDialogComponent>);

  loading = signal(false);
  loginError = signal('');
  registerError = signal('');
  activeTab = signal(0);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onTabChange(): void {
    this.activeTab.update(t => (t === 0 ? 1 : 0));
    this.loginError.set('');
    this.registerError.set('');
  }

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.loginError.set('');

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.loading.set(false);
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading.set(false);
        this.loginError.set('Invalid email or password.');
      },
    });
  }

  submitRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.registerError.set('');

    const { name, email, password } = this.registerForm.getRawValue();

    this.authService.register(name!, email!, password!).subscribe({
      next: () => {
        this.loading.set(false);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading.set(false);
        const status = err?.status;
        this.registerError.set(
          status === 409 ? 'An account with this email already exists.' : 'Registration failed. Please try again.'
        );
      },
    });
  }
}
