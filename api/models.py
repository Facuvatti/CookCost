from typing import Optional, List
from decimal import Decimal
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy import Numeric

# --- Modelo Ingredient ---
class Ingredient(SQLModel, table=True):
    __tablename__ = "ingredients"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(nullable=False)
    # price guardado como NUMERIC(10,2) para evitar errores de punto flotante
    price: Decimal = Field(sa_column=Column(Numeric(10, 2), nullable=False))
    unit: str = Field(max_length=3, nullable=False)  # e.g. 'kg','g','l','ml','u'

    recipe_links: List["RecipeIngredient"] = Relationship(back_populates="ingredient")


# --- Modelo Recipe ---
class Recipe(SQLModel, table=True):
    __tablename__ = "recipes"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(nullable=False)
    ingredient_links: List["RecipeIngredient"] = Relationship(back_populates="recipe")

class IngredientLine(SQLModel):
    ingredient_id: int
    quantity: Decimal   # o float, pero Decimal evita problemas de redondeo

class RecipeCreate(SQLModel):
    name: str
    ingredients: List[IngredientLine]
# --- Modelo RecipeIngredient (tabla intermedia) ---
class RecipeIngredient(SQLModel, table=True):
    __tablename__ = "recipe_ingredients"

    id: Optional[int] = Field(default=None, primary_key=True)
    recipe_FK: int = Field(foreign_key="recipes.id", nullable=False)
    ingredient_FK: int = Field(foreign_key="ingredients.id", nullable=False)
    quantity: Decimal = Field(sa_column=Column(Numeric(10, 3), nullable=False))
    recipe: Optional[Recipe] = Relationship(back_populates="ingredient_links")
    ingredient: Optional[Ingredient] = Relationship(back_populates="recipe_links")
class RecipeIngredientDetail(SQLModel):
    name: str
    quantity: float
    total_price: float
class RecipeWithIngredients(SQLModel):
    name: str
    ingredients: List[RecipeIngredientDetail]