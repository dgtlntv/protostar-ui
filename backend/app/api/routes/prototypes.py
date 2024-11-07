import uuid
from typing import Any

from fastapi import APIRouter, HTTPException

from app import crud
from app.api.deps import CurrentUser, SessionDep
from app.models import (
    CollaboratorAdd,
    CollaboratorDelete,
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


@router.get("/", response_model=PrototypesPublic)
def read_prototypes(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve prototypes. Returns public prototypes and user's own prototypes.
    """
    # Get prototypes the user has access to
    user_prototypes = crud.get_user_prototypes(session=session, user_id=current_user.id)

    # Apply pagination
    start = skip
    end = skip + limit
    paginated_prototypes = user_prototypes[start:end]

    print(PrototypesPublic(data=paginated_prototypes, count=len(user_prototypes)))

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
    *, session: SessionDep, current_user: CurrentUser, prototype_id: uuid.UUID
) -> Any:
    """
    Get prototype by ID.
    """
    # Check if user can access the prototype
    if not crud.can_access_prototype(
        session=session, user_id=current_user.id, prototype_id=prototype_id
    ):
        raise HTTPException(
            status_code=403, detail="Not enough permissions to access this prototype"
        )

    prototype = crud.get_prototype(session=session, prototype_id=prototype_id)
    if not prototype:
        raise HTTPException(status_code=404, detail="Prototype not found")

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
    # Check if user can edit the prototype
    if not crud.can_edit_prototype(
        session=session, user_id=current_user.id, prototype_id=prototype_id
    ):
        raise HTTPException(
            status_code=403, detail="Not enough permissions to edit this prototype"
        )

    prototype = crud.get_prototype(session=session, prototype_id=prototype_id)
    if not prototype:
        raise HTTPException(status_code=404, detail="Prototype not found")

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
    if not prototype:
        raise HTTPException(status_code=404, detail="Prototype not found")

    if prototype.owner_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Only the owner can delete a prototype"
        )

    session.delete(prototype)
    session.commit()
    return Message(message="Prototype deleted successfully")


# Collaborator management endpoints
@router.get("/{prototype_id}/collaborators", response_model=CollaboratorsPublic)
def read_collaborators(
    *, session: SessionDep, current_user: CurrentUser, prototype_id: uuid.UUID
) -> Any:
    """
    Get all collaborators for a prototype.
    """

    if not crud.can_access_prototype(
        session=session, user_id=current_user.id, prototype_id=prototype_id
    ):
        raise HTTPException(
            status_code=403, detail="Not enough permissions to view collaborators"
        )

    prototype = crud.get_prototype(session=session, prototype_id=prototype_id)
    if not prototype:
        raise HTTPException(status_code=404, detail="Prototype not found")

    collaborators = crud.get_prototype_collaborators(
        session=session, prototype_id=prototype_id
    )

    return CollaboratorsPublic(data=collaborators, count=len(collaborators))


@router.post("/{prototype_id}/collaborators", response_model=CollaboratorInfo)
def add_collaborator(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    prototype_id: uuid.UUID,
    collaborator_in: CollaboratorAdd,
) -> Any:
    """
    Add a collaborator to a prototype. Only owner can add collaborators.
    """
    prototype = crud.get_prototype(session=session, prototype_id=prototype_id)
    if not prototype:
        raise HTTPException(status_code=404, detail="Prototype not found")

    if prototype.owner_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Only the owner can add collaborators"
        )

    try:
        collaborator = crud.add_collaborator(
            session=session,
            prototype_id=prototype_id,
            collaborator_email=collaborator_in.email,
            role=collaborator_in.role,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

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
    if not prototype:
        raise HTTPException(status_code=404, detail="Prototype not found")

    if prototype.owner_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Only the owner can update collaborator roles"
        )

    try:
        collaborator = crud.update_collaborator_role(
            session=session,
            prototype_id=prototype_id,
            user_id=user_id,
            new_role=collaborator_in.role,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return collaborator


@router.delete("/{prototype_id}/collaborators")
def remove_collaborator(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    prototype_id: uuid.UUID,
    collaborator_in: CollaboratorDelete,
) -> Message:
    """
    Remove a collaborator from a prototype. Only owner can remove collaborators.
    """
    prototype = crud.get_prototype(session=session, prototype_id=prototype_id)
    if not prototype:
        raise HTTPException(status_code=404, detail="Prototype not found")

    if prototype.owner_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Only the owner can remove collaborators"
        )

    try:
        crud.remove_collaborator(
            session=session,
            prototype_id=prototype_id,
            collaborator_email=collaborator_in.email,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return Message(message="Collaborator removed successfully")
