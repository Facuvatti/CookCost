// importar librerias
const express = require('express');
const mysql   = require('mysql');
const cors    = require('cors'); 

// crear objeto app
const app = express();
// para evitar errores de CORS porque las 
// peticiones del cliente son a un dominio 
// distinto a si mismo
app.use(cors());
// parsear cuerpos de peticiones en JSON
app.use(express.json());

// conectarse a la base de datos
// hay que pasar en un objeto los datos de conexion
// ajustar de acuerdo a la instalacion de cada uno
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'cookcost'
});

// --- ENDPOINTS ---

// Crear ingrediente
app.post("/ingredients", (req, res) => {
  const { name, price, unit } = req.body;

  const query = "INSERT INTO ingredients (name, price, unit) VALUES (?, ?, ?)";
  connection.query(query, [name, price, unit], (err, result) => {
    if (err) {
      console.error("Error al crear ingrediente:", err);
      return res.status(500).json({ error: "Error al crear ingrediente" });
    }
    res.status(201).json({
      message: "Ingrediente creado",
      id: result.insertId,
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
app.get("/recipes", (req, res) => {
      const query =`    
      SELECT r.name AS recipe,i.name AS ingredient, ri.quantity,i.unit, (ri.quantity * i.price) AS cost
      FROM recipe_ingredients AS ri 
      JOIN recipes AS r ON ri.recipe = r.id 
      JOIN ingredients i ON ri.ingredient = i.id
      ORDER BY r.id`;
      connection.query(query, (err, results) => {
        if (err) {
          console.error("Error al obtener ingredientes:", err);
          return res.status(500).json({ error: "Error al obtener ingredientes" });
        }
        res.json(results);
    }
  );
});
// Crear receta
app.post("/recipes", (req, res) => {
  const { name } = req.body;

  const query = "INSERT INTO recipes (name) VALUES (?)";
  connection.query(query, [name], (err, result) => {
    if (err) {
      console.error("Error al crear receta:", err);
      return res.status(500).json({ error: "Error al crear receta" });
    }
    res.status(201).json({
      message: "Receta creada",
      id: result.insertId,
    });
  });
});

app.get("/recipes/:id/ingredients", (req, res) => {
  const recipeId = req.params.id;

  connection.query(`    
    SELECT SUM(ri.quantity * i.price) AS total
    FROM recipe_ingredients AS ri
    JOIN recipes AS r ON ri.recipe = r.id
    JOIN ingredients i ON ri.ingredient = i.id 
    GROUP BY r.id
    HAVING r.id = ?`, [recipeId], (err, total) => {
    if (err) {
      console.error("Error al obtener ingredientes:", err);
      return res.status(500).json({ error: "Error al obtener ingredientes" });
    }
    // Verifico si la receta existe
    connection.query(
      "SELECT name FROM recipes WHERE id = ?",
      [recipeId],
      (err, recipeResults) => {
        if (err) {
          console.error("Error al buscar receta:", err);
          return res.status(500).json({ error: "Error al buscar receta" });
        }
        if (recipeResults.length === 0) {
          return res.status(404).json({ error: "Receta no encontrada" });
        }
        const query =`    
        SELECT i.name AS ingredient, ri.quantity,i.unit, (ri.quantity * i.price) AS cost
        FROM recipe_ingredients AS ri 
        JOIN recipes AS r ON ri.recipe = r.id 
        JOIN ingredients i ON ri.ingredient = i.id
        WHERE recipe_id = ?`;
        connection.query(query, [recipeId], (err, results) => {
          if (err) {
            console.error("Error al obtener ingredientes:", err);
            return res.status(500).json({ error: "Error al obtener ingredientes" });
          }
          results["recipe"] = recipeResults[0];
          results["total"] = total[0];
          res.json(results);
        });
      }
    );
  });
});
app.patch("/recipes/", (req, res) => {
  
})
// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});