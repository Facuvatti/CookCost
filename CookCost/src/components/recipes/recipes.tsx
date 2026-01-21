import type {recipe} from "./recipe"
import Recipe from "./recipe";
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