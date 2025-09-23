CREATE DATABASE cookcost;
USE cookcost;

-- Tabla de recetas
CREATE TABLE recipes (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

-- Tabla de ingredientes
CREATE TABLE ingredients (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    unit VARCHAR(3) NOT NULL,
    PRIMARY KEY (id)
);

-- Tabla intermedia (relación receta-ingrediente)
CREATE TABLE recipe_ingredients (
    id INT NOT NULL AUTO_INCREMENT,
    recipe INT NOT NULL,
    ingredient INT NOT NULL,
    quantity FLOAT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (recipe) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient) REFERENCES ingredients(id)
);

-- Vista para calcular costos por receta
CREATE VIEW recipe_costs AS
    SELECT r.name AS recipe, SUM(ri.quantity * i.price) AS cost
    FROM recipe_ingredients AS ri
    JOIN recipes AS r ON ri.recipe = r.id
    JOIN ingredients i ON ri.ingredient = i.id 
    GROUP BY r.id;