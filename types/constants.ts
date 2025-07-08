/**
 * Constantes typées pour l'application
 */

/**
 * États possibles d'une tâche
 */
export const TODO_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  ARCHIVED: "archived",
} as const;

export type TodoStatus = (typeof TODO_STATUS)[keyof typeof TODO_STATUS];

/**
 * Endpoints de l'API
 */
export const API_ENDPOINTS = {
  TODOS: "/api/todos",
  AUTH: "/api/auth",
  USERS: "/api/users",
  REGISTER: "/api/auth/register",
  LOGIN: "/api/auth/login",
  CHECK_CREDENTIALS: "/api/auth/check-credentials",
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];

/**
 * Méthodes HTTP supportées
 */
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];

/**
 * Codes de statut HTTP courants
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

/**
 * Types d'erreurs d'authentification
 */
export const AUTH_ERROR_TYPES = {
  USER_NOT_FOUND: "USER_NOT_FOUND",
  INVALID_PASSWORD: "INVALID_PASSWORD",
  INVALID_DATA: "INVALID_DATA",
  SERVER_ERROR: "SERVER_ERROR",
} as const;

export type AuthErrorType =
  (typeof AUTH_ERROR_TYPES)[keyof typeof AUTH_ERROR_TYPES];

/**
 * Messages d'erreur d'authentification
 */
export const AUTH_ERROR_MESSAGES = {
  [AUTH_ERROR_TYPES.USER_NOT_FOUND]:
    "Aucun utilisateur ne correspond à cette adresse email",
  [AUTH_ERROR_TYPES.INVALID_PASSWORD]: "Le mot de passe saisi est incorrect",
  [AUTH_ERROR_TYPES.INVALID_DATA]: "Données invalides",
  [AUTH_ERROR_TYPES.SERVER_ERROR]: "Erreur serveur",
} as const;

/**
 * Tailles de pagination par défaut
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

/**
 * Limites de validation pour les formulaires
 */
export const VALIDATION_LIMITS = {
  TODO_TEXT_MAX_LENGTH: 500,
  USER_NAME_MIN_LENGTH: 2,
  USER_NAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_MAX_LENGTH: 255,
} as const;
