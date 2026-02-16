import useEntityList from "../hooks/useEntityList";
import * as recipesApi from "../services/recipes"
import * as ingredientsApi  from "../services/ingredients";
import type { RecipeType, RecipeIngredientType } from "../types/recipes";
import Editable from "./editable";
import ListElements from "./listElements";
import { useEffect, useState } from "react";
import { modifyStyle, removeStyle, rowStyle, tdStyle } from "../tailwind";
import type { FieldConfig, WithoutId } from "../types/shared";
export type RecipeComponent = {
    recipe: RecipeType,
    onCreate: (item: WithoutId<RecipeType>) => void,
    onUpdate: (item: RecipeType) => void,
    onDelete: (id: number) => void,
}
export type RecipeIngredientProps = {
    ingredient: RecipeIngredientType,
    onCreate: (item: WithoutId<RecipeIngredientType>) => void,
    onUpdate: (item: RecipeIngredientType) => void,
    onDelete: (id: number) => void,
    options: { value: string; label: string }[],
}

const editRecipe: FieldConfig<RecipeType>[] = [{ kind: "input", name: "name", attributes: {  type: "text", placeholder: "Receta", required: true} }];
function RecipeIngredient({ingredient, onCreate, onUpdate, onDelete, options}: RecipeIngredientProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isDone, done] = useState<boolean | undefined>(undefined)
    options = ingredient.name
  ? [...options, { value: ingredient.id.toString(), label: ingredient.name }]
  : options;
    const editIngredient: FieldConfig<RecipeIngredientType>[] = [
        { kind: "select", name: "id", attributes: {required: true}, options: options }, 
        { kind: "input", name: "quantity", attributes: { type: "text", placeholder: "Cantidad", required: true} }, 
        { kind:"p", name:"unit", attributes: {className:"font-medium text-gray-900 dark:text-white"}, content: ingredient.unit},
    ];
    if(isEditing && !isDone) return (
        <tr className={rowStyle}>
            <td colSpan={3}>
                <Editable<RecipeIngredientType> 
                    initialValues={ingredient}
                    update={onUpdate} 
                    create={onCreate} 
                    fields={editIngredient} 
                    done={()=>done(true)}
                />
            </td>
        </tr>
    )
    if(isDone === true && isEditing) {setIsEditing(false); done(undefined)}
    return (
        <tr className={rowStyle} data-id={ingredient.id}>
            <td className={tdStyle + " font-medium text-gray-900 dark:text-white"}>{ingredient.name}</td>
            <td className={tdStyle + " font-medium text-gray-900 dark:text-white"}>{ingredient.quantity}</td>
            <td className={tdStyle}>{ingredient.unit}</td>
            <td className="px-4 py-3 text-right">      
                <button className={modifyStyle} type="button" onClick={()=>setIsEditing(true)}>✏️</button>
                <button className={removeStyle} type="button" onClick={()=>onDelete(ingredient.id)}>🗑️</button>
            </td>
        </tr>
    )    
}
function Recipe({recipe, onCreate, onUpdate, onDelete}:RecipeComponent) {
    const {
        items:ingredients,
        setItems: setIngredients,
        loading,
        isAdding: addIngredient,
        setIsAdding: setAddIngredient
    } = useEntityList<RecipeIngredientType>({data:recipe.ingredients})
    const [isEditing, setIsEditing] = useState(false)
    const [isDone, done] = useState<boolean | undefined>(undefined)
    const [options, setOptions] = useState<{ value: string; label: string }[]>([])
    useEffect(() => {
        async function getIngredients() { 
           const response = await ingredientsApi.get() 
           const opts = response.map(i => ({
               value: i.id.toString(),
               label: i.name
           }))
           setOptions(opts)
        }
        getIngredients()
    }, [])
    const filteredOptions = options.filter( option =>{
        if (recipe.ingredients) 
        return !recipe.ingredients.some(ing => ing.name != null && ing.name === option.label)
    })
    if(isEditing && !isDone) return (
        <Editable<RecipeType> 
            initialValues={{name:recipe.name}}
            update={onUpdate} 
            create={onCreate} 
            fields={editRecipe} 
            done={()=>done(true)}
        />
    )
    if(isDone === true && isEditing) {setIsEditing(false); done(undefined)}
    return (
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6 transition-all duration-200 hover:shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {recipe.name}
                </h2>

                <div className="flex gap-3">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg shadow transition" type="button" onClick={() => setIsEditing(true)}>✏️</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg shadow transition" type="button" onClick={() => onDelete(recipe.id)}>🗑️</button>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition" onClick={() => setAddIngredient(true)}>+</button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">

                        {!loading &&
                            <ListElements
                                elements={ingredients}
                                setElements={setIngredients}
                                renderElement={(element, onCreate, onUpdate, onDelete) =>
                                    <RecipeIngredient
                                        key={element.id}
                                        ingredient={element}
                                        onCreate={onCreate}
                                        onUpdate={onUpdate}
                                        onDelete={onDelete}
                                        options={filteredOptions}
                                    />
                                }
                                api={{
                                    create: (item)=>recipesApi.createIngredient(item, recipe.id),
                                    update: recipesApi.updateIngredient,
                                    del: recipesApi.deleteIngredient
                                }}
                            />
                        }

                        {addIngredient &&
                            <tr>
                                <td className="py-4">
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <Editable
                                            fields={[
                                                { 
                                                    kind: "select", 
                                                    name: "ingredient", 
                                                    attributes: {required: true}, 
                                                    options: filteredOptions 
                                                }, 
                                                { 
                                                    kind: "input", 
                                                    name: "quantity", 
                                                    attributes: {  type: "text", placeholder: "Cantidad", required: true} }, 
                                            ]}
                                            create={(item)=>recipesApi.createIngredient(item, recipe.id)}
                                            update={recipesApi.updateIngredient}
                                            initialValues={{}}
                                            done={() => setAddIngredient(false)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        }

                    </tbody>
                </table>
            </div>
        </article>
    )
}
function Recipes() {
    const {
        items:recipes,
        setItems: setRecipes,
        loading,
        isAdding: addRecipe,
        setIsAdding: setAddRecipe
    } = useEntityList<RecipeType>({fetchAll:recipesApi.get})
    return (
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors duration-200 max-w-5xl mx-auto mt-10">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
                    Recetas
                </h1>

                <button
                    className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 
                    text-white text-3xl w-14 h-14 rounded-full 
                    flex items-center justify-center 
                    shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => setAddRecipe(true)}
                >
                    +
                </button>
            </div>

            {!loading &&
                <ListElements
                    elements={recipes}
                    setElements={setRecipes}
                    renderElement={(element, onCreate, onUpdate, onDelete) => {
                        return (
                            <Recipe
                                key={element.id}
                                recipe={element}
                                onCreate={onCreate}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                            />
                        )
                    }}
                    api={recipesApi}
                />
            }

            {addRecipe &&
                <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Editable<RecipeType>
                        fields={editRecipe}
                        create={recipesApi.create}
                        update={recipesApi.update}
                        initialValues={{ name: "" }}
                        done={() => setAddRecipe(false)}
                    />
                </div>
            }

        </section>
    )
}
export default Recipes