// Libraries
const express = require('express');
const mysql   = require('mysql');
const cors    = require('cors'); 


const app = express();
// to avoid CORS errors because the client 
// requests are a diferent domain
// than itself
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'cookcost'
});

// --- ENDPOINTS ---

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

// Listar ingredientes
app.get("/ingredients", (req, res) => {
  const query = "SELECT * FROM ingredients";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error al listar ingredientes:", err);
      return res.status(500).json({ error: "Error al obtener ingredientes" });
    }
    res.json(results);
  });
});
app.get("/ingredients/:id", (req, res) => {
  
  const ingredientId = req.params.id;
  const query = "SELECT * FROM ingredients WHERE id = ?";
  connection.query(query, [ingredientId], (err, results) => {
    if (err) {
      console.error("Error al obtener ingrediente:", err);
      return res.status(500).json({ error: "Error al obtener ingrediente" });
    }
    res.json(results[0]);
  });
})
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
app.patch("/ingredients/:id", (req, res) => {
  const ingredientId = req.params.id;
  const { price, unit } = req.body;
  connection.query("UPDATE ingredients SET price = ?, unit = ? WHERE id = ?", [price, unit, ingredientId], (err, result) => {
    if(err) {
      console.error("Error al actualizar ingrediente:", err);
      return res.status(500).json({ error: "Error al actualizar ingrediente" });
    }
    res.status(200).json({ message: "Ingrediente actualizado", price:price, unit:unit });
  })
})

app.delete("/recipe/:name", (req, res) => {
  const recipe = req.params.name;
  recipe = recipe.replace(/%20/g, ' ').replace(/-/g, ' ');
  const query = "DELETE FROM recipes WHERE name = ?";
  connection.query(query, [recipe], (err, result) => {
    if (err) {
      console.error("Error al eliminar receta:", err);
      return res.status(500).json({ error: "Error al eliminar receta" });
    }
    res.status(200).json(result);
  });
})
app.delete("/recipe/:name/:ingredient", (req, res) => {
  const recipe = req.params.name;
  const ingredient = req.params.ingredient;
  const query = "DELETE FROM recipe_ingredients WHERE r.name = ? AND i.id = ? ";
  connection.query(query, [recipe,ingredient], (err, result) => {
    if (err) {
      console.error("Error al eliminar ingrediente de receta:", err);
      return res.status(500).json({ error: "Error al eliminar ingrediente de receta" });
    }
    res.status(200).json(result);
  });
})
app.get("/recipes/name", (req, res) => {
  const query = "SELECT DISTINCT name FROM recipes;";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error al listar recetas:", err);
      return res.status(500).json({ error: "Error al obtener recetas" });
    }
    res.json(results);
  });
})
app.get("/recipe/:name", (req, res) => {
  let recipe = req.params.name;
  recipe = recipe.replace(/%20/g, ' ');
  const query =`SELECT * FROM recipe_ingredients AS ri WHERE name = ?`;
      connection.query(query, [recipe], (err, results) => {
        if (err) {
          console.error("Error al obtener ingredientes:", err);
          return res.status(500).json({ error: "Error al obtener ingredientes" });
        }
        res.json(results);
    }
  );
});
app.post("/recipe/", (req, res) => {
  const { name,ingredient, quantity } = req.body;
  const query = "INSERT INTO recipes (name, ingredient, quantity) VALUES (?, ?, ?)";
  connection.query(query, [name, ingredient, quantity], (err, result) => {
    if (err) {
      console.error("Error al agregar ingrediente a receta:", err);
      return res.status(500).json({ error: "Error al agregar ingrediente a receta" });
    }
    res.status(201).json(result);
  });
})
app.patch("/recipe/", (req, res) => {
  const {name,ingredient, quantity} = req.body
  const query = "UPDATE recipes SET quantity = ? WHERE name = ? AND ingredient = ?";
  connection.query(query, [quantity, name, ingredient], (err, result) => {
    if (err) {
      console.error("Error al agregar ingrediente a receta:", err);
      return res.status(500).json({ error: "Error al agregar ingrediente a receta" });
    }
    res.status(201).json(result);
  });
})
// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
