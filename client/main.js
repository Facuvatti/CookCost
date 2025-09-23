recipes = httpRequest(null,"http://localhost:3000/","recipes","GET")
ingredients = httpRequest(null,"http://localhost:3000/","ingredients","GET")

function httpRequest(event,url,endpoint,method) { // Es un handler para formularios
    let options;
    if (event != null) {
        event.preventDefault();
        let form = event.target;
        let formData = new FormData(form);
        let query = {};
        for (const [name, value] of formData.entries()) {
            query[name] = value 
        }
        options[body] = JSON.stringify(query);
        event.target.reset();
    }
    options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
    };
    url = url +endpoint;
    fetch(url, options)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            return data
        }
        )
        .catch(err => console.error(err));
    
}
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
   unit.classList.add("unit");
   unit.setAttribute("type","text");
   unit.setAttribute("placeholder","Unidad de medida");
   let price = document.createElement("input");
   price.classList.add("price");
   price.setAttribute("type","text");
   price.setAttribute("placeholder","Precio por 1 unidad");
   form.insertBefore(unit,submit);
   form.insertBefore(price,submit);
   form.onsubmit = event => httpRequest(event,"http://localhost:3000/","ingredients","POST");
}
function addRecipe(e,itemsClass,containerID) {
    let form = add(e,itemsClass,containerID);
    let new_ingredient = createElement("button");
    new_ingredient.setAttribute("type","submit");
    new_ingredient.textContent = "+";
    form.appendChild(new_ingredient);
    form.onsubmit = event => httpRequest(event,"http://localhost:3000/","recipes","POST");
}





