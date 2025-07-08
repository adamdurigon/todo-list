import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation avec Zod
    const validatedFields = LoginSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { errorType: "INVALID_DATA", message: "Données invalides" },
        { status: 400 }
      );
    }

    const { email, password } = validatedFields.data;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { errorType: "USER_NOT_FOUND", message: "Utilisateur introuvable" },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { errorType: "INVALID_PASSWORD", message: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Si tout est valide (ne devrait pas arriver dans ce contexte)
    return NextResponse.json(
      { errorType: "UNKNOWN", message: "Erreur inconnue" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Check credentials error:", error);
    return NextResponse.json(
      { errorType: "SERVER_ERROR", message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
