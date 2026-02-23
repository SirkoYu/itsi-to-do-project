import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as tasksApi from '../api/tasks';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types';

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const activeTasks = computed(() => tasks.value.filter((t) => t.completed === 0));
  const completedTasks = computed(() => tasks.value.filter((t) => t.completed === 1));

  async function fetchTasks() {
    isLoading.value = true;
    error.value = null;
    try {
      tasks.value = await tasksApi.getAllTasks();
    } catch {
      error.value = 'Failed to load tasks. Please try again.';
    } finally {
      isLoading.value = false;
    }
  }

  async function addTask(dto: CreateTaskDto) {
    const newTask = await tasksApi.createTask(dto);
    tasks.value.unshift(newTask);
  }

  async function updateTask(id: number, dto: UpdateTaskDto) {
    const updated = await tasksApi.updateTask(id, dto);
    const index = tasks.value.findIndex((t) => t.id === id);
    if (index !== -1) tasks.value[index] = updated;
  }

  async function toggleTask(id: number) {
    const toggled = await tasksApi.toggleTask(id);
    const index = tasks.value.findIndex((t) => t.id === id);
    if (index !== -1) tasks.value[index] = toggled;
  }

  async function deleteTask(id: number) {
    await tasksApi.deleteTask(id);
    tasks.value = tasks.value.filter((t) => t.id !== id);
  }

  return {
    tasks,
    isLoading,
    error,
    activeTasks,
    completedTasks,
    fetchTasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
  };
});
