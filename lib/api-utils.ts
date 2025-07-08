import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, PaginationParams } from "@/types";

import { authOptions } from "@/lib/auth-config";

// ============================================================================
// API RESPONSE HELPERS
// ============================================================================

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      data,
      message,
    },
    { status }
  );
}

export function createErrorResponse(
  error: string,
  status: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      error,
    },
    { status }
  );
}

// ============================================================================
// AUTHENTICATION HELPERS
// ============================================================================

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Non autorisé");
  }

  return user;
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error("API Error:", error);

  if (error instanceof Error) {
    // Erreurs spécifiques
    if (error.message === "Non autorisé") {
      return createErrorResponse("Non autorisé", 401);
    }

    if (error.message.includes("not found")) {
      return createErrorResponse("Ressource non trouvée", 404);
    }

    return createErrorResponse(error.message, 400);
  }

  // Erreur générique
  return createErrorResponse("Une erreur interne est survenue", 500);
}

// ============================================================================
// REQUEST VALIDATION
// ============================================================================

export async function validateJsonBody<T>(
  request: Request,
  validator?: (data: unknown) => T
): Promise<T> {
  try {
    const body = await request.json();

    if (validator) {
      return validator(body);
    }

    return body as T;
  } catch {
    throw new Error("Corps de requête JSON invalide");
  }
}

// ============================================================================
// CORS HELPERS
// ============================================================================

export function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

// ============================================================================
// PAGINATION HELPERS
// ============================================================================

// PaginationParams est maintenant importé depuis types/api.ts

export function getPaginationParams(
  searchParams: URLSearchParams
): PaginationParams {
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)), // Limite entre 1 et 100
  };
}

export function calculatePagination(params: PaginationParams) {
  const { page = 1, limit = 10 } = params;
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    page,
    limit,
  };
}
