type EntityBase = {
	id?: number
};
export type IngredientType = EntityBase & {
    name: string,
    price: string,
    unit: string,
};