import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { AdminRecipesService } from '../../../services/admin-recipes.service';
import { RecipeDto } from '../../../models/recipe.model';

@Component({
  selector: 'app-admin-recipes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
    RouterLink,
  ],
  templateUrl: './admin-recipes.html',
  styleUrls: ['./admin-recipes.css'],
})
export class AdminRecipes implements OnInit {
  recipes: RecipeDto[] = [];
  loading = false;
  error = '';
  displayedColumns: string[] = [
    'id',
    'title',
    'foodType',
    'difficulty',
    'authorName',
    'viewCount',
    'actions',
  ];

  constructor(
    private adminRecipesService: AdminRecipesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.loading = true;
    this.adminRecipesService.getAllRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'שגיאה בטעינת רשימת המתכונים';
        this.loading = false;
        console.error(err);
      },
    });
  }

  deleteRecipe(recipeId: number): void {
    if (confirm('האם אתה בטוח שברצונך למחוק מתכון זה?')) {
      this.adminRecipesService.deleteRecipe(recipeId).subscribe({
        next: () => {
          this.recipes = this.recipes.filter(
            (recipe) => recipe.id !== recipeId
          );
          this.snackBar.open('המתכון נמחק בהצלחה', 'סגור', {
            duration: 3000,
          });
        },
        error: (err) => {
          this.snackBar.open('שגיאה במחיקת המתכון', 'סגור', {
            duration: 5000,
          });
          console.error(err);
        },
      });
    }
  }

  getFoodTypeLabel(type: string): string {
    switch (type) {
      case 'Meat':
        return 'בשרי';
      case 'Dairy':
        return 'חלבי';
      case 'Parve':
        return 'פרווה';
      default:
        return type;
    }
  }

  getDifficultyLabel(difficulty: string): string {
    switch (difficulty) {
      case 'Easy':
        return 'קל';
      case 'Medium':
        return 'בינוני';
      case 'Hard':
        return 'קשה';
      default:
        return difficulty;
    }
  }

  getFoodTypeClass(type: string): string {
    switch (type) {
      case 'Meat':
        return 'chip-meat';
      case 'Dairy':
        return 'chip-dairy';
      case 'Parve':
        return 'chip-parve';
      default:
        return '';
    }
  }

  getDifficultyClass(difficulty: string): string {
    switch (difficulty) {
      case 'Easy':
        return 'chip-easy';
      case 'Medium':
        return 'chip-medium';
      case 'Hard':
        return 'chip-hard';
      default:
        return '';
    }
  }
}
