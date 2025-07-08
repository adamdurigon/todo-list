/**
 * Types pour les entités de base de données
 * Correspond aux modèles Prisma
 */

/**
 * Représente un utilisateur dans la base de données
 * @interface User
 */
export interface User {
  /** Identifiant unique de l'utilisateur */
  id: string;
  /** Nom complet de l'utilisateur */
  name: string;
  /** Adresse email (unique) */
  email: string;
  /** Mot de passe haché */
  password: string;
  /** Date de création du compte */
  createdAt: Date;
  /** Date de dernière mise à jour */
  updatedAt: Date;
}

/**
 * Représente une tâche dans la base de données
 * @interface Todo
 */
export interface Todo {
  /** Identifiant unique de la tâche */
  id: string;
  /** Texte de la tâche */
  text: string;
  /** État de completion de la tâche */
  completed: boolean;
  /** Date de création de la tâche */
  createdAt: Date;
  /** Date de dernière mise à jour */
  updatedAt: Date;
  /** Identifiant de l'utilisateur propriétaire */
  userId: string;
}
