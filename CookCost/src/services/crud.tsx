import httpRequest from "../utils/httpRequest";

// Ingredients
import type { IngredientWithoutId, IngredientType } from "../types/ingredients.ts";
export const getIngredients = async ():Promise<IngredientType[]> => await httpRequest("ingredients", "GET");
export const createIngredient = async (newIngredient: IngredientWithoutId ):Promise<IngredientType> => await httpRequest("ingredients", "POST", newIngredient);
export const updateIngredient = async (id: number, changes: IngredientWithoutId):Promise<IngredientType> => await httpRequest(`ingredients/${id}`, "PATCH", changes);
export const deleteIngredient = async (id: number) => await httpRequest(`ingredients/${id}`, "DELETE");

// Recipes
import type { RecipeType, RecipeIngredient } from "../types/recipes.ts";
export const getRecipes = async ():Promise<RecipeType[]> => await httpRequest("recipes", "GET");
export const createRecipe = async (newRecipe: {name: string} ):Promise<unknown> => await httpRequest("recipes", "POST", newRecipe);
export const updateRecipeName = async (id: number, changes: {name: string}):Promise<unknown> => await httpRequest(`recipes/${id}`, "PATCH", changes);
export const deleteRecipe = async (id: number):Promise<unknown> => await httpRequest(`recipes/${id}`, "DELETE");

// Recipe ingredients
export const createRecipeIngredient = async (newRecipeIngredient: RecipeIngredient):Promise<RecipeIngredient> => await httpRequest("recipes/ingredient", "POST", newRecipeIngredient);
export const updateRecipeIngredient = async (id: number, changes: RecipeIngredient):Promise<RecipeIngredient> => await httpRequest(`recipes/ingredient/${id}`, "PATCH", changes);
export const deleteIngredientFromRecipe = async (id:number):Promise<unknown> => await httpRequest(`recipes/ingredient/${id}`, "DELETE");