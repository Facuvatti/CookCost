import { useState } from "react";
import { inputStyle, confirmationStyle, rowStyle } from "../tailwind.tsx";
import type { Dispatch, SetStateAction } from "react";
import type { FieldConfig } from "../types/shared.ts";
type EditableProps<T> = {
    initialValue: T,
    create: (item: Omit< T, "id">) => unknown,
    update: (id: number, item: T) => unknown,
    fields: FieldConfig<T>[],
    done: Dispatch<SetStateAction<boolean>>
}
function Editable<T extends { id?: number }>({initialValue, create, update, fields, done}: EditableProps<T>) {
    const [form, setForm] = useState<T>(initialValue)
    const [isSaving, setIsSaving] = useState(false)
    function handleChange<K extends keyof T>(key: K, value: T[K]) {
        setForm(prev => ({
        ...prev,
        [key]: value
        }))
    }
    async function handleSave() {
        try {
            setIsSaving(true)
            if(form.id) {
                await update(form.id, form)
            } 
            else await create(form);

        } finally {
            if(form.id) done(false); else done(true);
            setIsSaving(false)
            window.location.reload()
        }
    }
    return (
        <tr className={rowStyle}>
            <td colSpan={3}>
                <form onSubmit={async(e)=>{e.preventDefault(); await handleSave()}} className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6">
                    {fields.map(field => (
                        <input
                            className={inputStyle}
                            key={String(field.name)}
                            type={field.type ?? "text"}
                            value={String(form[field.name] ?? "")}
                            placeholder={field.placeholder}
                            onChange={e =>
                                handleChange(
                                field.name,
                                field.type === "number"
                                    ? Number(e.target.value) as T[keyof T]
                                    : e.target.value as T[keyof T]
                                )
                            }
                        />
                    ))}         
                    <button type="submit"  className={confirmationStyle + "bg-green-500 hover:bg-green-600 text-white"}  disabled={isSaving}>✅</button>
                    <button type="button" onClick={()=>{if(form.id)  done(false); else done(true); }} className={confirmationStyle + "bg-gray-300 hover:bg-gray-400 text-gray-700"}  disabled={isSaving}>❌</button>
                </form>
            </td>
        </tr>
    )
}

export default Editable