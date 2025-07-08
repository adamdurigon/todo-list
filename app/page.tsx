"use client";

import { TodoList } from "@/app/components/todo-list";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-blue-500 text-lg">Chargement...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6">
        {/* Header conditionnel selon l'état de la session */}
        {session ? (
          // Header pour utilisateur connecté - Version simplifiée avec Tailwind responsive
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
            <div className="text-center sm:text-left px-2 sm:px-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-blue-500 break-words leading-tight">
                Bienvenue, {session.user.name}
              </h1>
              <p className="text-gray-400 text-sm sm:text-base mt-2 sm:mt-1 leading-relaxed">
                Voici la liste de vos tâches à accomplir
              </p>
            </div>
            <div className="flex justify-center sm:justify-end pt-1 sm:pt-0">
              <LogoutButton />
            </div>
          </div>
        ) : (
          // Header pour utilisateur non connecté
          <div className="flex justify-end mb-6">
            <Link href="/login">
              <Button
                variant="outline"
                className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white text-sm sm:text-base"
              >
                Se connecter
              </Button>
            </Link>
          </div>
        )}

        {/* Contenu principal (identique pour tous) */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-blue-500 leading-tight">
              Ma Todo List
            </h1>
            <p className="text-gray-400 text-base sm:text-lg px-4 sm:px-0">
              Gérez vos tâches quotidiennes efficacement
            </p>
          </div>
          <div className="bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-800">
            <TodoList />
          </div>
        </div>
      </div>
    </main>
  );
}
