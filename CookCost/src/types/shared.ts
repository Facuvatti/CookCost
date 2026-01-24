export type InputConfig<T> = {
    name: keyof T,
    placeholder : string,
    type: "text" | "number",
}
export type WithId<T> = T & { id: number }
export type WithoutId<T> = Omit<T, "id">
export type OptionalId<T> = T & { id?: number }