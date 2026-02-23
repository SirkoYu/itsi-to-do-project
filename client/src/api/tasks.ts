import { api } from './index';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types';

interface TaskResponse {
  data: Task;
}

interface TasksResponse {
  data: Task[];
}

export async function getAllTasks(): Promise<Task[]> {
  const { data } = await api.get<TasksResponse>('/tasks');
  return data.data;
}

export async function createTask(dto: CreateTaskDto): Promise<Task> {
  const { data } = await api.post<TaskResponse>('/tasks', dto);
  return data.data;
}

export async function updateTask(id: number, dto: UpdateTaskDto): Promise<Task> {
  const { data } = await api.patch<TaskResponse>(`/tasks/${id}`, dto);
  return data.data;
}

export async function toggleTask(id: number): Promise<Task> {
  const { data } = await api.patch<TaskResponse>(`/tasks/${id}/toggle`);
  return data.data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
