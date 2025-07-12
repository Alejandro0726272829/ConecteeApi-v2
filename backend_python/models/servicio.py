from pydantic import BaseModel, Field
from typing import Optional

class ServicioBase(BaseModel):
    descripcion: str = Field(...)
    precio: float = Field(...)

class ServicioCreate(ServicioBase):
    pass

class ServicioDB(ServicioBase):
    id: str

    class Config:
        orm_mode = True
