export type RecipeIngredient = {
    [key: string]:{
        id: number,
        quantity: number,
    }
}
export interface RecipeType {
    [key: string]: RecipeIngredient[];
}