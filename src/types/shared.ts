import  React  from "react";
import type { Path } from "react-hook-form";
type BaseField<T> = {
    name: Path<T>;
    label?: string;
}
type InputField<T> = BaseField<T> & {
    kind: "input";
    attributes: React.InputHTMLAttributes<HTMLInputElement>;
}
type TextAreaField<T> = BaseField<T> & {
    kind: "textarea";
    attributes: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
} 
type SelectField<T> = BaseField<T> & {
    kind: "select";
    attributes: React.SelectHTMLAttributes<HTMLSelectElement>;
    options: { value: string | number; label: string }[];
} 
type ButtonField<T> = BaseField<T> & {
    kind: "button";
    attributes: React.ButtonHTMLAttributes<HTMLButtonElement>;
} 

export type FieldConfig<T> =
    | InputField<T>
    | TextAreaField<T>
    | SelectField<T>
    | ButtonField<T>;
export type WithId<T> = T & { id: number }
export type WithoutId<T> = Omit<T, "id">
export type OptionalId<T> = T & { id?: number }