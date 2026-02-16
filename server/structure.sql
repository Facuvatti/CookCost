CREATE DATABASE cookcost;
USE cookcost;

CREATE TABLE cost_items (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    unit VARCHAR(3) NOT NULL,
    type ENUM("ingredient","service") NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE recipes(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    prepare_time INT NOT NULL,
    heat_amount FLOAT NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE recipe_costs (
    id INT NOT NULL AUTO_INCREMENT,
    recipe INT NOT NULL,
    item INT NOT NULL,
    quantity FLOAT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (recipe) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (item) REFERENCES cost_items(id)
);

INSERT INTO cost_items (name, price, unit, type) VALUES
  ('Harina', 1000, 'kg',"ingredient"),
  ('Queso', 3500, 'kg',"ingredient"),
  ('Tomate', 2100, 'kg',"ingredient"),
  ("Gas", 1000, "l","service");

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