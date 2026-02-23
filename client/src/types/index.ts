export interface User {
  id: number;
  email: string;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  completed: 0 | 1;
  created_at: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
}

export interface AuthResponse {
  data: {
    token: string;
    user: User;
  };
}
