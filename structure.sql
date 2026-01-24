CREATE DATABASE cookcost;
USE cookcost;

CREATE TABLE ingredients (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    unit VARCHAR(3) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE recipes(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE recipe_ingredients (
    id INT NOT NULL AUTO_INCREMENT,
    recipe INT NOT NULL,
    ingredient INT NOT NULL,
    quantity FLOAT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (recipe) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient) REFERENCES ingredients(id)
);
CREATE VIEW ri_view AS 
    SELECT ri.id, r.name AS recipe, recipe AS recipe_id, i.name AS ingredient, ri.quantity, i.unit
    FROM recipe_ingredients ri
    JOIN ingredients i ON ri.ingredient = i.id
    JOIN recipes r ON ri.recipe = r.id;
INSERT INTO ingredients (name, price, unit) VALUES
  ('Harina', 1.2, 'kg'),
  ('Queso', 3.5, 'kg'),
  ('Tomate', 2.1, 'kg');

INSERT INTO recipes (name) VALUES
  ('Pizza Margarita'),  
  ('Ensalada fresca'),  
  ('Tarta de verduras');

INSERT INTO recipe_ingredients (recipe, ingredient, quantity) VALUES
  (1, 1, 0.5),  
  (1, 2, 0.3),
  (1, 3, 0.2),

  (2, 3, 0.4),
  (2, 2, 0.1),

  (3, 1, 0.3),
  (3, 3, 0.25);