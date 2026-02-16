import httpRequest from "../utils/httpRequest.ts";
import type { IngredientType } from "../types/ingredients.ts";
import type { WithId } from "../types/shared.ts";
export const get = async ():Promise<WithId<IngredientType>[]> => await httpRequest("ingredients", "GET");
export const create = async (item: IngredientType ):Promise<IngredientType> => await httpRequest("ingredients", "POST", item);
export const update = async (changes: WithId<IngredientType>):Promise<WithId<IngredientType>> => await httpRequest(`ingredients/${changes.id}`, "PATCH", changes);
export const del = async (id: number) => await httpRequest(`ingredients/${id}`, "DELETE");
