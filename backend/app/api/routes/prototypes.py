import uuid
from typing import Any, Optional

from fastapi import APIRouter, HTTPException

from app import crud
from app.api.deps import CurrentUser, SessionDep
from app.models import (
    CollaboratorAdd,
    CollaboratorInfo,
    CollaboratorsPublic,
    CollaboratorUpdate,
    Message,
    PrototypeCreate,
    PrototypePublic,
    PrototypesPublic,
    PrototypeUpdate,
)

router = APIRouter()


@router.get("/public/check/{prototype_id}")
def check_prototype_public(
    *, session: SessionDep, prototype_id: uuid.UUID
) -> dict[str, bool]:
    """
    Check if a prototype is public. This endpoint doesn't require authentication.
    """
    prototype = crud.get_prototype(session=session, prototype_id=prototype_id)
    if not prototype:
        raise HTTPException(status_code=404, detail="Prototype not found")
    return {"is_public": prototype.visibility == "public"}


@router.get("/public/{prototype_id}", response_model=PrototypePublic)
def read_public_prototype(
    *, 
    session: SessionDep, 
    prototype_id: uuid.UUID,
) -> Any:
    """
    Get public prototype by ID. No authentication required.
    """
    prototype = crud.get_prototype(session=session, prototype_id=prototype_id)
    if not prototype:
        raise HTTPException(status_code=404, detail="Prototype not found")

    if prototype.visibility != "public":
        raise HTTPException(status_code=404, detail="Prototype not found")
        
    return prototype


@router.get("/", response_model=PrototypesPublic)
def read_prototypes(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve prototypes. Returns public prototypes and user's own prototypes.
    """
    user_prototypes = crud.get_user_prototypes(session=session, user_id=current_user.id)
    start = skip
    end = skip + limit
    paginated_prototypes = user_prototypes[start:end]
    return PrototypesPublic(data=paginated_prototypes, count=len(user_prototypes))


@router.post("/", response_model=PrototypePublic)
def create_prototype(
    *, session: SessionDep, current_user: CurrentUser, prototype_in: PrototypeCreate
) -> Any:
    """
    Create new prototype.
    """
    prototype = crud.create_prototype(
        session=session, prototype_in=prototype_in, owner_id=current_user.id
    )
    return prototype


@router.get("/{prototype_id}", response_model=PrototypePublic)
def read_prototype(
    *, 
    session: SessionDep, 
    prototype_id: uuid.UUID,
    current_user: CurrentUser,
) -> Any:
    """
    Get prototype by ID. Requires authentication and proper access permissions.
    """
    prototype = crud.get_prototype(session=session, prototype_id=prototype_id)
    if not prototype or not crud.can_access_prototype(
        session=session, 
        user_id=current_user.id, 
        prototype_id=prototype_id
    ):
        raise HTTPException(status_code=403, detail="Access denied")
        
    return prototype


@router.put("/{prototype_id}", response_model=PrototypePublic)
def update_prototype(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    prototype_id: uuid.UUID,
    prototype_in: PrototypeUpdate,
) -> Any:
    """
    Update a prototype.
    """
    prototype = crud.get_prototype(session=session, prototype_id=prototype_id)
    if not prototype or not crud.can_edit_prototype(
        session=session, user_id=current_user.id, prototype_id=prototype_id
    ):
        raise HTTPException(status_code=403, detail="Access denied")

    update_dict = prototype_in.model_dump(exclude_unset=True)
    prototype.sqlmodel_update(update_dict)
    session.add(prototype)
    session.commit()
    session.refresh(prototype)
    return prototype


@router.delete("/{prototype_id}")
def delete_prototype(
    *, session: SessionDep, current_user: CurrentUser, prototype_id: uuid.UUID
) -> Message:
    """
    Delete a prototype. Only owner can delete.
    """
    prototype = crud.get_prototype(session=session, prototype_id=prototype_id)
    if not prototype or prototype.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    session.delete(prototype)
    session.commit()
    return Message(message="Prototype deleted successfully")


@router.get("/{prototype_id}/collaborators", response_model=CollaboratorsPublic)
def read_collaborators(
    *, session: SessionDep, current_user: CurrentUser, prototype_id: uuid.UUID
) -> Any:
    """
    Get all collaborators for a prototype.
    """
    prototype = crud.get_prototype(session=session, prototype_id=prototype_id)
    if not prototype or not crud.can_access_prototype(
        session=session, user_id=current_user.id, prototype_id=prototype_id
    ):
        raise HTTPException(status_code=403, detail="Access denied")

    collaborators = crud.get_prototype_collaborators(
        session=session, prototype_id=prototype_id
    )
    return CollaboratorsPublic(data=collaborators, count=len(collaborators))


@router.post("/{prototype_id}/collaborators/{user_id}", response_model=CollaboratorInfo)
def add_collaborator(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    prototype_id: uuid.UUID,
    user_id: uuid.UUID,
    collaborator_in: CollaboratorAdd,
) -> Any:
    """
    Add a collaborator to a prototype using their user ID.
    """
    prototype = crud.get_prototype(session=session, prototype_id=prototype_id)
    if not prototype or prototype.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Check if collaborator already exists
    existing_collaborators = crud.get_prototype_collaborators(
        session=session, prototype_id=prototype_id
    )
    if any(collaborator.user_id == user_id for collaborator in existing_collaborators):
        raise HTTPException(
            status_code=400,
            detail="User is already a collaborator for this prototype",
        )

    try:
        collaborator = crud.add_collaborator(
            session=session,
            prototype_id=prototype_id,
            user_id=user_id,
            role=collaborator_in.role,
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid request")

    return collaborator


@router.put("/{prototype_id}/collaborators/{user_id}", response_model=CollaboratorInfo)
def update_collaborator(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    prototype_id: uuid.UUID,
    user_id: uuid.UUID,
    collaborator_in: CollaboratorUpdate,
) -> Any:
    """
    Update a collaborator's role. Only owner can update roles.
    """
    prototype = crud.get_prototype(session=session, prototype_id=prototype_id)
    if not prototype or prototype.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    try:
        collaborator = crud.update_collaborator_role(
            session=session,
            prototype_id=prototype_id,
            user_id=user_id,
            new_role=collaborator_in.role,
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid request")

    return collaborator


@router.delete("/{prototype_id}/collaborators/{user_id}")
def remove_collaborator(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    prototype_id: uuid.UUID,
    user_id: uuid.UUID,
) -> Message:
    """
    Remove a collaborator from a prototype using their user ID. Only owner can remove collaborators.
    """
    prototype = crud.get_prototype(session=session, prototype_id=prototype_id)
    if not prototype or prototype.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    try:
        crud.remove_collaborator(
            session=session,
            prototype_id=prototype_id,
            user_id=user_id,
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid request")

    return Message(message="Collaborator removed successfully")