function createForm(e,containerID,action="creating",add_method="append",insertBefore="",onlyOne=true) {
    e.preventDefault();
    if (document.querySelectorAll("."+action+"-"+containerID).length == 0 || !onlyOne) {
        let form = document.createElement("form");

        form = confirmation(form);
        let container = document.getElementById(containerID)
        if(container.tagName == "TABLE") {
            let tr = document.createElement("tr");
            let td = document.createElement("td")
            tr.classList.add(action+"-"+containerID);
            tr.append(td);
            td.append(form);
            container.append(td);

        } else {
            if(add_method == "append") container.append(form);
            if(add_method == "prepend") container.prepend(form);
            if(add_method == "insertBefore") container.insertBefore(form,insertBefore);
            form.classList.add(action+"-"+containerID);            
        }
        return form;
    }
}
function createSelection(options,selections,select=undefined) {
    if (select == undefined) {
        select = document.createElement("select");
    }
    for (let option of options) {
        if(selections.includes(option.id)) continue;
        let op = document.createElement("option");
        op.value = option.id;
        op.textContent = option.name;
        select.append(op);
    }
    return select;
}
function confirmation(form) {
    let div = document.createElement("div");
    div.classList.add("confirmation");
    let confirm = document.createElement("button");
    confirm.setAttribute("type","submit");
    confirm.textContent = "confirmar";
    let cancel = document.createElement("button");
    cancel.setAttribute("type","button");
    cancel.textContent = "cancelar";
    cancel.onclick = () => {
        form.remove();
    }
    div.append(confirm,cancel);
    form.append(div);
    return form
}
function createInput(name,placeholder) {
    let input = document.createElement("input");
    if(placeholder == undefined) placeholder = name;
    input.setAttribute("type","text");
    input.setAttribute("placeholder",placeholder);
    input.name = name;
    return input;
}
function formResult(event) {
    event.preventDefault();
    const form = event.target;
    for(let element of form.elements) {
        if(!["BUTTON","INPUT"].includes(element.tagName)) form.remove(element);
    }
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
        if (typeof value === 'string') value = value.toLowerCase();
        data[key] = value.trim();
    }
    form.reset();
    console.log("Form Result:", data);
    return data 
}
function addIngredient(e,containerID) {
    let form = createForm(e,containerID);
    let name = createInput("name","Nombre");
    let price = createInput("price","Precio");
    let unit = createInput("unit","Unidad")
    form.prepend(name,price,unit);
    form.onsubmit = async (event) => {
        const result = await httpRequest(event, "http://localhost:3000/", "ingredients", "POST");
        document.getElementById("creating-"+containerID).remove();
        makeRow(result,containerID);
    }
    
}
function selected(select){
    let selection = select.options[select.selectedIndex]
    return selection
}
function addRecipe(e,containerID) {
    let form = createForm(e,containerID);
    let name = createInput("name","Nombre");
    let new_ingredient = document.createElement("button");
    let buttons = document.querySelector("#creating-recipes > .confirmation")
    buttons.prepend(new_ingredient);
    new_ingredient.textContent = "+";
    new_ingredient.classList.add("add");
    let i = 1;
    let selections = [];
    
    new_ingredient.onclick = async (event) => {
        event.preventDefault();
        let last_div;
        if(i > 1) {
            let p = document.createElement("p");
            p.style = "margin: 10px;";
            p.textContent = capitalize(p.textContent);
            let last_select = document.getElementById(String(i-1));
            console.log(last_select);
            let selection = selected(last_select);
            selections.push(selection.value);
            p.textContent = selection.textContent;
            last_select.replaceWith(p);
        }
        
        let div = document.createElement("div");
        div.classList.add("ingredient");
        let select = document.createElement("select");
        select.id = i;
        const ingredients = await httpRequest(null,"http://localhost:3000/","ingredients","GET");
        let rest= ingredients.length -selections.length
        console.log(rest);
        if(rest == 1) {new_ingredient.remove();last_div = div;}
        if(rest == 0) {return;}
        
        for (let ingredient of ingredients) {
            if(selections.includes(String(ingredient.id))) continue;
            let option = document.createElement("option");
            option.value = ingredient.id;
            option.textContent = ingredient.name;
            select.append(option);
           
        }

        let selection_id = selected(select).value;
        let quantity = createInput("quantity","Cantidad");
        quantity.setAttribute("row",selection_id);
        let unit = document.createElement("p");
        let selected_row = ingredients.find(ingredient => ingredient.id == selection_id);
        unit.textContent = selected_row.unit;   
        select.onchange = () => {
            let selection_id = selected(select).value;
            let selected_row = ingredients.find(ingredient => ingredient.id == selection_id);
            unit.textContent = selected_row.unit;          
        }
        div.append(select,quantity,unit);
        form.insertBefore(div,buttons);

        form.onsubmit = async (event) => {
            event.preventDefault();
            document.getElementById("creating-"+containerID).remove();
            for(let selection of selections) {
                let quantity = document.querySelector('input[row="'+selection+'"]').value;
                let result =await httpRequest(null, "http://localhost:3000/", "recipe/", "POST",{name:name,ingredient: selection,quantity: quantity });
                console.log("recipe post:",result);
            }     
        }
        i++;
    }
    form.prepend(name);
    form.onsubmit = async (event) => {
        event.preventDefault();
        const result = await httpRequest(event, "http://localhost:3000/", "recipes", "POST");
        const recipe_id = result.id;
        name.remove();
        let p = document.createElement("p");
        p.textContent = capitalize(result.name);
        p.style = "margin: 10px;border: 1px solid black;font-size: 20px;padding: 5px;";
        form.prepend(p,new_ingredient);
    }
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function makeRow(row,containerID,db_table=undefined) {
    let tr = document.createElement("tr");
    if(db_table == undefined) db_table = containerID;
    try{tr.id = "r"+row.id;}
    catch(e) {e}
    for(let column in row) {
        if (column == "id") continue;
        let td = document.createElement("td");
        let cell = row[column];
        if(column == "name") cell = capitalize(cell);
        td.textContent = cell;
        if (column == "price" || column == "cost") td.textContent = "$" + cell;
        td.classList.add(column);
        tr.appendChild(td);
    }
    let modify = document.createElement("button");
    modify.textContent = "*";
    modify.onclick = () => {
        const tr = document.querySelector("#"+containerID+" > #r"+row.id);
        let form = document.createElement("form");
        let td_form = document.createElement("td");
        form.id = row.id;
        form.style= "display: flex; flex-direction: row;";
        for(let td of tr.cells)  {

            if(td.classList.contains("name")) {
                let name = document.createElement("p");
                name.textContent = td.textContent;
                name.style = "margin: 10px;";
                form.append(name);
                continue
            }
            if(td.tagName == "BUTTON") continue;
            let input = document.createElement("input");
            input.name=td.classList[0];
            input.setAttribute("type","text");
            if(td.classList.contains("price") || td.classList.contains("cost")) td.textContent = td.textContent.slice(1);
            input.value = td.textContent;
            form.append(input);
        }
        let confirm = document.createElement("button");
        confirm.setAttribute("type","submit");
        confirm.textContent = "Confirmar";
        form.append(confirm);
        let cancel = document.createElement("button");
        cancel.setAttribute("type","button");
        cancel.textContent = "Cancelar";
        cancel.onclick = () => {
            td_form.remove();
            // Agregar algo
        }
        form.append(cancel);
        
        form.onsubmit = async (event) => {
            event.preventDefault();
            const result = await httpRequest(event,"http://localhost:3000/",db_table+"/"+row.id,"PATCH");
            form.remove();
            row.price = result.price;
            row.unit = result.unit;
            tr.remove();
            makeRow(row,containerID,db_table);
            console.log("Modificado:", result);
        }
        td_form.append(form);
        // Agregar algo
        tr.append(td_form);
        // Agregar algo
    }
    let remove = document.createElement("button");
    remove.textContent = "x";
    remove.onclick = () => {
        if(row.id == undefined) row.id = row.name;
        if(db_table == "recipe" || db_table == "recipes") {
            httpRequest(null,"http://localhost:3000/recipe/",+containerID+"/"+row.id,"DELETE");
        }
        httpRequest(null,"http://localhost:3000/",db_table+"/"+row.id,"DELETE");
        tr.remove();
    }
    tr.append(modify);
    tr.append(remove);
    let container = document.getElementById(containerID);
    container.append(tr);
}

async function httpRequest(event,url,endpoint,method,body) { // Es un handler para formularios
    let options = {
        method: method,
        headers: {'Content-Type': 'application/json'}
    };
    if (event) {
        let data = formResult(event);
        options.body = JSON.stringify(data);
    };
    if (body) options.body = JSON.stringify(body);
    let response = await fetch(url + endpoint, options)
    try {let json = await response.json();return json;} catch(e) {console.log(e,response);}
    
    
}

// Obteniendo los datos de cada tabla
let recipes = await httpRequest(null,"http://localhost:3000/","recipes/name","GET")
let ingredients = await httpRequest(null,"http://localhost:3000/","ingredients","GET")

// Agregando las recetas a su contenedor en la interfaz grafica
try {
    for(let name of recipes.values()) {
        name = name.name.replace(/%20/g, ' ');
        let recipe_ingredients = await httpRequest(null,"http://localhost:3000/","recipe/"+name,"GET");
        console.log("Recipe:", recipe_ingredients);
        
        let recipe_div = document.createElement("div");
        recipe_div.id = "recipe-"+name.replace(/ /g,"-");
        recipe_div.classList.add("recipe");
        
        let buttons = document.createElement("div");
        buttons.style = "display: flex; flex-direction: row;align-items:center;";
        
        let h2_name = document.createElement("h2");
        h2_name.textContent = name;
        
        let table = document.createElement("table");
        table.id = name.replace(/ /g,"-");
        
        let h3_total = document.createElement("h3");
        h3_total.style.fontWeight = "normal";
        
        let db_ingredients = Array.from(recipe_ingredients.map((ingredient) => ingredient.id))
        let selections = db_ingredients;
        let i = 1;
        
        let newIngredient = document.createElement("button");
        newIngredient.textContent = "+";
        newIngredient.onclick = async (event) => {     
            event.preventDefault();
            let last_div;
            
            // Si se "confirma" la selección, se reemplaza la etiqueta de selección por una de texto
            
            // Creando la selección del ingrediente para la receta
            let div = document.createElement("div");
            div.classList.add("ingredient");

            // Buscando los ingredientes disponibles para agregar a la receta
            const ingredients = await httpRequest(null,"http://localhost:3000/","ingredients","GET");
            
            // Restando los ingredientes que ya fueron seleccionados y si ya se seleccionaron todos no se puede agregar ninguno mas
            let rest = ingredients.length -selections.length
            if(rest == 0) {return;}
            
            // Agregando los ingredientes disponibles a la selección
            name = name.replace(/ /g,"-");
            const recipe_container = document.getElementById("recipe-"+name);
            let form = createForm(event,"recipe-"+name,"modifiying","insertBefore",recipe_container.lastChild,false);          
            let select = createSelection(ingredients,selections); 
            select.id = i;           
            let selection_id = selected(select).value;
            
            // Creando la cantidad y unidad del ingrediente
            let quantity = createInput("quantity","Cantidad");
            quantity.setAttribute("row",selection_id);
            let unit = document.createElement("p");

            // Estableciendo la unidad del ingrediente seleccionado dinamicamente
            let selected_row = ingredients.find(ingredient => ingredient.id == selection_id);
            unit.textContent = selected_row.unit;   
            select.onchange = () => {
                let selection_id = selected(select).value;
                let selected_row = ingredients.find(ingredient => ingredient.id == selection_id);
                unit.textContent = selected_row.unit;          
            }
            // Agregando las entradas al formulario dentro de un div
            div.append(select,quantity,unit);
            form.prepend(div);
            
            // Al confirmar la selección se agrega el ingrediente a la receta en la base de datos y se limpia el formulario
            let j = 0;
            form.onsubmit = async (event) => {
                event.preventDefault();
                console.log("Confirmado");
                console.log(j);
                if (j == 0) {
                    try {
                        let p = document.createElement("p");
                        p.style = "margin: 10px;";
                        p.textContent = capitalize(p.textContent);
                        let last_select = document.getElementById(String(i-1));
                        if(last_select != undefined){
                            let selection = selected(last_select);
                            selections.push(selection.value); // Se agrega al array de ingredientes que se seleccionaron en esta receta
                            p.textContent = selection.textContent;
                            last_select.replaceWith(p);
                        } else {i=0;}
                    } catch (e) {console.log(e);}                    
                } 
                if (j == 1) {
                    let quantity = document.querySelector('input[row="'+selection_id+'"]').value;
                    let new_ingredient =await httpRequest(null, "http://localhost:3000/", "recipe", "POST",{name:name.replace(/-/g, ' '),ingredient: selection_id,quantity: quantity });
                    recipe_ingredients.push(new_ingredient);
                    console.log("Ingrediente nuevo:",new_ingredient);
                    // Calculando el costo total
                    let total = recipe_ingredients.reduce((costs,row) => costs + Number(row.cost),0);
                    h3_total.textContent = "TOTAL: $"+total.toFixed(2);  
                    form.remove();
                    makeRow(new_ingredient,name.replace(/ /g,"-"),"recipes");
                }
                j++;
                }
            i++;
        }
            
        // Botón para eliminar la receta
        let remove = document.createElement("button");
        remove.textContent = "x";
        remove.onclick = () => {
            httpRequest(null,"http://localhost:3000/","recipe/"+name,"DELETE");
            div.remove();
        }
        
        // Agregando el nombre y los botones a su div
        buttons.append(h2_name,newIngredient,remove)
        
        // Agregando todos los elementos de la receta
        recipe_div.append(buttons,table,h3_total);

        // Agregando la receta a su contenedor
        document.getElementById("recipes").append(recipe_div);
        
        // Agregando al interfaz los ingredientes que ya tenia asignados la receta 
        for(let recipe of recipe_ingredients) {
            delete recipe.name;
            recipe.cost = recipe.cost.toFixed(2);
            makeRow(recipe,name.replace(/ /g,"-"),"recipes");
        }
        
        // Calculando el costo total
        let total = recipe_ingredients.reduce((costs,row) => costs + Number(row.cost),0);
        h3_total.textContent = "TOTAL: $"+total.toFixed(2);   
    }
    // Agregando los ingredientes de la base de datos al contenedor en la interfaz grafica
    for(let ingredient of ingredients.values()) makeRow(ingredient,"ingredients");
} catch(e) {console.log(e);}

// Pasandole la funcion a los botones que agregan registros a las tablas
document.querySelector(".add_ingredient").onclick = e => {addIngredient(e, "ingredients");};
document.querySelector(".add_recipe").onclick = e => {addRecipe(e, "recipes");};
