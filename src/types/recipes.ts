export type RecipeIngredientType = {
    id: number,
    ingredient: number,
    quantity: number,
    name?: string,
    unit?: string
}
export interface RecipeType {
    id: number,
    name: string,
    ingredients?: RecipeIngredientType[]
}