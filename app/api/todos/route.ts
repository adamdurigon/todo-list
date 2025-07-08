import { NextRequest } from "next/server";
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  requireAuth,
  validateJsonBody,
} from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { TodoSchema, type TodoCreateRequest } from "@/types";

// GET /api/todos - Récupérer tous les todos de l'utilisateur connecté
export async function GET() {
  try {
    const user = await requireAuth();

    const todos = await prisma.todo.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        text: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });

    return createSuccessResponse(todos);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/todos - Créer un nouveau todo
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await validateJsonBody<TodoCreateRequest>(request);

    // Validation avec Zod
    const validatedData = TodoSchema.safeParse({ text: body.text });

    if (!validatedData.success) {
      return createErrorResponse(
        validatedData.error.errors[0]?.message || "Données invalides",
        400
      );
    }

    const todo = await prisma.todo.create({
      data: {
        text: validatedData.data.text,
        userId: user.id,
      },
      select: {
        id: true,
        text: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });

    return createSuccessResponse(todo, "Todo créé avec succès", 201);
  } catch (error) {
    return handleApiError(error);
  }
}

// OPTIONS /api/todos - Gestion CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
