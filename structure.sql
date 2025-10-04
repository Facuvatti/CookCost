CREATE DATABASE IF NOT EXISTS cookcost;
USE cookcost;

CREATE TABLE ingredients (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    unit VARCHAR(3) NOT NULL,
    PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS recipes(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    ingredient INT NOT NULL,
    quantity FLOAT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (ingredient) REFERENCES ingredients(id)
);
CREATE VIEW IF NOT EXISTS recipe_ingredients AS 
    SELECT r.name,i.name AS ingredient, r.quantity,i.unit, (r.quantity * i.price) AS cost,i.id
    FROM recipes AS r JOIN ingredients i ON r.ingredient = i.id

INSERT INTO ingredients (name, price, unit) VALUES
  ('Harina', 1.2, 'kg'),
  ('Queso', 3.5, 'kg'),
  ('Tomate', 2.1, 'kg');

INSERT INTO recipes (name, ingredient, quantity) VALUES
  ('Pizza Margarita', 1, 0.5),  -- 0.5 kg Harina
  ('Pizza Margarita', 2, 0.3),  -- 0.3 kg Queso
  ('Pizza Margarita', 3, 0.2),  -- 0.2 kg Tomate

  ('Ensalada fresca', 3, 0.4),  -- 0.4 kg Tomate
  ('Ensalada fresca', 2, 0.1),  -- 0.1 kg Queso

  ('Tarta de verduras', 1, 0.3),-- 0.3 kg Harina
  ('Tarta de verduras', 3, 0.25);-- 0.25 kg Tomate
