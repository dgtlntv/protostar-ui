import uuid

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models import (
    CollaboratorInfo,
    CollaboratorRole,
    Prototype,
    PrototypeCollaborator,
    PrototypeCreate,
    User,
    UserCreate,
    UserUpdate,
)


def create_user(*, session: Session, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> User:
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    if "password" in user_data:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def get_user_by_id(*, session: Session, user_id: uuid.UUID) -> User | None:
    statement = select(User).where(User.id == user_id)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def create_prototype(
    *, session: Session, prototype_in: PrototypeCreate, owner_id: uuid.UUID
) -> Prototype:
    db_prototype = Prototype.model_validate(prototype_in, update={"owner_id": owner_id})
    session.add(db_prototype)
    session.commit()
    session.refresh(db_prototype)
    return db_prototype


def get_prototype(*, session: Session, prototype_id: uuid.UUID) -> Prototype | None:
    statement = select(Prototype).where(Prototype.id == prototype_id)
    return session.exec(statement).first()


def get_user_prototypes(*, session: Session, user_id: uuid.UUID) -> list[Prototype]:
    # Get prototypes where user is owner
    owned_statement = select(Prototype).where(Prototype.owner_id == user_id)
    owned_prototypes = session.exec(owned_statement).all()

    # Get prototypes where user is collaborator
    collaborator_statement = (
        select(Prototype)
        .join(PrototypeCollaborator)
        .where(PrototypeCollaborator.user_id == user_id)
    )
    collaborator_prototypes = session.exec(collaborator_statement).all()

    # Use a dictionary with prototype IDs as keys to remove duplicates
    all_prototypes = {p.id: p for p in owned_prototypes + collaborator_prototypes}
    return list(all_prototypes.values())


def get_public_prototypes(*, session: Session) -> list[Prototype]:
    statement = select(Prototype).where(Prototype.visibility == "public")
    return session.exec(statement).all()


# Collaborator management functions
def add_collaborator(
    *,
    session: Session,
    prototype_id: uuid.UUID,
    collaborator_email: str,
    role: CollaboratorRole,
) -> CollaboratorInfo:
    # Get user by email
    user = get_user_by_email(session=session, email=collaborator_email)
    if not user:
        raise ValueError(f"User with email {collaborator_email} not found")

    # Create collaborator relationship
    db_collaborator = PrototypeCollaborator(
        prototype_id=prototype_id, user_id=user.id, role=role
    )
    session.add(db_collaborator)
    session.commit()

    return CollaboratorInfo(email=user.email, role=role, user_id=user.id)


def update_collaborator_role(
    *,
    session: Session,
    prototype_id: uuid.UUID,
    user_id: uuid.UUID,
    new_role: CollaboratorRole,
) -> CollaboratorInfo:
    statement = select(PrototypeCollaborator).where(
        PrototypeCollaborator.prototype_id == prototype_id,
        PrototypeCollaborator.user_id == user_id,
    )
    db_collaborator = session.exec(statement).first()
    if not db_collaborator:
        raise ValueError("Collaborator not found")

    db_collaborator.role = new_role
    session.add(db_collaborator)
    session.commit()

    user = get_user_by_id(session=session, user_id=user_id)
    return CollaboratorInfo(
        email=user.email,  # type: ignore
        role=new_role,
        user_id=user_id,
    )


def remove_collaborator(
    *, session: Session, prototype_id: uuid.UUID, collaborator_email: str
) -> None:
    user = get_user_by_email(session=session, email=collaborator_email)
    if not user:
        raise ValueError(f"User with email {collaborator_email} not found")

    statement = select(PrototypeCollaborator).where(
        PrototypeCollaborator.prototype_id == prototype_id,
        PrototypeCollaborator.user_id == user.id,
    )
    db_collaborator = session.exec(statement).first()
    if not db_collaborator:
        raise ValueError("Collaborator not found")

    session.delete(db_collaborator)
    session.commit()


def get_prototype_collaborators(
    *, session: Session, prototype_id: uuid.UUID
) -> list[CollaboratorInfo]:
    statement = (
        select(PrototypeCollaborator, User)
        .join(User)
        .where(PrototypeCollaborator.prototype_id == prototype_id)
    )
    results = session.exec(statement).all()

    return [
        CollaboratorInfo(email=user.email, role=collab.role, user_id=user.id)
        for collab, user in results
    ]


def can_access_prototype(
    *, session: Session, user_id: uuid.UUID, prototype_id: uuid.UUID
) -> bool:
    prototype = get_prototype(session=session, prototype_id=prototype_id)
    if not prototype:
        return False

    # Check if prototype is public
    if prototype.visibility == "public":
        return True

    # Check if user is owner
    if prototype.owner_id == user_id:
        return True

    # Check if user is collaborator
    statement = select(PrototypeCollaborator).where(
        PrototypeCollaborator.prototype_id == prototype_id,
        PrototypeCollaborator.user_id == user_id,
    )
    return session.exec(statement).first() is not None


def can_edit_prototype(
    *, session: Session, user_id: uuid.UUID, prototype_id: uuid.UUID
) -> bool:
    prototype = get_prototype(session=session, prototype_id=prototype_id)
    if not prototype:
        return False

    # Check if user is owner
    if prototype.owner_id == user_id:
        return True

    # Check if user is editor
    statement = select(PrototypeCollaborator).where(
        PrototypeCollaborator.prototype_id == prototype_id,
        PrototypeCollaborator.user_id == user_id,
        PrototypeCollaborator.role == CollaboratorRole.EDITOR,
    )
    return session.exec(statement).first() is not None
