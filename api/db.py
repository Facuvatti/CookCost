# db.py
import logging
from sqlmodel import create_engine, Session, SQLModel
from contextlib import contextmanager
from typing import Generator

# Configura logging básico (mensajes técnicos)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# EJEMPLO: URL de conexión (ajustar usuario/contraseña/host/db)
# Para MySQL con pymysql:
DATABASE_URL = "mysql+pymysql://root:root@localhost:3306/cookcost"

# Crea el engine (pool_pre_ping evita errores por conexiones muertas)
engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)


def create_db_and_tables() -> None:
    """
    Crea las tablas definidas en los modelos.
    Ejecutar una vez (o usar Alembic para migraciones).
    """
    logger.info("Creando tablas en la base de datos (si no existen)...")
    SQLModel.metadata.create_all(engine)
    logger.info("Tablas creadas / verificadas.")


def get_session() -> Generator[Session, None, None]:
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()