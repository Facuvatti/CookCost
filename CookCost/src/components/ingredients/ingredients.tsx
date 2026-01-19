import Editable from "./editable"
import Ingredient from "./ingredient"
import { useState, useEffect } from "react"
import { getIngredients, deleteIngredient } from "../../Services/ingredients"
import type { IngredientType } from "../../types/ingredients"
type Props = {
    ingredients: IngredientType[],
    setIngredients: React.Dispatch<React.SetStateAction<IngredientType[]>>
}
function IngredientsList({ingredients, setIngredients}: Props) {
  function handleUpdate(updated: IngredientType) {
    setIngredients(prev =>
      prev.map(i => i.id === updated.id ? updated : i)
    )
  }

  function handleDelete(id: number) {
    setIngredients(prev =>
      prev.filter(i => i.id !== id)
    )
    deleteIngredient(id)
  }

  return ingredients.map(i => (
    <Ingredient
      key={i.id}
      ingredient={i}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  ))
}
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
                    <button onClick={()=>setAddIngredient(true)} className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold text-2xl w-12 h-12 rounded-full transition-colors duration-200 shadow-md">+</button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
                <table id="ingredients" className="w-full table-auto">
                    <tbody>
                    {!loading && <IngredientsList ingredients={Ingredients} setIngredients={setIngredients}/>}
                    {addIngredient && <Editable update={handleUpdate} create={true} done={setAddIngredient}/>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default IngredientsContainer