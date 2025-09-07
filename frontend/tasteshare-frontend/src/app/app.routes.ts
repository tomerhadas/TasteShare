import { Routes } from '@angular/router';
import { Login } from './components/user-area/login/login';
import { Register } from './components/user-area/register/register';
import { Profile } from './components/user-area/profile/profile';
import { RecipeList } from './components/recipe-area/recipe-list/recipe-list';
import { RecipeForm } from './components/recipe-area/recipe-form/recipe-form';
import { RecipeDetails } from './components/recipe-area/recipe-details/recipe-details';
import { Home } from './components/page-area/home/home';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile },
  { path: 'recipes', component: RecipeList },
  { path: 'recipes/:id', component: RecipeDetails },
 { path: 'add-recipe', component: RecipeForm, canActivate: [authGuard] },
   { path: 'home', component: Home }

];
