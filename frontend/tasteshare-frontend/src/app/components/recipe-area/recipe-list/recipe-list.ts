import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 חובה בשביל ngIf/ngFor
import { RecipeService } from '../../../services/recipe.service';
import { RecipeDto } from '../../../models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule], // 👈 תוודא שזה כאן
  templateUrl: './recipe-list.html',
  styleUrls: ['./recipe-list.css']
})
export class RecipeList {
  recipes: RecipeDto[] = [];
  loading = true;
  errorMessage = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.recipeService.getAll().subscribe({
      next: (res) => {
        this.recipes = res;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load recipes.';
        this.loading = false;
      }
    });
  }
}
