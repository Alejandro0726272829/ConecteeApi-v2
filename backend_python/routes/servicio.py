from fastapi import APIRouter, HTTPException
from models.usuario import UsuarioCreate, UsuarioDB
from config.database import usuario_collection
from bson.objectid import ObjectId

router = APIRouter(prefix="/usuarios", tags=["usuarios"])

def usuario_helper(usuario) -> dict:
    return {
        "id": str(usuario["_id"]),
        "nombre": usuario["nombre"],
        "email": usuario["email"],
    }

@router.post("/", response_model=UsuarioDB)
async def crear_usuario(usuario: UsuarioCreate):
    usuario_existente = await usuario_collection.find_one({"email": usuario.email})
    if usuario_existente:
        raise HTTPException(status_code=400, detail="Usuario ya existe")
    nuevo_usuario = await usuario_collection.insert_one(usuario.dict())
    usuario_creado = await usuario_collection.find_one({"_id": nuevo_usuario.inserted_id})
    return usuario_helper(usuario_creado)

@router.get("/", response_model=list[UsuarioDB])
async def obtener_usuarios():
    usuarios = []
    cursor = usuario_collection.find()
    async for usuario in cursor:
        usuarios.append(usuario_helper(usuario))
    return usuarios

@router.get("/{usuario_id}", response_model=UsuarioDB)
async def obtener_usuario(usuario_id: str):
    usuario = await usuario_collection.find_one({"_id": ObjectId(usuario_id)})
    if usuario:
        return usuario_helper(usuario)
    raise HTTPException(status_code=404, detail="Usuario no encontrado")

@router.delete("/{usuario_id}")
async def eliminar_usuario(usuario_id: str):
    resultado = await usuario_collection.delete_one({"_id": ObjectId(usuario_id)})
    if resultado.deleted_count == 1:
        return {"message": "Usuario eliminado"}
    raise HTTPException(status_code=404, detail="Usuario no encontrado")
