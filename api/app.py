
from fastapi import FastAPI, Depends, HTTPException, status
from sqlmodel import select
from typing import List
import logging
from models import Ingredient, Recipe, RecipeIngredient, RecipeIngredientDetail, RecipeWithIngredients,RecipeCreate
from db import get_session
from sqlmodel import Session
from sqlalchemy import text
ogger = logging.getLogger(__name__)

app = FastAPI(title="CookCost API",)


# --- Endpoints CRUD mínimos ---

@app.post("/ingredients/", response_model=dict, status_code=status.HTTP_201_CREATED, tags=["ingredients"])
def create_ingredient(ingredient: Ingredient, session: Session = Depends(get_session)):
    """
    Crea un ingrediente.
    Mensajes de error / éxito en español.
    """
    session.add(ingredient)
    session.flush()  # para obtener id antes del commit si se necesita
    return {"message": "Ingrediente creado", "id": ingredient.id}


@app.get("/ingredients/", response_model=List[Ingredient], tags=["ingredients"])
def list_ingredients(session: Session = Depends(get_session)):
    results = session.exec(select(Ingredient)).all()
    return results


@app.post("/recipes/", response_model=dict, status_code=status.HTTP_201_CREATED, tags=["recipes"])
def create_recipe(recipe: RecipeCreate, session: Session = Depends(get_session)):
    """
    Formato:
    {
        
    }
    """
    session.add(recipe)
    session.flush()  # para obtener recipe.id
    # commit se hace en get_session contextmanager
    return {"message": "Receta creada", "id": recipe.id}


@app.get("/recipes/{recipe_id}/ingredients/", response_model=RecipeWithIngredients, tags=["recipes"])
def get_recipe_detail(recipe_id: int, session: Session = Depends(get_session)):
    """
    Devuelve receta con sus ingredientes (join).
    """
    recipe = session.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")

    # consulta de ingredientes asociados
    results = session.exec(
        select(Ingredient.name, 
               RecipeIngredient.quantity,
               (Ingredient.price * RecipeIngredient.quantity).label("total_price")
        )
        .join(Ingredient, RecipeIngredient.ingredient == Ingredient.id)
        .where(RecipeIngredient.recipe == recipe_id)
    ).all()
    print(results)
    ingredients = [
        RecipeIngredientDetail(name=r[0], quantity=float(r[1]), total_price=float(r[2]))
        for r in results
    ]
    return RecipeWithIngredients(name=recipe.name, ingredients=ingredients)


# --- Endpoint para ver la view recipe_costs que definiste en SQL ---


@app.get("/cost/{recipe_id}", response_model=dict, tags=["recipes"])
def get_recipe_cost(recipe_id: int, session: Session = Depends(get_session)):
    result = session.exec(
        text("SELECT recipe, cost FROM recipe_costs WHERE id = :id")
    , {"id": recipe_id}).first()

    if not result:
        raise HTTPException(status_code=404, detail="Receta no encontrada")

    recipe, cost = result
    return {"recipe": recipe, "cost": float(cost)}
@app.get("/costs/", response_model=List[dict], tags=["recipes"])
def list_recipe_costs(session: Session = Depends(get_session)):
    results = session.exec(text("SELECT recipe, cost FROM recipe_costs")).all()
    return [{"recipe": r, "cost": float(c)} for r, c in results]

