
function add(e,itemsClass,containerID) {
    e.preventDefault();
    if (document.querySelectorAll("#creating"+"-"+containerID).length == 0) {
        let item = document.createElement("div");
        item.classList.add(itemsClass);
        item.id = "creating"+"-"+containerID;
        let form = document.createElement("form");
        let name = document.createElement("input");
        name.setAttribute("type","text");
        name.setAttribute("placeholder","Nombre");
        name.name = "name";
        let confirm = document.createElement("button");
        confirm.setAttribute("type","submit");
        confirm.textContent = "confirmar";
        form.appendChild(name);
        form.appendChild(confirm);
        item.appendChild(form);
        let container = document.getElementById(containerID)
        container.appendChild(item);
        return form;
    }
}
function addIngredient(e,itemsClass,containerID) {
    let form = add(e,itemsClass,containerID);
    let submit = form.lastChild;
    let unit = document.createElement("input");
    unit.setAttribute("type","text");
    unit.setAttribute("placeholder","Unidad de medida");
    let price = document.createElement("input");
    price.setAttribute("type","text");
    price.setAttribute("placeholder","Precio por unidad");
    unit.name = "unit";
    price.name = "price";
    form.insertBefore(unit,submit);
    form.insertBefore(price,submit);
    form.onsubmit = async (event) => {
        event.preventDefault();
        const result = await httpRequest(event, "http://localhost:3000/", "ingredients", "POST");
        console.log("Ingrediente creado:", result, result.json);
        document.getElementById("creating-"+containerID).remove();
        createItem(itemsClass,result.json,containerID);
    }
}
function addRecipe(e,itemsClass,containerID) {
    let form = add(e,itemsClass,containerID);
    let new_ingredient = document.createElement("button");
    new_ingredient.setAttribute("type","submit");
    new_ingredient.textContent = "+";
    form.appendChild(new_ingredient);
    form.onsubmit = async (event) => {
        event.preventDefault();
        const result = await httpRequest(event, "http://localhost:3000/", "recipes", "POST");
        console.log("Receta creada:", result);
        document.getElementById("creating-"+containerID).remove();
        createItem(itemsClass,result.json,containerID);
    }
}
function createItem(itemsClass,object,containerID) {
    let item = document.createElement("div");
    item.classList.add(itemsClass,"item");
    try{item.id = object.id;}
    catch(e) {e}
    for(let key in object) {
        if (key == "id") continue;
        let h3 = document.createElement("h3");
        if (key == "price" || key == "cost") {h3.textContent = "$" + object[key]} 
        else {h3.textContent = object[key]}
        h3.classList.add(key);
        item.appendChild(h3);
    }
    modify = document.createElement("button");
    modify.textContent = "*";
    modify.onclick
    let remove = document.createElement("button");
    remove.textContent = "X";
    remove.onclick = () => {
        httpRequest(null,"http://localhost:3000/","recipes/"+object.id,"DELETE");
        item.remove();
    }
    item.appendChild(modify);
    item.appendChild(remove);
    let container = document.getElementById(containerID);
    container.appendChild(item);
}
async function httpRequest(event,url,endpoint,method) { // Es un handler para formularios
    let options = {
        method: method,
        headers: {'Content-Type': 'application/json'}
    };
    if (event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        // convertir FormData a objeto plano
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (typeof value === 'string') value = value.toLowerCase();
            data[key] = value.trim();
        }
        options.body = JSON.stringify(data);
        console.log(data);
        form.reset();
    };
    let response = await fetch(url + endpoint, options)
    let json = await response.json();
    return json;
    
}
let recipes = await httpRequest(null,"http://localhost:3000/","recipes","GET")
let ingredients = await httpRequest(null,"http://localhost:3000/","ingredients","GET")

for(let recipe of recipes.values()) {createItem("recipe",recipe,"recipes");}
for(let ingredient of ingredients.values()) {createItem("ingredient",ingredient,"ingredients");}

document.querySelector("#ingredients .add").addEventListener("click", e => {
    addIngredient(e, "ingredient", "ingredients");
});

document.querySelector("#recipes .add").addEventListener("click", e => {
    addRecipe(e, "recipe", "recipes");
});
