from fastapi import APIRouter

from app.api.routes import login, prototypes, users, utils

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(prototypes.router, prefix="/prototypes", tags=["prototypes"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
