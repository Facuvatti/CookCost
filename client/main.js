function createForm(e,containerID,action="creating",add_method="append",insertBefore="",onlyOne=true) {
    e.preventDefault();
    if (document.querySelectorAll("."+action+"-"+containerID).length == 0 || !onlyOne) {
        let form = document.createElement("form");
        form.className = "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-3";
        
        form = confirmation(form);
        let container = document.getElementById(containerID)
        if(container.tagName == "TABLE") {
            let tr = document.createElement("tr");
            let td = document.createElement("td")
            td.setAttribute("colspan", "100");
            tr.classList.add(action+"-"+containerID);
            tr.append(td);
            td.append(form);
            container.append(tr);

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
        select.className = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white";
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
    div.className = "confirmation flex gap-2 justify-end mt-4";
    
    let confirm = document.createElement("button");
    confirm.setAttribute("type","submit");
    confirm.textContent = "Confirmar";
    confirm.className = "px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors duration-200 shadow-sm";
    
    let cancel = document.createElement("button");
    cancel.setAttribute("type","button");
    cancel.textContent = "Cancelar";
    cancel.className = "px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-md transition-colors duration-200 shadow-sm";
    cancel.onclick = () => {
        form.closest('tr')?.remove() || form.remove();
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
    input.className = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 dark:text-white";
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
        document.querySelector(".creating-"+containerID).remove();
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
    new_ingredient.className = "add px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-200 shadow-sm";
    new_ingredient.setAttribute("type", "button");
    
    let i = 1;
    let selections = [];
    
    new_ingredient.onclick = async (event) => {
        event.preventDefault();
        let last_div;
        if(i > 1) {
            let p = document.createElement("p");
            p.className = "my-2 text-gray-700 dark:text-gray-300 font-medium";
            p.textContent = capitalize(p.textContent);
            let last_select = document.getElementById(String(i-1));
            console.log(last_select);
            let selection = selected(last_select);
            selections.push(selection.value);
            p.textContent = selection.textContent;
            last_select.replaceWith(p);
        }
        
        let div = document.createElement("div");
        div.className = "ingredient flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md";
        let select = document.createElement("select");
        select.id = i;
        select.className = "flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white";
        
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
        quantity.className = "w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white";
        
        let unit = document.createElement("p");
        unit.className = "text-gray-600 dark:text-gray-300 font-medium min-w-[60px]";
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
            document.querySelector(".creating-"+containerID).remove();
            for(let selection of selections) {
                let quantity = document.querySelector('input[row="'+selection+'"]').value;
                let result = await httpRequest(null, "http://localhost:3000/", "recipe/", "POST",{name:name.value,ingredient: selection,quantity: quantity });
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
        p.className = "my-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-lg font-semibold text-gray-800 dark:text-white dark:bg-gray-700";
        form.prepend(p,new_ingredient);
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function makeRow(row,containerID,db_table=undefined) {
    let tr = document.createElement("tr");
    tr.className = "border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150";
    
    if(db_table == undefined) db_table = containerID;
    try{tr.id = "r"+row.id;}
    catch(e) {e}
    
    for(let column in row) {
        if (column == "id") continue;
        let td = document.createElement("td");
        td.className = "px-4 py-3 text-gray-700 dark:text-gray-300";
        let cell = row[column];
        if(column == "name") {
            cell = capitalize(cell);
            td.className += " font-medium text-gray-900 dark:text-white";
        }
        td.textContent = cell;
        if (column == "price" || column == "cost") {
            td.textContent = "$" + cell;
            td.className += " font-semibold text-green-600 dark:text-green-400";
        }
        td.classList.add(column);
        tr.appendChild(td);
    }
    
    let tdButtons = document.createElement("td");
    tdButtons.className = "px-4 py-3 text-right buttons";
    let modify = document.createElement("button");
    modify.textContent = "✏️";
    modify.className = "px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 shadow-sm mr-2";
    modify.onclick = () => {
        const tr = document.querySelector("#"+containerID+" > #r"+row.id);
        let form = document.createElement("form");
        form.className = "flex flex-wrap items-center gap-2 p-2";
        let td_form = document.createElement("td");
        td_form.setAttribute("colspan", "100");
        td_form.className = "bg-gray-50";
        form.id = row.id;
        
        for(let td of tr.cells)  {
            if(td.classList.contains("buttons")) continue;  
            if(td.classList.contains("name")) {
                let name = document.createElement("p");
                name.textContent = td.textContent;
                name.className = "px-3 py-2 font-medium text-gray-900 dark:text-white";
                form.append(name);
                continue
            }
            if(td.tagName == "BUTTON") continue;
            let input = document.createElement("input");
            input.name = td.classList[0];
            input.setAttribute("type","text");
            input.className = "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-32 bg-white dark:bg-gray-700 dark:text-white";
            if(td.classList.contains("price") || td.classList.contains("cost")) td.textContent = td.textContent.slice(1);
            input.value = td.textContent;
            form.append(input);
        }
        
        let confirm = document.createElement("button");
        confirm.setAttribute("type","submit");
        confirm.textContent = "Confirmar";
        confirm.className = "px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors duration-200 shadow-sm";
        form.append(confirm);
        
        let cancel = document.createElement("button");
        cancel.setAttribute("type","button");
        cancel.textContent = "Cancelar";
        cancel.className = "px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-md transition-colors duration-200 shadow-sm";
        cancel.onclick = () => {
            form.closest('tr')?.replaceWith(tr);
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
        tr.replaceWith(document.createElement("tr").appendChild(td_form).parentElement);
    }
    
    let remove = document.createElement("button");
    remove.textContent = "🗑️";
    remove.className = "px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200 shadow-sm";
    remove.onclick = () => {
        console.log(containerID,db_table);
        if(row.id == undefined) row.id = row.name;
        if(db_table == "recipe" || db_table == "recipes") {
            httpRequest(null,"http://localhost:3000/recipe/",containerID+"/"+row.id,"DELETE");
        }
        httpRequest(null,"http://localhost:3000/",db_table+"/"+row.id,"DELETE");
        tr.remove();
    }
    
    tdButtons.append(modify, remove);
    tr.append(tdButtons);
    
    let container = document.getElementById(containerID);
    container.append(tr);
}

async function httpRequest(event,url,endpoint,method,body) {
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
        recipe_div.className = "recipe bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 mt-4";
        
        let buttons = document.createElement("div");
        buttons.className = "flex items-center gap-3 mb-4";
        
        let h2_name = document.createElement("h2");
        h2_name.textContent = name;
        h2_name.className = "text-2xl font-bold text-gray-800 dark:text-white flex-1";
        
        let table = document.createElement("table");
        table.id = name.replace(/ /g,"-");
        table.className = "w-full mb-4";
        
        let h3_total = document.createElement("h3");
        h3_total.className = "text-xl font-semibold text-green-600 dark:text-green-400 text-right";
        
        let db_ingredients = Array.from(recipe_ingredients.map((ingredient) => ingredient.id))
        let selections = db_ingredients;
        let i = 1;
        
        let newIngredient = document.createElement("button");
        newIngredient.textContent = "+";
        newIngredient.className = "px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-200 shadow-sm";
        newIngredient.onclick = async (event) => {     
            event.preventDefault();
            let last_div;
            
            let div = document.createElement("div");
            div.className = "ingredient flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md";

            const ingredients = await httpRequest(null,"http://localhost:3000/","ingredients","GET");
            
            let rest = ingredients.length - selections.length
            if(rest == 0) {return;}
            
            name = name.replace(/ /g,"-");
            const recipe_container = document.getElementById("recipe-"+name);
            let form = createForm(event,"recipe-"+name,"modifiying","insertBefore",recipe_container.lastChild,false);          
            let select = createSelection(ingredients,selections); 
            select.id = i;           
            let selection_id = selected(select).value;
            
            let quantity = createInput("quantity","Cantidad");
            quantity.setAttribute("row",selection_id);
            quantity.className = "w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white";
            
            let unit = document.createElement("p");
            unit.className = "text-gray-600 dark:text-gray-300 font-medium min-w-[60px]";

            let selected_row = ingredients.find(ingredient => ingredient.id == selection_id);
            unit.textContent = selected_row.unit;   
            select.onchange = () => {
                let selection_id = selected(select).value;
                let selected_row = ingredients.find(ingredient => ingredient.id == selection_id);
                unit.textContent = selected_row.unit;          
            }
            
            div.append(select,quantity,unit);
            form.prepend(div);
            
            let j = 0;
            form.onsubmit = async (event) => {
                event.preventDefault();
                console.log("Confirmado");
                console.log(j);
                if (j == 0) {
                    try {
                        let p = document.createElement("p");
                        p.className = "my-2 text-gray-700 dark:text-gray-300 font-medium";
                        p.textContent = capitalize(p.textContent);
                        let last_select = document.getElementById(String(i-1));
                        if(last_select != undefined){
                            let selection = selected(last_select);
                            selections.push(selection.value);
                            p.textContent = selection.textContent;
                            last_select.replaceWith(p);
                        } else {i=0;}
                    } catch (e) {console.log(e);}                    
                } 
                if (j == 1) {
                    let quantity = document.querySelector('input[row="'+selection_id+'"]').value;
                    let new_ingredient = await httpRequest(null, "http://localhost:3000/", "recipe", "POST",{name:name.replace(/-/g, ' '),ingredient: selection_id,quantity: quantity });
                    recipe_ingredients.push(new_ingredient);
                    console.log("Ingrediente nuevo:",new_ingredient);
                    
                    let total = recipe_ingredients.reduce((costs,row) => costs + Number(row.cost),0);
                    h3_total.textContent = "TOTAL: $"+total.toFixed(2);  
                    form.remove();
                    makeRow(new_ingredient,name.replace(/ /g,"-"),"recipes");
                }
                j++;
            }
            i++;
        }
            
        let remove = document.createElement("button");
        remove.textContent = "🗑️";
        remove.className = "px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200 shadow-sm";
        remove.onclick = () => {
            httpRequest(null,"http://localhost:3000/","recipe/"+name,"DELETE");
            recipe_div.remove();
        }
        
        buttons.append(h2_name, newIngredient, remove)
        recipe_div.append(buttons, table, h3_total);
        document.getElementById("recipes").append(recipe_div);
        
        for(let recipe of recipe_ingredients) {
            delete recipe.name;
            recipe.cost = recipe.cost.toFixed(2);
            makeRow(recipe,name.replace(/ /g,"-"),"recipes");
        }
        
        let total = recipe_ingredients.reduce((costs,row) => costs + Number(row.cost),0);
        h3_total.textContent = "TOTAL: $"+total.toFixed(2);   
    }
    
    for(let ingredient of ingredients.values()) makeRow(ingredient,"ingredients");
} catch(e) {console.log(e);}

document.querySelector(".add_ingredient").onclick = e => {addIngredient(e, "ingredients");};
document.querySelector(".add_recipe").onclick = e => {addRecipe(e, "recipes");};
function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', isDark);
}