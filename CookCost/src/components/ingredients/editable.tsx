import { useState } from "react";
import type { IngredientOptionalId, IngredientType } from "../../types/ingredients.ts";
import { inputStyle, confirmationStyle, rowStyle } from "../../tailwind.tsx";
import { updateIngredient, createIngredient } from "../../services/crud.tsx";
import type { Dispatch, SetStateAction } from "react";
type EditableProps<T> = {
    ingredient?: T,
    update: (item: <T extends {id: number}>) => void,
    create?: boolean,
    done: Dispatch<SetStateAction<boolean>>
}

function Editable<T>({ingredient, update, done,create=false}: EditableProps<T>) {
    const [form, setForm] = useState<T>(undefined as T)
    const [isSaving, setIsSaving] = useState(false)
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target 

        setForm(prev => ({
            ...prev,
            [name]: name === "price" ? Number(value) : value // `[name]:` eso es la clave que va a guardar. `name === "price"` es la condición del operador ternario (condicion?true:false).
        }))
    }
    async function handleSave() {
        try {
            let updated: IngredientType | undefined = undefined;
            setIsSaving(true)
            if(create) updated = await createIngredient(form)
            else if(ingredient?.id) updated = await updateIngredient(ingredient.id, form)
            console.log(updated);
            if(updated) update(updated)
            else console.error("No se pudo guardar el ingrediente")
        } finally {
            if(create) done(false);
            else done(true)
            setIsSaving(false)
            window.location.reload()
        }
    }
    return (
        <tr className={rowStyle}>
            <td colSpan={3}>
                <form onSubmit={async(e)=>{e.preventDefault(); await handleSave()}} className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <input className={inputStyle} type="text" name="name" placeholder="Nombre" value={form.name} onChange={(e)=>handleChange(e)}></input>
                    <input className={inputStyle} type="text" name="price" placeholder="Precio" value={form.price} onChange={(e)=>handleChange(e)}></input>
                    <input className={inputStyle} type="text" name="unit" placeholder="Unidad" value={form.unit} onChange={(e)=>handleChange(e)}></input>
                    <button type="submit"  className={confirmationStyle + "bg-green-500 hover:bg-green-600 text-white"}  disabled={isSaving}>✅</button>
                    <button type="button" onClick={()=>{if(create) done(false); else done(true) }} className={confirmationStyle + "bg-gray-300 hover:bg-gray-400 text-gray-700"}  disabled={isSaving}>❌</button>
                </form>
            </td>
        </tr>
    )
}

export default Editable