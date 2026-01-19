import type { IngredientOptionalId, IngredientType } from "../../types/ingredients"
import Editable from "./editable"
import { useState } from "react"
type Props = {
    ingredient: IngredientType,
    onDelete(id: number): void,
    onUpdate(ingredient: IngredientOptionalId): void
}

function Ingredient({ingredient, onUpdate, onDelete}: Props) {
    const [isEditing, setIsEditing] = useState(false)
    const [isDone, done] = useState(false)
    if(isEditing && !isDone) return <Editable ingredient={ingredient} update={onUpdate} create={false} done={done}/>
    if(isDone === true) setIsEditing(false);
    return (
        <tr data-id={ingredient.id}>
            <td>{ingredient.name}</td>
            <td>{ingredient.price}</td>
            <td>{ingredient.unit}</td>
            <td>      
                <button type="button" onClick={()=>setIsEditing(true)}>✏️</button>
                <button type="button" onClick={()=>onDelete(ingredient.id)}>🗑️</button>
            </td>
        </tr>
    )
}

export default Ingredient