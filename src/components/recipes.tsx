import { addIngredientButton } from "../tailwind";
export type recipe = {
    name:string;
    addIngredient:()=>void
}

function Recipe({name, addIngredient}:recipe) {
    return (
        <article>
            <h1>{name}</h1>
            <button className={addIngredientButton} onClick={addIngredient}>+</button>
            <table><tbody></tbody></table>
        </article>
    )
}

type props = {
    addRecipe:()=>void;
    recipes:recipe[];
}
function Recipes({addRecipe,recipes}:props) {
    return (
        <section>
            <h1>Recetas</h1>
            <button onClick={addRecipe}>+</button>
            {
                recipes.map((recipe)=>
                    <Recipe 
                        key={recipe.name} 
                        name={recipe.name} 
                        addIngredient={recipe.addIngredient}
                    />
                )
            }

        </section>
    )
}
export default Recipes