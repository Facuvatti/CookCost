import httpRequest from "../utils/httpRequest";
import type { IngredientWithoutId } from "../types/ingredients";
export const getIngredients = async () => await httpRequest("ingredients", "GET");
export const deleteIngredient = async (id: number) => await httpRequest(`ingredients/${id}`, "DELETE");
export const updateIngredient = async (id: number, changes: IngredientWithoutId) => await httpRequest(`ingredients/${id}`, "PATCH", changes);
export const createIngredient = async (newIngredient: IngredientWithoutId ) => await httpRequest("ingredients", "POST", newIngredient);