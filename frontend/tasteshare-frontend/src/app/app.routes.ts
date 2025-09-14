import { Routes } from '@angular/router';
import { Login } from './components/user-area/login/login';
import { Register } from './components/user-area/register/register';
import { Profile } from './components/user-area/profile/profile';
import { RecipeList } from './components/recipe-area/recipe-list/recipe-list';
import { RecipeFormComponent } from './components/recipe-area/recipe-form/recipe-form';
import { RecipeDetails } from './components/recipe-area/recipe-details/recipe-details';
import { Home } from './components/page-area/home/home';
import { authGuard } from './guards/auth.guard';
import { MyRecipes } from './components/user-area/my-recipes/my-recipes';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile, canActivate: [authGuard] },

  // Recipes area
  { path: 'recipes', component: RecipeList }, // רשימת מתכונים
  {
    path: 'recipes/add',
    component: RecipeFormComponent,
    canActivate: [authGuard],
  }, // הוספה
  {
    path: 'recipes/edit/:id',
    component: RecipeFormComponent,
    canActivate: [authGuard],
  }, // עריכה
  { path: 'recipes/:id', component: RecipeDetails }, // צפייה בפרטי מתכון

  // User area
  { path: 'my-recipes', component: MyRecipes, canActivate: [authGuard] },

  // Catch-all
  { path: '**', redirectTo: 'home' },
];
