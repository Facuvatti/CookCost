function createForm(e,containerID) {
    e.preventDefault();
    if (document.querySelectorAll("#creating"+"-"+containerID).length == 0) {
        let form = document.createElement("form");
        form.id = "creating"+"-"+containerID;
        form = confirmation(form);
        let container = document.getElementById(containerID)
        container.append(form);
        return form;
    }
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
    let unit = createInput("unit","Unidad")
    let price = createInput("price","Precio");
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
        let ids= ingredients.map(ingredient => String(ingredient.id));
        let rest= ids.length -selections.length
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
                let result =await httpRequest(null, "http://localhost:3000/", "recipes/", "POST",{name:name,ingredient: selection,quantity: quantity });
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
function makeRow(row,containerID) {
    let tr = document.createElement("tr");
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
        const tr_children = Array.from(tr.children);
        let form = document.createElement("form");
        let td_form = document.createElement("td");
        form.id = row.id;
        form.style= "display: flex; flex-direction: row;";
        for(let td of tr.children) {
            if(td.classList.contains("name")) {
                let name = document.createElement("p");
                name.textContent = td.textContent;
                name.style = "margin: 10px;";
                form.appendChild(name);
                continue
            }
            if(td.tagName == "BUTTON") continue;
            let input = document.createElement("input");
            input.name=td.classList[0];
            input.setAttribute("type","text");
            if(td.classList.contains("price") || td.classList.contains("cost")) td.textContent = td.textContent.slice(1);
            input.value = td.textContent;
            form.appendChild(input);
        }
        let confirm = document.createElement("button");
        confirm.setAttribute("type","submit");
        confirm.textContent = "Confirmar";
        form.appendChild(confirm);
        let cancel = document.createElement("button");
        cancel.setAttribute("type","button");
        cancel.textContent = "Cancelar";
        cancel.onclick = () => {
            td_form.remove();
            tr_children.forEach(td => tr.appendChild(td));
        }
        form.appendChild(cancel);
        
        form.onsubmit = async (event) => {
            event.preventDefault();
            const result = await httpRequest(event,"http://localhost:3000/",containerID+"/"+row.id,"PATCH");
            form.remove();
            row.price = result.price;
            row.unit = result.unit;
            tr.remove();
            makeRow(row,containerID);
            console.log("Modificado:", result);
        }
        td_form.appendChild(form);
        tr.replaceChildren();
        tr.appendChild(td_form);
    }
    let remove = document.createElement("button");
    remove.textContent = "x";
    remove.onclick = () => {
        httpRequest(null,"http://localhost:3000/",containerID+"/"+row.id,"DELETE");
        tr.remove();
    }
    tr.appendChild(modify);
    tr.appendChild(remove);
    let container = document.getElementById(containerID);
    container.appendChild(tr);
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
let recipes = await httpRequest(null,"http://localhost:3000/","recipes/name","GET")
let ingredients = await httpRequest(null,"http://localhost:3000/","ingredients","GET")
try {
    
    for(let name of recipes.values()) {
        name = name.name.replace(/%20/g, ' ');
        let result = await httpRequest(null,"http://localhost:3000/","recipe/"+name,"GET");
        console.log("Recipes:", result);
        let div = document.createElement("div");
        div.classList.add("recipe");
        let h3 = document.createElement("h3");
        h3.textContent = name;
        let table = document.createElement("table");
        table.id = name;
        div.append(h3);
        div.append(table);
        document.getElementById("recipes").append(div);
        for(let row of result) {
            delete row.name;
            row.cost = row.cost.toFixed(2);
            makeRow(row,name);

        }
    }
    for(let ingredient of ingredients.values()) makeRow(ingredient,"ingredients");
} catch(e) {console.log(e);}
document.querySelector(".add_ingredient").addEventListener("click", e => {
    addIngredient(e, "ingredients");
});

document.querySelector(".add_recipe").addEventListener("click", e => {
    addRecipe(e, "recipes");
});
