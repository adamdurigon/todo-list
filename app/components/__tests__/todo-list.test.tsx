import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TodoList } from "../todo-list";
import { useSession } from "next-auth/react";
import { useTodos } from "@/hooks/use-todos";

// Mock sonner
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
}));
import "@testing-library/jest-dom";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

// Mock useTodos hook
jest.mock("@/hooks/use-todos", () => ({
  useTodos: jest.fn(),
}));

const mockUseTodos = useTodos as jest.MockedFunction<typeof useTodos>;
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

describe("TodoList", () => {
  const mockTodos = [
    {
      id: "1",
      text: "Test Todo 1",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user1",
    },
    {
      id: "2",
      text: "Test Todo 2",
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user1",
    },
  ];

  const defaultMockReturn = {
    todos: [],
    isLoading: false,
    error: null,
    addTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
    toggleTodo: jest.fn(),
    refreshTodos: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTodos.mockReturnValue(defaultMockReturn);
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: jest.fn(),
    });
  });

  it("renders empty state when no todos", () => {
    render(<TodoList />);

    expect(
      screen.getByPlaceholderText("Ajouter une nouvelle tâche...")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Aucune tâche pour le moment.")
    ).toBeInTheDocument();
  });

  it("renders todos correctly", () => {
    mockUseTodos.mockReturnValue({
      ...defaultMockReturn,
      todos: mockTodos,
    });

    render(<TodoList />);

    expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
  });

  it("shows completed todo with line-through style", () => {
    mockUseTodos.mockReturnValue({
      ...defaultMockReturn,
      todos: mockTodos,
    });

    render(<TodoList />);

    const completedTodo = screen.getByText("Test Todo 2");
    expect(completedTodo).toHaveClass("line-through");
  });

  it("calls addTodo when form is submitted", async () => {
    const mockAddTodo = jest.fn();
    mockUseTodos.mockReturnValue({
      ...defaultMockReturn,
      addTodo: mockAddTodo,
    });

    render(<TodoList />);

    const input = screen.getByPlaceholderText("Ajouter une nouvelle tâche...");
    const submitButton = screen.getByRole("button", { name: /ajouter/i });

    fireEvent.change(input, { target: { value: "New Todo" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddTodo).toHaveBeenCalledWith("New Todo");
    });
  });

  it("calls toggleTodo when checkbox is clicked", async () => {
    const mockToggleTodo = jest.fn();
    mockUseTodos.mockReturnValue({
      ...defaultMockReturn,
      todos: mockTodos,
      toggleTodo: mockToggleTodo,
    });

    render(<TodoList />);

    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockToggleTodo).toHaveBeenCalledWith("1", true);
    });
  });

  it("calls deleteTodo when delete button is clicked", async () => {
    const mockDeleteTodo = jest.fn();
    mockUseTodos.mockReturnValue({
      ...defaultMockReturn,
      todos: mockTodos,
      deleteTodo: mockDeleteTodo,
    });

    render(<TodoList />);

    const deleteButtons = screen.getAllByLabelText("Supprimer");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteTodo).toHaveBeenCalledWith("1");
    });
  });

  it("shows loading state", () => {
    mockUseTodos.mockReturnValue({
      ...defaultMockReturn,
      isLoading: true,
    });

    render(<TodoList />);

    expect(screen.getByRole("button", { name: /ajouter/i })).toBeDisabled();
  });

  it("shows error message", () => {
    mockUseTodos.mockReturnValue({
      ...defaultMockReturn,
      error: "Test error message",
    });

    render(<TodoList />);

    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  it("shows local storage message for unauthenticated users with todos", () => {
    mockUseTodos.mockReturnValue({
      ...defaultMockReturn,
      todos: mockTodos,
    });
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: jest.fn(),
    });

    render(<TodoList />);

    expect(
      screen.getByText(/Ces todos sont stockés localement/)
    ).toBeInTheDocument();
  });

  it("shows statistics correctly", () => {
    mockUseTodos.mockReturnValue({
      ...defaultMockReturn,
      todos: mockTodos,
    });

    render(<TodoList />);

    expect(screen.getByText("1 tâche(s) restante(s)")).toBeInTheDocument();
    expect(screen.getByText("1 / 2 terminée(s)")).toBeInTheDocument();
  });

  it("does not submit empty todos", async () => {
    const mockAddTodo = jest.fn();
    mockUseTodos.mockReturnValue({
      ...defaultMockReturn,
      addTodo: mockAddTodo,
    });

    render(<TodoList />);

    const submitButton = screen.getByRole("button", { name: /ajouter/i });
    fireEvent.click(submitButton);

    expect(mockAddTodo).not.toHaveBeenCalled();
  });
});
