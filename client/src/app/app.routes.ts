import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ProductsListComponent } from './pages/products/products-list.component';
import { ProductDetailComponent } from './pages/products/product-detail.component';

export const routes: Routes = [
  { path: 'products', component: ProductsListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
];
