import Editable from "./editable"
import Ingredient from "./ingredient"
import { useState, useEffect } from "react"
import { getIngredients, deleteIngredient } from "../../services/ingredients"
import type { IngredientType } from "../../types/ingredients"
import { addIngredientStyle } from "../../tailwind"
import ListElements from "../../utils/listElements"


function IngredientsContainer() {
    const [addIngredient,setAddIngredient] = useState(false)
    const [Ingredients, setIngredients] = useState<IngredientType[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function loadIngredients() {
            const ApiIngredients = await getIngredients()
            setIngredients(ApiIngredients)
            setLoading(false)
        }
        loadIngredients()
    },[])
    function handleUpdate(updated: IngredientType) {
        setIngredients(prev =>
            prev.map(i => i.id === updated.id ? updated : i)
        )
    }
    return (
        <div className="container max-w-4xl mx-auto mb-8">
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
                        <ListElements 
                            elements={Ingredients} 
                            setElements={setIngredients} 
                            renderElement={(element,handleUpdate,handleDelete)=>
                                <Ingredient 
                                    key={element.id} 
                                    ingredient={element} 
                                    onUpdate={handleUpdate} onDelete={handleDelete}
                                />
                            } 
                            onDeleteApi={deleteIngredient}
                        />
                    }
                    {addIngredient && <Editable update={handleUpdate} create={true} done={setAddIngredient}/>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default IngredientsContainer