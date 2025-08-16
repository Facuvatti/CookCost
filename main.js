function add(itemsClass,containerID) {
    if (document.querySelectorAll("#creating"+"-"+containerID).length == 0) {
    let item = document.createElement("div");
    item.classList.add(itemsClass);
    item.id = "creating"+"-"+containerID;
    let form = document.createElement("form");
    let name = document.createElement("input");
    name.setAttribute("type","text");
    name.setAttribute("placeholder","Nombre");
    let create = document.createElement("button");
    create.setAttribute("type","submit");
    create.textContent = "+";
    form.appendChild(create);
    form.appendChild(name);
    form.appendChild(create);
    item.appendChild(form);
    form.addEventListener("submit",function(e){
        e.preventDefault();
        for(let i = 0; i < item.children.length; i++) {
            let input = item.children[i];
            let value = input.value
            let p = document.createElement("p");
            p.textContent = value;
            p.id = input.id;
            p.classList = input.classList;
            p.style = input.style;
            item.insertBefore(p,input);
            input.remove();
        }
    });
    let container = document.getElementById(containerID)
    container.appendChild(item);
    return [form,item];
    }
}
function addIngredient(itemsClass,containerID) {
   let form = add(itemsClass,containerID);
   let submit = form.lastChild;
   let unit = document.createElement("input");
   unit.classListadd("unit");
   unit.setAttribute("type","text");
   unit.setAttribute("placeholder","Unidad de medida");
   let price = document.createElement("input");
   price.classListadd("price");
   price.setAttribute("type","text");
   price.setAttribute("placeholder","Precio por 1 unidad");
   form.insertBefore(unit,submit);
   form.insertBefore(price,submit);
}
function addRecipe(itemsClass,containerID) {
    let [form, item] = add(itemsClass,containerID);
    let submit = form.lastChild;
    let new_ingredient = createElement("button");
    new_ingredient.setAttribute("type","submit");
    new_ingredient.textContent = "+";
    new_ingredient.addEventListener("click",function(e){
        e.preventDefault();
        let ingredient_selection = document.createElement("selector");
        for(let ingredient of document.querySelectorAll(".ingredient")) {
            let option = document.createElement("option");
            option.textContent = ingredient.textContent;
            option.value = ingredient.textContent;
            ingredient_selection.appendChild(option);
            let unit = ingredient.querySelector(".unit")
            unit = unit.value;
            let price = ingredient.querySelector(".price")
            price = price.value;
        }
        ingredient_selection.addEventListener("change",function(e){
            let selected_index = ingredient_selection.selectedIndex;
            let selected_ingredient_name = ingredient_selection.options[selected_index];  
        })
        
        form.insertBefore(ingredient_selection,submit);
        let quantity = document.createElement("input");
        quantity.setAttribute("type","text");
        quantity.setAttribute("placeholder","Cantidad");
        form.insertBefore(quantity,submit);
    })
    form.appendChild(new_ingredient);
}


