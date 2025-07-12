from fastapi import APIRouter, HTTPException
from models.servicio import ServicioCreate, ServicioDB
from config.database import servicio_collection
from bson.objectid import ObjectId

router = APIRouter(prefix="/servicios", tags=["servicios"])

def servicio_helper(servicio) -> dict:
    return {
        "id": str(servicio["_id"]),
        "descripcion": servicio["descripcion"],
        "precio": servicio["precio"],
    }

@router.post("/", response_model=ServicioDB)
async def crear_servicio(servicio: ServicioCreate):
    nuevo_servicio = await servicio_collection.insert_one(servicio.dict())
    servicio_creado = await servicio_collection.find_one({"_id": nuevo_servicio.inserted_id})
    return servicio_helper(servicio_creado)

@router.get("/", response_model=list[ServicioDB])
async def obtener_servicios():
    servicios = []
    cursor = servicio_collection.find()
    async for servicio in cursor:
        servicios.append(servicio_helper(servicio))
    return servicios

@router.get("/{servicio_id}", response_model=ServicioDB)
async def obtener_servicio(servicio_id: str):
    servicio = await servicio_collection.find_one({"_id": ObjectId(servicio_id)})
    if servicio:
        return servicio_helper(servicio)
    raise HTTPException(status_code=404, detail="Servicio no encontrado")

@router.delete("/{servicio_id}")
async def eliminar_servicio(servicio_id: str):
    resultado = await servicio_collection.delete_one({"_id": ObjectId(servicio_id)})
    if resultado.deleted_count == 1:
        return {"message": "Servicio eliminado"}
    raise HTTPException(status_code=404, detail="Servicio no encontrado")
