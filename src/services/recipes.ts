import httpRequest from "../utils/httpRequest.ts";
import type { RecipeType, RecipeIngredientType } from "../types/recipes.ts";
export const get = async ():Promise<RecipeType[]> => await httpRequest("recipes", "GET");
export const create = async (item: {name: string} ):Promise<unknown> => await httpRequest("recipes", "POST", item);
export const update = async (changes: {name: string,id: number}):Promise<unknown> => await httpRequest(`recipes/${changes.id}`, "PATCH", changes);
export const del = async (id: number):Promise<unknown> => await httpRequest(`recipes/${id}`, "DELETE");

export const createIngredient = async (item: {ingredient: number, quantity: number},recipe: number):Promise<RecipeIngredientType> => await httpRequest(`recipes/ingredient/${recipe}`, "POST", item);
export const updateIngredient = async (changes: RecipeIngredientType):Promise<RecipeIngredientType> => await httpRequest(`recipes/ingredient/${changes.id}`, "PATCH", changes);
export const deleteIngredient = async (id:number):Promise<unknown> => await httpRequest(`recipes/ingredient/${id}`, "DELETE");