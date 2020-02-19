import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Ingredient } from '../shared/Ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService implements OnInit {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe('Tasty Schnitzel', 'A super tasty Schnitzel -just awesome!',
    //  'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
    'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
      [new Ingredient('Meat',5),new Ingredient('French Fries',20)]),
    new Recipe('Big Fat Burger', 'What else do you need to stay?',
     'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
     [new Ingredient('Meat',1),new Ingredient('Buns',2)]),
  ];
  constructor(private slService: ShoppingListService) { }
  getRecipes() {
    return this.recipes.slice(); //to always get a copy
  }
  ngOnInit() {

  }

  addIngredientsToShoppingList(ingredient:Ingredient[]){
    this.slService.addIngredients(ingredient);
  }
}
