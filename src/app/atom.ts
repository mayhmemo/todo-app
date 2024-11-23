import { create } from 'zustand'

type FormTodoStateProps = {
  name: string,
  setName: (newName: string) => void
}

export const useTodoFormState = create<FormTodoStateProps>((set) => ({
  name: '',
  setName: (newName) => set({ name: newName })
}))

export type TodoProps = {
  id: number,
  name: string,
  isCompleted: boolean
}

type TodoStateProps = {
  todos: TodoProps[],
  setTodos: (todos: TodoProps[]) => void
  addTodo: (newTodo: TodoProps) => void
  removeTodo: (todoId: number) => void
}

export const useTodoState = create<TodoStateProps>((set) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
  addTodo: (newTodo) => set((state) => ({ todos: [ ...state.todos, newTodo ] })),
  removeTodo: (todoId) => set((state) => ({ todos: state.todos.filter(t => t.id !== todoId) }))
}))
