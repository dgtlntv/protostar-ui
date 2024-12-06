export type Body_login_login_access_token = {
  grant_type?: string | null
  username: string
  password: string
  scope?: string
  client_id?: string | null
  client_secret?: string | null
}

export type CollaboratorAdd = {
  role: CollaboratorRole
}

export type CollaboratorInfo = {
  user_id: string
  role: CollaboratorRole
}

export type CollaboratorRole = "viewer" | "editor"

export type CollaboratorUpdate = {
  role: CollaboratorRole
}

export type CollaboratorsPublic = {
  data: Array<CollaboratorInfo>
  count: number
}

export type HTTPValidationError = {
  detail?: Array<ValidationError>
}

export type Message = {
  message: string
}

export type NewPassword = {
  token: string
  new_password: string
}

export type PrototypeCreate = {
  title: string
  description?: string | null
  content?: Record<string, unknown>
  visibility?: string
}

export type PrototypePublic = {
  title: string
  description?: string | null
  content?: Record<string, unknown>
  visibility?: string
  id: string
  owner_id: string
}

export type PrototypeUpdate = {
  title?: string | null
  description?: string | null
  content?: Record<string, unknown> | null
  visibility?: string | null
}

export type PrototypesPublic = {
  data: Array<PrototypePublic>
  count: number
}

export type Token = {
  access_token: string
  token_type?: string
}

export type UpdatePassword = {
  current_password: string
  new_password: string
}

export type UserCreate = {
  email: string
  is_active?: boolean
  is_superuser?: boolean
  full_name?: string | null
  password: string
}

export type UserPublic = {
  email: string
  is_active?: boolean
  is_superuser?: boolean
  full_name?: string | null
  id: string
}

export type UserRegister = {
  email: string
  password: string
  full_name?: string | null
}

export type UserUpdate = {
  email?: string | null
  is_active?: boolean
  is_superuser?: boolean
  full_name?: string | null
  password?: string | null
}

export type UserUpdateMe = {
  full_name?: string | null
  email?: string | null
}

export type UsersPublic = {
  data: Array<UserPublic>
  count: number
}

export type ValidationError = {
  loc: Array<string | number>
  msg: string
  type: string
}
