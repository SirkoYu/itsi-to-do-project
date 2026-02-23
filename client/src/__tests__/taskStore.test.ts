import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTaskStore } from '../stores/taskStore';
import * as tasksApi from '../api/tasks';
import type { Task } from '../types';

vi.mock('../api/tasks');

const mockTask: Task = {
  id: 1,
  user_id: 1,
  title: 'Test task',
  description: 'A description',
  completed: 0,
  created_at: '2026-01-01T00:00:00.000Z',
};

describe('taskStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('starts with empty task list', () => {
    const store = useTaskStore();
    expect(store.tasks).toEqual([]);
  });

  it('fetchTasks populates the task list', async () => {
    vi.mocked(tasksApi.getAllTasks).mockResolvedValue([mockTask]);

    const store = useTaskStore();
    await store.fetchTasks();

    expect(store.tasks).toHaveLength(1);
    expect(store.tasks[0].title).toBe('Test task');
  });

  it('activeTasks filters completed tasks', async () => {
    vi.mocked(tasksApi.getAllTasks).mockResolvedValue([
      mockTask,
      { ...mockTask, id: 2, completed: 1 },
    ]);

    const store = useTaskStore();
    await store.fetchTasks();

    expect(store.activeTasks).toHaveLength(1);
    expect(store.completedTasks).toHaveLength(1);
  });

  it('addTask prepends to the list', async () => {
    const newTask: Task = { ...mockTask, id: 2, title: 'New task' };
    vi.mocked(tasksApi.createTask).mockResolvedValue(newTask);

    const store = useTaskStore();
    store.tasks = [mockTask];
    await store.addTask({ title: 'New task' });

    expect(store.tasks[0].title).toBe('New task');
    expect(store.tasks).toHaveLength(2);
  });

  it('deleteTask removes task from list', async () => {
    vi.mocked(tasksApi.deleteTask).mockResolvedValue(undefined);

    const store = useTaskStore();
    store.tasks = [mockTask];
    await store.deleteTask(1);

    expect(store.tasks).toHaveLength(0);
  });

  it('sets error on fetchTasks failure', async () => {
    vi.mocked(tasksApi.getAllTasks).mockRejectedValue(new Error('Network error'));

    const store = useTaskStore();
    await store.fetchTasks();

    expect(store.error).not.toBeNull();
    expect(store.tasks).toHaveLength(0);
  });
});
