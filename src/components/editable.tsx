import { inputStyle, confirmationStyle } from "../tailwind.tsx";
import { useForm }  from "react-hook-form";
import type { FieldConfig } from "../types/shared.ts";
type EditableProps<T> = {
    create: (item: Omit< T, "id">) => unknown,
    update: (id: number, item: T) => unknown,
    fields: FieldConfig<T>[],
    done: () => void,
    onSuccess?: () => void
}
function Editable<T extends { id?: number }>({ create, update, fields, done, onSuccess}: EditableProps<T>) {
    const {
        register,
        handleSubmit,
    } = useForm<T>({
        mode: "onChange", // Validación en tiempo real
    });
    const onSubmit = async (data: T) => {
        try {
            if (data.id) await update(data.id, data);
            else await create(data);
            done();
            onSuccess?.();
        // No uses window.location.reload() - maneja el estado
        } catch (error) {
        console.error("Error saving:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6">
            {
                fields.map((field) => {
                    switch (field.kind) {
                        case "button":
                            return (
                                <button
                                    key={field.name}
                                    {...field.attributes}
                                />
                            );
                        case "input":
                            return (
                                <input
                                    key={field.name}
                                    {...field.attributes}
                                    {...register(field.name)}
                                    className={inputStyle}
                                />
                            );
                        case "select":
                            return (
                                <select
                                    key={field.name}
                                    {...field.attributes}
                                    {...register(field.name)}
                                    disabled={field.attributes.disabled}
                                >
                                    {field.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            );
                        case "textarea":
                            return (
                                <textarea
                                    key={field.name}
                                    {...field.attributes}
                                    {...register(field.name)}
                                />
                            );
                    } 
                }
                )
            }
            <button type="submit"  className={confirmationStyle + "bg-green-500 hover:bg-green-600 text-white"} >✅</button>
            <button type="button" onClick={done} className={confirmationStyle + "bg-gray-300 hover:bg-gray-400 text-gray-700"}>❌</button>
        </form>
    )
}

export default Editable