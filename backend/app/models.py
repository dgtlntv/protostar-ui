import enum
import uuid
from typing import Any
from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel, JSON


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    owned_prototypes: list["Prototype"] = Relationship(back_populates="owner", cascade_delete=True)
    shared_prototypes: list["Prototype"] = Relationship(back_populates="collaborators", link_model="PrototypeCollaborator")


class PrototypeVisibility(str, enum.Enum):
    PRIVATE = "private"
    PUBLIC = "public"


class CollaboratorRole(str, enum.Enum):
    VIEWER = "viewer"
    EDITOR = "editor"


# Junction table for prototype collaborators
class PrototypeCollaborator(SQLModel, table=True):
    prototype_id: uuid.UUID = Field(foreign_key="prototype.id", primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", primary_key=True)
    role: CollaboratorRole = Field(default=CollaboratorRole.VIEWER)
    

# Shared properties
class PrototypeBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)
    content: dict[str, Any] = Field(default_factory=dict, sa_type=JSON)
    visibility: PrototypeVisibility = Field(default=PrototypeVisibility.PRIVATE)


# Properties to receive on prototype creation
class PrototypeCreate(PrototypeBase):
    pass


# Properties to receive on prototype update
class PrototypeUpdate(PrototypeBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore
    content: dict[str, Any] | None = None
    visibility: PrototypeVisibility | None = None


# Database model, database table inferred from class name
class Prototype(PrototypeBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="owned_prototypes")
    collaborators: list[User] = Relationship(back_populates="shared_prototypes", link_model="PrototypeCollaborator")


# Properties to return via API, id is always required
class PrototypePublic(PrototypeBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class PrototypesPublic(SQLModel):
    data: list[PrototypePublic]
    count: int


# Collaborator management models
class CollaboratorAdd(SQLModel):
    email: EmailStr
    role: CollaboratorRole


class CollaboratorUpdate(SQLModel):
    role: CollaboratorRole


class CollaboratorDelete(SQLModel):
    email: EmailStr


class CollaboratorInfo(SQLModel):
    email: EmailStr
    role: CollaboratorRole
    user_id: uuid.UUID


class CollaboratorsPublic(SQLModel):
    data: list[CollaboratorInfo]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)