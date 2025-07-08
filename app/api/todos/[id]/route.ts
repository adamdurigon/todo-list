import { NextRequest } from "next/server";
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  requireAuth,
  validateJsonBody,
} from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { type TodoUpdateRequest } from "@/types";

// GET /api/todos/[id] - Récupérer un todo spécifique
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: todoId } = await context.params;

    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
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

    if (!todo) {
      return createErrorResponse("Todo non trouvé", 404);
    }

    return createSuccessResponse(todo);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/todos/[id] - Mettre à jour un todo
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: todoId } = await context.params;

    const body = await validateJsonBody<TodoUpdateRequest>(request);

    // Vérifier que le todo existe et appartient à l'utilisateur
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: user.id,
      },
    });

    if (!existingTodo) {
      return createErrorResponse("Todo non trouvé", 404);
    }

    // Préparer les données à mettre à jour
    const updateData: Partial<TodoUpdateRequest> = {};

    if (body.text !== undefined) {
      if (body.text.trim().length === 0) {
        return createErrorResponse("Le texte ne peut pas être vide", 400);
      }
      updateData.text = body.text.trim();
    }

    if (body.completed !== undefined) {
      updateData.completed = body.completed;
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: updateData,
      select: {
        id: true,
        text: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });

    return createSuccessResponse(updatedTodo, "Todo mis à jour avec succès");
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/todos/[id] - Supprimer un todo
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: todoId } = await context.params;

    // Vérifier que le todo existe et appartient à l'utilisateur
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: user.id,
      },
    });

    if (!existingTodo) {
      return createErrorResponse("Todo non trouvé", 404);
    }

    await prisma.todo.delete({
      where: { id: todoId },
    });

    return createSuccessResponse(null, "Todo supprimé avec succès");
  } catch (error) {
    return handleApiError(error);
  }
}

// OPTIONS /api/todos/[id] - Gestion CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
