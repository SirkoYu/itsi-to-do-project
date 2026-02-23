export interface User {
  id: number;
  email: string;
  password: string;
  created_at: string;
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

export interface RegisterDto {
  email: string;
  password: string;
}

// Extend Express Request to include userId set by authenticate middleware
declare global {
  namespace Express {
    interface Request {
      userId: number;
    }
  }
}
