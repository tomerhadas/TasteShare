import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TextFieldModule } from '@angular/cdk/text-field';
import { RecipeService } from '../../../services/recipe.service';
import {
  CreateRecipeDto,
  Difficulty,
  FoodType,
  RecipeDto,
} from '../../../models/recipe.model';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    TextFieldModule,
  ],
  templateUrl: './recipe-form.html',
  styleUrls: ['./recipe-form.css'],
})
export class RecipeFormComponent implements OnInit {
  recipeForm!: FormGroup;
  isSubmitting = false;
  recipeId?: number;
  isEditMode = false;

  difficultyOptions = [
    { value: Difficulty.Easy, label: 'Easy' },
    { value: Difficulty.Medium, label: 'Medium' },
    { value: Difficulty.Hard, label: 'Hard' },
  ];

  foodTypeOptions = [
    { value: FoodType.Meat, label: 'Meat' },
    { value: FoodType.Dairy, label: 'Dairy' },
    { value: FoodType.Parve, label: 'Parve' },
  ];

  unitOptions = [
    'כוסות',
    'כפות',
    'כפיות',
    'גרם',
    'קילוגרם',
    'מיליליטר',
    'ליטר',
    'יחידות',
    'קמצוץ',
  ];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initializeForm();

    this.recipeId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.recipeId && !isNaN(this.recipeId)) {
      this.isEditMode = true;
      this.recipeService.getById(this.recipeId).subscribe({
        next: (recipe) => this.populateForm(recipe),
        error: () =>
          this.snackBar.open('Failed to load recipe', 'Close', { duration: 3000 }),
      });
    }
  }

  initializeForm() {
    this.recipeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      servings: [4, [Validators.required, Validators.min(1)]],
      prepMinutes: [15, [Validators.required, Validators.min(1)]],
      cookMinutes: [10, [Validators.required, Validators.min(0)]],
      difficulty: [Difficulty.Easy, Validators.required],
      foodType: [FoodType.Parve, Validators.required],
      isKosher: [false],
      ingredients: this.fb.array([this.createIngredientGroup()]),
      steps: this.fb.array([this.createStepGroup(1)]),
    });
  }

  createIngredientGroup() {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(0.1)]],
      unit: ['כוסות', Validators.required],
    });
  }

  createStepGroup(order: number) {
    return this.fb.group({
      order: [order],
      instruction: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get steps(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(this.createIngredientGroup());
  }

  removeIngredient(index: number) {
    if (this.ingredients.length > 1) this.ingredients.removeAt(index);
  }

  addStep() {
    const newOrder = this.steps.length + 1;
    this.steps.push(this.createStepGroup(newOrder));
  }

  removeStep(index: number) {
    if (this.steps.length > 1) {
      this.steps.removeAt(index);
      this.steps.controls.forEach((step, i) =>
        step.get('order')?.setValue(i + 1)
      );
    }
  }

  populateForm(recipe: RecipeDto) {
    this.recipeForm.patchValue({
      title: recipe.title,
      description: recipe.description,
      servings: recipe.servings,
      prepMinutes: recipe.prepMinutes,
      cookMinutes: recipe.cookMinutes,
      difficulty: recipe.difficulty,
      foodType: recipe.foodType,
      isKosher: recipe.isKosher,
    });

    this.ingredients.clear();
    recipe.ingredients.forEach((ing) =>
      this.ingredients.push(
        this.fb.group({
          name: [ing.name, Validators.required],
          quantity: [ing.quantity, [Validators.required, Validators.min(0.1)]],
          unit: [ing.unit, Validators.required],
        })
      )
    );

    this.steps.clear();
    recipe.steps.forEach((step) =>
      this.steps.push(
        this.fb.group({
          order: [step.order],
          instruction: [step.instruction, Validators.required],
        })
      )
    );
  }

  onSubmit() {
    if (this.recipeForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.isSubmitting = true;
    const recipeData: CreateRecipeDto = this.recipeForm.value;

    if (this.isEditMode && this.recipeId) {
      this.recipeService.update(this.recipeId, recipeData).subscribe({
        next: () => {
          this.snackBar.open('Recipe updated successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/my-recipes']);
        },
        error: (err) => {
          console.error('Error updating recipe:', err);
          let errorMsg = 'Error updating recipe.';

          if (err.message) errorMsg = err.message;
          else if (err.status === 405) errorMsg = 'The API does not allow updating recipes.';
          else if (err.status === 401) errorMsg = 'You must be logged in.';
          else if (err.status === 403) errorMsg = 'You do not have permission to update this recipe.';

          this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
        },
        complete: () => (this.isSubmitting = false),
      });
    } else {
      this.recipeService.create(recipeData).subscribe({
        next: () => {
          this.snackBar.open('Recipe created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/recipes']);
        },
        error: () => {
          this.snackBar.open('Error creating recipe.', 'Close', { duration: 3000 });
        },
        complete: () => (this.isSubmitting = false),
      });
    }
  }
}
