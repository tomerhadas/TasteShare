import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RecipeService } from '../../../services/recipe.service';
import { RecipeDto, Difficulty, FoodType } from '../../../models/recipe.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';


@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './recipe-list.html',
  styleUrls: ['./recipe-list.css'],
})
export class RecipeList {
  recipes: RecipeDto[] = [];
  loading = true;
  errorMessage = '';

  // Filtering
  searchTerm = '';
  selectedDifficulty: Difficulty | null = null;
  difficulties = Object.values(Difficulty);
  selectedFoodType: FoodType | null = null;
  foodTypes = Object.values(FoodType);

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
      },
    });
  }
}
