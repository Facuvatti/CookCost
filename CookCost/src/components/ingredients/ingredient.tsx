import { modifyStyle, removeStyle, rowStyle, tdStyle } from "../../tailwind"
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
        <tr className={rowStyle} data-id={ingredient.id}>
            <td className={tdStyle + " font-medium text-gray-900 dark:text-white"}>{ingredient.name}</td>
            <td className={tdStyle + " font-medium text-gray-900 dark:text-white"}>{ingredient.price}</td>
            <td className={tdStyle}>{ingredient.unit}</td>
            <td className="px-4 py-3 text-right">      
                <button className={modifyStyle} type="button" onClick={()=>setIsEditing(true)}>✏️</button>
                <button className={removeStyle} type="button" onClick={()=>onDelete(ingredient.id)}>🗑️</button>
            </td>
        </tr>
    )
}

export default Ingredient