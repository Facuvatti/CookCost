CREATE DATABASE IF NOT EXISTS cookcost;
USE cookcost;

CREATE TABLE ingredients (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    unit VARCHAR(3) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS recipes(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    ingredient INT NOT NULL,
    quantity FLOAT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (ingredient) REFERENCES ingredients(id)
);
CREATE VIEW recipe_ingredients AS 
    SELECT r.name,i.name AS ingredient, r.quantity,i.unit, (r.quantity * i.price) AS cost,i.id
    FROM recipes AS r JOIN ingredients i ON r.ingredient = i.id
