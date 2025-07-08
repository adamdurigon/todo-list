/**
 * Types pour l'authentification et NextAuth
 */

/**
 * Utilisateur étendu avec les propriétés nécessaires
 */
export interface ExtendedUser {
  /** Identifiant unique de l'utilisateur */
  id: string;
  /** Nom complet de l'utilisateur */
  name: string;
  /** Adresse email de l'utilisateur */
  email: string;
}

/**
 * Augmentation des modules NextAuth pour typage personnalisé
 */
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }

  interface User extends ExtendedUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

/**
 * Réponse de vérification des identifiants
 */
export interface CredentialsCheckResponse {
  /** Indique si les identifiants sont valides */
  valid: boolean;
  /** Type d'erreur si les identifiants sont invalides */
  errorType?: string;
  /** Message d'erreur détaillé */
  message?: string;
}

/**
 * Données de session utilisateur
 */
export interface UserSession {
  /** Informations utilisateur */
  user: ExtendedUser;
  /** Token de session */
  token?: string;
  /** Date d'expiration */
  expires: string;
}

/**
 * Configuration d'authentification
 */
export interface AuthConfig {
  /** URL de base pour l'authentification */
  baseUrl: string;
  /** Durée de session en secondes */
  sessionMaxAge: number;
  /** Pages personnalisées */
  pages: {
    signIn: string;
    error: string;
  };
}
