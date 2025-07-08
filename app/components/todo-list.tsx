"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useTodos } from "@/hooks/use-todos";
import type { TodoListProps } from "@/types";

export function TodoList({ className }: TodoListProps) {
  const { data: session } = useSession();
  const [newTodoText, setNewTodoText] = useState("");
  const {
    todos: rawTodos,
    isLoading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos();

  // S'assurer que todos est toujours un tableau
  const todos = Array.isArray(rawTodos) ? rawTodos : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    await addTodo(newTodoText);
    setNewTodoText("");
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await toggleTodo(id, completed);
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
  };

  return (
    <div className={className}>
      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Ajouter une nouvelle tâche..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !newTodoText.trim()}
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span className="sr-only">Ajouter</span>
          </Button>
        </div>
      </form>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Message pour utilisateurs non connectés */}
      {!session && todos.length > 0 && (
        <div className="mb-4 p-3 border border-blue-400/40 bg-blue-400/15 rounded-lg">
          <p className="text-sm text-blue-200">
            Ces todos sont stockés localement. Pour les synchroniser entre vos
            appareils,{" "}
            <a
              href="/login"
              className="underline hover:text-blue-100 text-blue-200"
            >
              connectez-vous
            </a>
            .
          </p>
        </div>
      )}

      {/* Liste des todos */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>Aucune tâche pour le moment.</p>
            <p className="text-sm mt-1">
              Ajoutez votre première tâche ci-dessus !
            </p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={(checked) =>
                  handleToggle(todo.id, checked as boolean)
                }
                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />

              <span
                className={`flex-1 transition-all ${
                  todo.completed
                    ? "line-through text-gray-500"
                    : "text-gray-200"
                }`}
              >
                {todo.text}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(todo.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Supprimer</span>
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Statistiques */}
      {todos.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex justify-between text-sm text-gray-400">
            <span>
              {todos.filter((todo) => !todo.completed).length} tâche(s)
              restante(s)
            </span>
            <span>
              {todos.filter((todo) => todo.completed).length} / {todos.length}{" "}
              terminée(s)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
