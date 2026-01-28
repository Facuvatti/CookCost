// Components
import Editable from "./editable"
import ListElements from "./listElements"
// Hooks
import useEntityList from "../hooks/useEntityList"
import { useState } from "react"
// Tailwind styles
import { modifyStyle, removeStyle, rowStyle, tdStyle, addIngredientStyle  } from "../tailwind"
// Types
import type { IngredientType } from "../types/ingredients"
import type { FieldConfig, WithId, OptionalId } from "../types/shared"
// Services
import * as ingredientsApi from "../services/ingredients"
type IngredientProps = {
    ingredient: WithId<IngredientType>,
    onCreate(item: IngredientType): void
    onUpdate(id: number, item: IngredientType): void,
    onDelete(id: number): void,
}
const form: FieldConfig<IngredientType>[] = [
    { kind: "input", name: "name", attributes: {  type: "text", placeholder: "Ingrediente"} }, 
    { kind: "input", name: "price", attributes: {  type: "text", placeholder: "Precio"} }, 
    { kind: "input", name: "unit", attributes: { type: "text", placeholder: "Unidad"} }, 
];
function Ingredient({ingredient, onCreate, onUpdate, onDelete}: IngredientProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isDone, done] = useState<boolean | undefined>(undefined)

    if(isEditing && !isDone) return (
        <tr className={rowStyle}>
            <td colSpan={3}>
                <Editable<OptionalId<IngredientType>> 
                    update={onUpdate} 
                    create={onCreate} 
                    fields={form} 
                    done={()=>done(true)}
                />
            </td>
        </tr>
    )
    if(isDone === true && isEditing) {setIsEditing(false); done(undefined)}
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

function Ingredients() {
    const {
        items:ingredients,
        setItems: setIngredients,
        loading,
        isAdding: addIngredient,
        setIsAdding: setAddIngredient,
        updateItem
    } = useEntityList<WithId<IngredientType>>({fetchAll:ingredientsApi.get})
    return (
        <div className="max-w-4xl mx-auto mb-8">
            <div className="title bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4 transition-colors duration-200">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">INGREDIENTES</h1>
                    <button onClick={()=>setAddIngredient(true)} className={addIngredientStyle}>+</button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
                <table id="ingredients" className="w-full table-auto mb-4">
                    <tbody>
                    {!loading && 
                        <ListElements<WithId<IngredientType>> 
                            elements={ingredients} 
                            setElements={setIngredients} 
                            renderElement={(element,onCreate,onUpdate,onDelete)=>
                                <Ingredient 
                                    key={element.id} 
                                    ingredient={element} 
                                    onCreate={onCreate}
                                    onUpdate={onUpdate} 
                                    onDelete={onDelete}
                                />
                            } 
                            api={{
                                create: ingredientsApi.create,
                                update: ingredientsApi.update,
                                delete: ingredientsApi.del
                            }}
                        />
                    }
                    {addIngredient && (
                        <tr className={rowStyle}>
                            <td colSpan={3}>
                                <Editable<OptionalId<IngredientType>> 
                                    update={async (id, data) => {
                                        const updated = await ingredientsApi.update(id, data);
                                        updateItem(id,updated);
                                    }}
                                    create={ingredientsApi.create} 
                                    fields={form} 
                                    done={()=>setAddIngredient(false)}
                                />                
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Ingredients