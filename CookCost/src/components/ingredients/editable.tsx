import { useState } from "react";
import type { IngredientOptionalId, IngredientType } from "../../types/ingredients.ts";
import { updateIngredient, createIngredient } from "../../Services/ingredients.ts";
import type { Dispatch, SetStateAction } from "react";
type IngredientFormProps = {
    ingredient?: IngredientOptionalId,
    update: (ingredient: IngredientType) => void,
    create?: boolean,
    done: Dispatch<SetStateAction<boolean>>
}

function Editable({ingredient, update, done,create=false}: IngredientFormProps) {
    if( ingredient === undefined ) ingredient = { name: "", price: "", unit: "" }
    const [form, setForm] = useState<IngredientOptionalId>(ingredient)
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
            if(updated) update(updated)
            else console.error("No se pudo guardar el ingrediente")
        } finally {
            setIsSaving(false)
            if(create) {done(false);}
            else done(true)
        }
    }
    return (
        <tr>
            <td colSpan={3}>
                <form>
                    <input type="text" name="name" placeholder="Nombre" value={form.name} onChange={(e)=>handleChange(e)}></input>
                    <input type="text" name="price" placeholder="Precio" value={form.price} onChange={(e)=>handleChange(e)}></input>
                    <input type="text" name="unit" placeholder="Unidad" value={form.unit} onChange={(e)=>handleChange(e)}></input>
                    <button type="submit" onSubmit={()=>handleSave} disabled={isSaving}>✅</button>
                    <button type="button" onClick={()=>done} disabled={isSaving}>❌</button>
                </form>
            </td>
        </tr>
    )
}

export default Editable