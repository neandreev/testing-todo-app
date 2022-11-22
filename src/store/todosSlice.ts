import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type TodoStatus = 'opened' | 'completed';

export interface FileI {
  name: string;
  url: string;
}

export interface TodoI {
  id: string;
  todo: string;
  filesUrls: FileI[];
  expirationDate: number;
  description: string;
  status: TodoStatus;
}

interface TodosState {
  todos: TodoI[];
  currentTodoId: string;
}

const initialState: TodosState = {
  todos: [],
  currentTodoId: '',
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<TodoI>) => {
      state.todos.push(action.payload);
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      const filteredTodos = state.todos.filter((todo) => todo.id !== action.payload);
      return { ...state, todos: filteredTodos };
    },
    updateTodo: (state, action: PayloadAction<{ id: string, todo: Partial<TodoI> }>) => {
      const todoToUpdate = state.todos.find((todo) => todo.id === action.payload.id);
      const filteredTodos = state.todos.filter((todo) => todo.id !== action.payload.id);
      const updatedTodo = { ...todoToUpdate, ...action.payload.todo } as TodoI;
      return { ...state, todos: [...filteredTodos, updatedTodo] };
    },
    setCurrentTodo: (state, action: PayloadAction<string>) => (
      { ...state, currentTodoId: action.payload }
    ),
    removeCurrentTodo: (state) => ({ ...state, currentTodoId: '' }),
  },
});

export const {
  addTodo, removeTodo, updateTodo, setCurrentTodo, removeCurrentTodo,
} = todosSlice.actions;

export default todosSlice.reducer;
