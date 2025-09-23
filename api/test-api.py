# test_api.py
import pytest
from fastapi.testclient import TestClient
from app import app
from db import create_db_and_tables, engine
from sqlmodel import SQLModel, Session
import os

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def prepare_db():
    # Para tests rápidos: crea tablas en la DB configurada (usa una DB de pruebas)
    create_db_and_tables()
    yield
    # NOTA: en tests reales conviene limpiar o usar sqlite memory.

def test_create_and_list_ingredient():
    payload = {"name": "Test Flour", "price": "10.50", "unit": "kg"}
    r = client.post("/ingredients/", json=payload)
    assert r.status_code == 201
    data = r.json()
    assert "id" in data

    r2 = client.get("/ingredients/")
    assert r2.status_code == 200
    assert any(i["name"] == "Test Flour" for i in r2.json())
