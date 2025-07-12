from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from bson import ObjectId

class UsuarioBase(BaseModel):
    nombre: str = Field(...)
    email: EmailStr = Field(...)

class UsuarioCreate(UsuarioBase):
    pass

class UsuarioDB(UsuarioBase):
    id: str

    class Config:
        orm_mode = True
