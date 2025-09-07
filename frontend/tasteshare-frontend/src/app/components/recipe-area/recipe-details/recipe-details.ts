// src/app/components/recipe-area/recipe-details/recipe-details.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-details.html',
  styleUrl: './recipe-details.css'
})
export class RecipeDetails {
  recipeId: number;

  constructor(private route: ActivatedRoute) {
    this.recipeId = Number(this.route.snapshot.paramMap.get('id'));
  }
}
