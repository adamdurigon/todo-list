import { z } from "zod";
import { VALIDATION_LIMITS } from "./constants";

/**
 * Schémas de validation Zod pour les formulaires
 */

/**
 * Schéma de validation pour la connexion
 */
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide")
    .max(VALIDATION_LIMITS.EMAIL_MAX_LENGTH, "Email trop long"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(VALIDATION_LIMITS.PASSWORD_MIN_LENGTH, "Mot de passe trop court"),
});

/**
 * Schéma de validation pour l'inscription
 */
export const RegisterSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .min(VALIDATION_LIMITS.USER_NAME_MIN_LENGTH, "Nom trop court")
    .max(VALIDATION_LIMITS.USER_NAME_MAX_LENGTH, "Nom trop long")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom contient des caractères invalides"),
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide")
    .max(VALIDATION_LIMITS.EMAIL_MAX_LENGTH, "Email trop long"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(VALIDATION_LIMITS.PASSWORD_MIN_LENGTH, "Mot de passe trop court")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,;:/?+=()_-])/,
      "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial"
    ),
});

/**
 * Schéma de validation pour les todos
 */
export const TodoSchema = z.object({
  text: z
    .string()
    .min(1, "Le texte est requis")
    .max(VALIDATION_LIMITS.TODO_TEXT_MAX_LENGTH, "Texte trop long")
    .trim(),
});

/**
 * Types inférés des schémas Zod
 */
export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type TodoFormData = z.infer<typeof TodoSchema>;
