import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../../services/recipe.service';
import { RecipeDto } from '../../../models/recipe.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink, MatProgressSpinnerModule],
  templateUrl: './my-recipes.html',
  styleUrls: ['./my-recipes.css'],
})
export class MyRecipes implements OnInit {
  recipes: RecipeDto[] = [];
  loading = true;
  errorMessage = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadMyRecipes();
  }

  loadMyRecipes(): void {
    this.recipeService.getMyRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load your recipes.';
        this.loading = false;
        console.error(err);
      },
    });
  }
}
