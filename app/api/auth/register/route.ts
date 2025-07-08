import { NextRequest } from "next/server";
import { hash } from "bcrypt";
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  validateJsonBody,
} from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { RegisterSchema, type RegisterFormData } from "@/types";

// POST /api/auth/register - Créer un nouveau compte utilisateur
export async function POST(request: NextRequest) {
  try {
    const body = await validateJsonBody<RegisterFormData>(request);

    // Validation avec Zod
    const validatedData = RegisterSchema.safeParse(body);

    if (!validatedData.success) {
      return createErrorResponse(
        validatedData.error.errors[0]?.message || "Données invalides",
        400
      );
    }

    const { name, email, password } = validatedData.data;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return createErrorResponse("Un compte avec cet email existe déjà", 409);
    }

    // Hacher le mot de passe
    const hashedPassword = await hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return createSuccessResponse(user, "Compte créé avec succès", 201);
  } catch (error) {
    return handleApiError(error);
  }
}

// OPTIONS /api/auth/register - Gestion CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
