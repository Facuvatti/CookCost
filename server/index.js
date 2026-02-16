// Libraries
const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); 
const morgan = require('morgan');

const app = express();
// to avoid CORS errors because the client 
// requests are a diferent domain
// than itself
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'cookcost'
});

// ---- ENDPOINTS ----

// --- INGREDIENTS ---

// -- GET --

// - ALL -
app.get("/ingredients", (req, res) => {
	const query = "SELECT * FROM ingredients";
	connection.query(query, (err, results) => {
	if (err) {
		console.error("Error al listar ingredientes:", err);
		return res.status(500).json({ error: "Error al obtener ingredientes" });
	}
	res.status(200).json(results);
	});
});
// - ONE -
app.get("/ingredients/:id", (req, res) => {

	const ingredientId = req.params.id;
	const query = "SELECT * FROM ingredients WHERE id = ?";
	connection.query(query, [ingredientId], (err, results) => {
	if (err) {
		console.error("Error al obtener ingrediente:", err);
		return res.status(500).json({ error: "Error al obtener ingrediente" });
	}
	res.status(200).json(results[0]);
	});
})

// -- POST --

app.post("/ingredients", (req, res) => {
	const { name, price, unit } = req.body;

	const query = "INSERT INTO ingredients (name, price, unit) VALUES (?, ?, ?)";
	connection.query(query, [name, price, unit], (err, result) => {
	if (err) {
		console.error("Error al crear ingrediente:", err);
		return res.status(500).json({ error: "Error al crear ingrediente" });
	}
	res.status(201).json({
		id : result.insertId,
		name : name,
		price: price,
		unit : unit
	});
	});
});

// -- PATCH --

app.patch("/ingredients/:id", (req, res) => {
	const ingredientId = req.params.id;
	const { name, price, unit } = req.body;
	connection.query("UPDATE ingredients SET name = ?, price = ?, unit = ? WHERE id = ?", [name, price, unit, ingredientId], (err, result) => {
	if(err) {
		console.error("Error al actualizar ingrediente:", err);
		return res.status(500).json({ error: "Error al actualizar ingrediente" });
	}
	res.status(200).json({ id:ingredientId, name:name, price:price, unit:unit });
	})
})
// -- DELETE --

app.delete("/ingredients/:id", (req, res) => {
	const ingredientId = req.params.id;
	connection.query("DELETE FROM ingredients WHERE id = ?", [ingredientId], (err, result) => {
	if(err) {
		console.error("Error al eliminar ingrediente:", err);
		return res.status(500).json({ error: "Error al eliminar ingrediente" });
	}
	res.status(200).json({ message: "Ingrediente eliminado", result: result });
	})
})

// --- RECIPES ---

// -- GET --

// - LIST -
app.get("/recipes/list", (req, res) => {
	const query = "SELECT DISTINCT name FROM recipes;";
	connection.query(query, (err, results) => {
	if (err) {
		console.error("Error al listar recetas:", err);
		return res.status(500).json({ error: "Error al obtener recetas" });
	}
	res.status(200).json(results);
	});
})
// - ALL -
app.get("/recipes", (req, res) => {
	const query = `SELECT * from ri_view`;
	connection.query(query, (err, results) => {
	if (err) {
		console.error("Error al listar recetas:", err);
		return res.status(500).json({ error: "Error al obtener recetas" });
	}
	const recipesMap = {};

	results.forEach(row => {
		const recipeName = row.recipe;
		const recipeId = row.recipe_id;

		if (!recipesMap[recipeId]) {
			recipesMap[recipeId] = {
				id: recipeId,
				name: recipeName,
				ingredients: []
			};
		}

		recipesMap[recipeId].ingredients.push({
			id: row.id,
			name: row.ingredient,
			quantity: row.quantity,
			unit: row.unit
		});
	});

	const recipesArray = Object.values(recipesMap);

	res.status(200).json(recipesArray);
	});
})
// - ONE -
app.get("/recipes/:id", (req, res) => {
	let id = req.params.id;
	const query =`
		SELECT *
		FROM ri_view
		WHERE recipe_id = 1;
	`;
	connection.query(query, [id], (err, results) => {
		if (err) {
			console.error("Error al obtener ingredientes:", err);
			return res.status(500).json({ error: "Error al obtener ingredientes" });
		}
		const recipe = results[0].recipe;
		const recipe_id = results[0].recipe_id;
		results = results.map((ingredient) => {
			delete ingredient.recipe;
			delete ingredient.recipe_id;
			return ingredient
		})
		res.status(200).json({[recipe]:{id: recipe_id,ingredients: results}});
	}
  );
});

// -- POST --
// - RECIPE -
app.post("/recipes", (req, res) => {
	const { name } = req.body;
	const query = "INSERT INTO recipes (name) VALUES (?)";
	connection.query(query, [name], (err, result) => {
	if (err) {
		console.error("Error al crear receta:", err);
		return res.status(500).json({ error: "Error al crear receta" });
	}
	res.status(201).json(result);
	});
})
// - INGREDIENT -
app.post("/recipes/ingredient/:recipe", (req, res) => {
	const recipe = req.params.recipe;
	const { ingredient, quantity } = req.body;
	const query = "INSERT INTO recipe_ingredients (recipe, ingredient, quantity) VALUES (?, ?, ?)";
	connection.query(query, [recipe, ingredient, quantity], (err, result) => {
	if (err) {
		console.error("Error al agregar ingrediente a receta:", err);
		return res.status(500).json({ error: "Error al agregar ingrediente a receta" });
	}
	res.status(201).json(result);
	});
})
// -- PATCH --
// - RECIPE -
app.patch("/recipes/:id", (req, res) => {
	const id = req.params.id;
	const {name} = req.body
	const query = "UPDATE recipes SET name = ? WHERE id = ?";
	connection.query(query, [name, id], (err, result) => {
	if (err) {
		console.error("Error al actualizar receta:", err);
		return res.status(500).json({ error: "Error al actualizar receta" });
	}
	res.status(200).json(result);
	});
})
// - INGREDIENT -
app.patch("/recipes/ingredient/:id", (req, res) => {
	const id = req.params.id;
	const {quantity} = req.body
	const query = "UPDATE recipe_ingredients SET quantity = ? WHERE id = ? ";
	connection.query(query, [quantity, id], (err, result) => {
	if (err) {
		console.error("Error al agregar ingrediente a receta:", err);
		return res.status(500).json({ error: "Error al agregar ingrediente a receta" });
	}
	console.log(result.message);
	res.status(200).json(result);
	});
})
// -- DELETE --
app.delete("/recipes/:id", (req, res) => {
	let id = req.params.id;
	const query = "DELETE FROM recipes WHERE id = ?";
	connection.query(query, [id], (err, result) => {
	if (err) {
		console.error("Error al eliminar receta:", err);
		return res.status(500).json({ error: "Error al eliminar receta" });
	}
	res.status(200).json(result);
	});
})
app.delete("/recipes/ingredient/:id", (req, res) => {
	let id = req.params.id;
	const query = "DELETE FROM recipe_ingredients WHERE id=? ";
	connection.query(query, [id], (err, result) => {
	if (err) {
		console.error("Error al eliminar ingrediente de la receta:", err);
		return res.status(500).json({ error: "Error al eliminar ingrediente de receta" });
	}
	res.status(200).json(result);
	});
})

// Start the server

app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});