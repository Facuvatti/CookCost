import Editable from "./editable"
import Ingredient from "./ingredient"
import { getIngredients, deleteIngredient } from "../../services/crud"
import type { IngredientType } from "../../types/ingredients"
import { addIngredientStyle } from "../../tailwind"
import ListElements from "../../utils/listElements"
import useEntityList from "../../hooks/useEntityList"

function Ingredients() {
  const {
    items:ingredients,
    setItems: setIngredients,
    loading,
    isAdding: addIngredient,
    setIsAdding: setAddIngredient,
    updateItem: update
  } = useEntityList<IngredientType>({
    fetchAll: getIngredients
  })
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
                        <ListElements 
                            elements={ingredients} 
                            setElements={setIngredients} 
                            renderElement={(element,update,handleDelete)=>
                                <Ingredient 
                                    key={element.id} 
                                    ingredient={element} 
                                    onUpdate={update} onDelete={handleDelete}
                                />
                            } 
                            onDeleteApi={deleteIngredient}
                        />
                    }
                    {addIngredient && <Editable update={update} create={true} done={setAddIngredient}/>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Ingredients