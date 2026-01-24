import { addIngredientButton } from "../../tailwind";
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

export default Recipe