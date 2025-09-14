import { Routes } from '@angular/router';
import { Login } from './components/user-area/login/login';
import { Register } from './components/user-area/register/register';
import { Profile } from './components/user-area/profile/profile';
import { RecipeList } from './components/recipe-area/recipe-list/recipe-list';
import { RecipeFormComponent } from './components/recipe-area/recipe-form/recipe-form';
import { RecipeDetails } from './components/recipe-area/recipe-details/recipe-details';
import { Home } from './components/page-area/home/home';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'recipes', component: RecipeList },
  { path: 'recipes/:id', component: RecipeDetails },
  {
    path: 'add-recipe',
    component: RecipeFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'edit-recipe/:id',
    component: RecipeFormComponent,
    canActivate: [authGuard],
  },
  { path: 'my-recipes', component: RecipeList, canActivate: [authGuard] },
  // Admin route to be implemented later
  // { path: 'admin', loadChildren: () => import('./components/admin-area/admin.routes').then(m => m.ADMIN_ROUTES), canActivate: [adminGuard] },
  { path: '**', redirectTo: 'home' },
];
