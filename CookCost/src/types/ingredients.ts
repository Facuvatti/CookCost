export interface IngredientType {
    id: number; 
    name: string; 
    price: string; 
    unit: string;
};
export type IngredientWithoutId = Omit<IngredientType, "id">
export type IngredientOptionalId = IngredientWithoutId & { id?: number }