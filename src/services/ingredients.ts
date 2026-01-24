import httpRequest from "../utils/httpRequest.ts";
import type { IngredientType } from "../types/ingredients.ts";
import type { WithId } from "../types/shared.ts";
export const get = async ():Promise<WithId<IngredientType>[]> => await httpRequest("ingredients", "GET");
export const create = async (item: IngredientType ):Promise<IngredientType> => await httpRequest("ingredients", "POST", item);
export const update = async (id: number, changes: IngredientType):Promise<IngredientType & {id: number}> => await httpRequest(`ingredients/${id}`, "PATCH", changes);
export const del = async (id: number) => await httpRequest(`ingredients/${id}`, "DELETE");
