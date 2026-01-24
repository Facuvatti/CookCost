import httpRequest from "../utils/httpRequest.ts";
import type { RecipeType, RecipeIngredient } from "../types/recipes.ts";

export const get = async ():Promise<RecipeType[]> => await httpRequest("recipes", "GET");
export const create = async (item: {name: string} ):Promise<unknown> => await httpRequest("recipes", "POST", item);
export const update = async (id: number, changes: {name: string}):Promise<unknown> => await httpRequest(`recipes/${id}`, "PATCH", changes);
export const del = async (id: number):Promise<unknown> => await httpRequest(`recipes/${id}`, "DELETE");

export const createIngredient = async (item: RecipeIngredient):Promise<RecipeIngredient> => await httpRequest("recipes/ingredient", "POST", item);
export const updateIngredient = async (id: number, changes: RecipeIngredient):Promise<RecipeIngredient> => await httpRequest(`recipes/ingredient/${id}`, "PATCH", changes);
export const deleteIngredient = async (id:number):Promise<unknown> => await httpRequest(`recipes/ingredient/${id}`, "DELETE");