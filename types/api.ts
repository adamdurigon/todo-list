/**
 * Types pour les API et les réponses HTTP
 */

/**
 * Structure de réponse API standardisée
 * @template T Type des données retournées
 */
export interface ApiResponse<T = unknown> {
  /** Données de la réponse (optionnel) */
  data?: T;
  /** Message d'erreur (optionnel) */
  error?: string;
  /** Message informatif (optionnel) */
  message?: string;
}

/**
 * Requête de création d'une nouvelle tâche
 */
export interface TodoCreateRequest {
  /** Texte de la tâche à créer */
  text: string;
}

/**
 * Requête de mise à jour d'une tâche existante
 */
export interface TodoUpdateRequest {
  /** Nouveau texte de la tâche (optionnel) */
  text?: string;
  /** Nouvel état de completion (optionnel) */
  completed?: boolean;
}

/**
 * Paramètres de pagination pour les API
 */
export interface PaginationParams {
  /** Numéro de page (défaut: 1) */
  page?: number;
  /** Nombre d'éléments par page (défaut: 10) */
  limit?: number;
}

/**
 * Réponse paginée standardisée
 * @template T Type des éléments dans la liste
 */
export interface PaginatedResponse<T> {
  /** Liste des éléments */
  data: T[];
  /** Informations de pagination */
  pagination: {
    /** Page actuelle */
    page: number;
    /** Nombre d'éléments par page */
    limit: number;
    /** Nombre total d'éléments */
    total: number;
    /** Nombre total de pages */
    totalPages: number;
  };
}
