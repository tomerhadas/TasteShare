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
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TextFieldModule } from '@angular/cdk/text-field';
import { RecipeService } from '../../../services/recipe.service';
import {
  CreateRecipeDto,
  Difficulty,
  FoodType,
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
    MatStepperModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    TextFieldModule,
  ],
  templateUrl: './recipe-form.html',
  styleUrls: ['./recipe-form.css'],
})
export class RecipeFormComponent implements OnInit {
  recipeForm!: FormGroup;
  loading = false;
  isSubmitting = false;
  selectedFiles: { file: File; name: string; preview: string }[] = [];

  // Options for dropdowns
  difficultyOptions = [
    { value: Difficulty.Easy, label: 'Easy', icon: 'star_outline' },
    { value: Difficulty.Medium, label: 'Medium', icon: 'star_half' },
    { value: Difficulty.Hard, label: 'Hard', icon: 'star' },
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
    'זרת',
    'קמצוץ',
    'עד כיסוי',
  ];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.recipeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      servings: [4, [Validators.required, Validators.min(1)]],
      prepMinutes: [15, [Validators.required, Validators.min(1)]],
      cookMinutes: [10, [Validators.required, Validators.min(0)]],
      difficulty: [Difficulty.Easy, [Validators.required]],
      foodType: [FoodType.Parve, [Validators.required]],
      isKosher: [false],
      ingredients: this.fb.array([this.createIngredientGroup()]),
      steps: this.fb.array([this.createStepGroup(1)]),
      images: this.fb.array([]),
    });
  }

  createIngredientGroup() {
    return this.fb.group({
      name: ['', [Validators.required]],
      amount: [1, [Validators.required, Validators.min(0.1)]],
      unit: ['כוסות', [Validators.required]],
    });
  }

  createStepGroup(order: number) {
    return this.fb.group({
      order: [order],
      instruction: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get steps() {
    return this.recipeForm.get('steps') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(this.createIngredientGroup());
  }

  removeIngredient(index: number) {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  addStep() {
    const newOrder = this.steps.length + 1;
    this.steps.push(this.createStepGroup(newOrder));
  }

  removeStep(index: number) {
    if (this.steps.length > 1) {
      this.steps.removeAt(index);
      // Update order numbers
      this.steps.controls.forEach((step, i) => {
        step.get('order')?.setValue(i + 1);
      });
    }
  }

  // Helper methods for template
  getBasicInfoFormGroup(): FormGroup {
    return this.fb.group({
      title: this.recipeForm.get('title'),
      description: this.recipeForm.get('description'),
      servings: this.recipeForm.get('servings'),
      prepMinutes: this.recipeForm.get('prepMinutes'),
      cookMinutes: this.recipeForm.get('cookMinutes'),
      difficulty: this.recipeForm.get('difficulty'),
      foodType: this.recipeForm.get('foodType'),
      isKosher: this.recipeForm.get('isKosher'),
    });
  }

  getIngredientsFormArray(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  getStepsFormArray(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  getDifficultyLabel(value: Difficulty): string {
    const option = this.difficultyOptions.find((opt) => opt.value === value);
    return option ? option.label : '';
  }

  getFoodTypeLabel(value: FoodType): string {
    const option = this.foodTypeOptions.find((opt) => opt.value === value);
    return option ? option.label : '';
  }

  // File handling methods
  onFileSelect(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.selectedFiles.push({
              file: file,
              name: file.name,
              preview: e.target.result,
            });
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit() {
    if (this.recipeForm.valid) {
      this.isSubmitting = true;

      const recipeData: CreateRecipeDto = this.recipeForm.value;
      console.log('Submitting recipe:', recipeData);

      this.recipeService.create(recipeData).subscribe({
        next: (response) => {
          console.log('Recipe created successfully:', response);
          this.snackBar.open('Recipe created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          this.router.navigate(['/recipes']);
        },
        error: (error) => {
          console.error('Error creating recipe:', error);
          this.snackBar.open(
            'Error creating recipe. Please try again.',
            'Close',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            }
          );
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
  }
}
