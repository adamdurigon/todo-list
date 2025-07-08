import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import type {
  Todo,
  TodoCreateRequest,
  TodoUpdateRequest,
  ApiResponse,
} from "@/types";

interface UseTodosReturn {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  addTodo: (text: string) => Promise<void>;
  updateTodo: (id: string, updates: TodoUpdateRequest) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
  refreshTodos: () => Promise<void>;
}

export function useTodos(): UseTodosReturn {
  const { data: session } = useSession();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les todos depuis l'API ou localStorage
  const loadTodos = useCallback(async () => {
    if (session) {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/todos");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des todos");
        }

        const result: ApiResponse<Todo[]> = await response.json();

        // Vérifier si la réponse contient des données
        if (result.data && Array.isArray(result.data)) {
          setTodos(result.data);
        } else if (result.error) {
          throw new Error(result.error);
        } else {
          // Fallback si la structure est différente
          setTodos([]);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur inconnue";
        setError(errorMessage);
        // En cas d'erreur, s'assurer que todos est un tableau vide
        setTodos([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Charger depuis localStorage pour les utilisateurs non connectés
      try {
        const localTodos = localStorage.getItem("todos");
        if (localTodos) {
          const parsedTodos = JSON.parse(localTodos);
          // Vérifier que c'est bien un tableau
          if (Array.isArray(parsedTodos)) {
            setTodos(parsedTodos);
          } else {
            setTodos([]);
          }
        } else {
          setTodos([]);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des todos locaux:", err);
        setTodos([]);
      }
    }
  }, [session]);

  // Sauvegarder les todos localement
  const saveTodosLocally = useCallback(
    (todosToSave: Todo[]) => {
      if (!session && Array.isArray(todosToSave)) {
        try {
          localStorage.setItem("todos", JSON.stringify(todosToSave));
        } catch (err) {
          console.error("Erreur lors de la sauvegarde locale:", err);
        }
      }
    },
    [session]
  );

  // Ajouter un todo
  const addTodo = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setIsLoading(true);
      setError(null);

      try {
        if (session) {
          // Ajouter via l'API
          const response = await fetch("/api/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text } as TodoCreateRequest),
          });

          if (!response.ok) {
            throw new Error("Erreur lors de l'ajout du todo");
          }

          const result: ApiResponse<Todo> = await response.json();

          if (result.data) {
            setTodos((prev) =>
              Array.isArray(prev) ? [result.data!, ...prev] : [result.data!]
            );
          } else if (result.error) {
            throw new Error(result.error);
          }
        } else {
          // Ajouter localement
          const newTodo: Todo = {
            id: Date.now().toString(),
            text,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: "local",
          };

          const currentTodos = Array.isArray(todos) ? todos : [];
          const updatedTodos = [newTodo, ...currentTodos];
          setTodos(updatedTodos);
          saveTodosLocally(updatedTodos);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur inconnue";
        setError(errorMessage);
        toast.error("Erreur", {
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [session, todos, saveTodosLocally]
  );

  // Mettre à jour un todo
  const updateTodo = useCallback(
    async (id: string, updates: TodoUpdateRequest) => {
      setError(null);

      try {
        if (session) {
          const response = await fetch(`/api/todos/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          });

          if (!response.ok) {
            throw new Error("Erreur lors de la mise à jour du todo");
          }
        }

        // Mettre à jour localement
        const currentTodos = Array.isArray(todos) ? todos : [];
        const updatedTodos = currentTodos.map((todo) =>
          todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo
        );

        setTodos(updatedTodos);
        saveTodosLocally(updatedTodos);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur inconnue";
        setError(errorMessage);
        toast.error("Erreur", {
          description: errorMessage,
        });
      }
    },
    [session, todos, saveTodosLocally]
  );

  // Toggle todo
  const toggleTodo = useCallback(
    async (id: string, completed: boolean) => {
      await updateTodo(id, { completed });
    },
    [updateTodo]
  );

  // Supprimer un todo
  const deleteTodo = useCallback(
    async (id: string) => {
      setError(null);

      try {
        if (session) {
          const response = await fetch(`/api/todos/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Erreur lors de la suppression du todo");
          }
        }

        // Supprimer localement
        const currentTodos = Array.isArray(todos) ? todos : [];
        const updatedTodos = currentTodos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
        saveTodosLocally(updatedTodos);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur inconnue";
        setError(errorMessage);
        toast.error("Erreur", {
          description: errorMessage,
        });
      }
    },
    [session, todos, saveTodosLocally]
  );

  // Rafraîchir les todos
  const refreshTodos = useCallback(async () => {
    await loadTodos();
  }, [loadTodos]);

  // Charger les todos au montage et lors des changements de session
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return {
    todos: Array.isArray(todos) ? todos : [], // S'assurer que todos est toujours un tableau
    isLoading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refreshTodos,
  };
}
