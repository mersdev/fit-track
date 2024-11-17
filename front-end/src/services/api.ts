const API_BASE_URL = 'http://localhost:3000';

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export const todoApi = {
  async getAllTodos(): Promise<TodoItem[]> {
    const response = await fetch(`${API_BASE_URL}/todos`);
    if (!response.ok) throw new Error('Failed to fetch todos');
    return response.json();
  },

  async createTodo(text: string): Promise<TodoItem> {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, completed: false }),
    });
    if (!response.ok) throw new Error('Failed to create todo');
    return response.json();
  },

  async updateTodo(id: number, updates: Partial<TodoItem>): Promise<TodoItem> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update todo');
    return response.json();
  },

  async deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete todo');
  },
};