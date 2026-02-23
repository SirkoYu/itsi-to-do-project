import { Router, Request, Response, NextFunction } from 'express';
import { dbAll, dbGet, dbRun } from '../database';
import { authenticate } from '../middleware/authenticate';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types';

export const tasksRouter = Router();

tasksRouter.use(authenticate);

tasksRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await dbAll<Task>(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId],
    );
    res.json({ data: tasks });
  } catch (err) {
    next(err);
  }
});

tasksRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await dbGet<Task>(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId],
    );
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json({ data: task });
  } catch (err) {
    next(err);
  }
});

tasksRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description = '' }: CreateTaskDto = req.body;

    if (!title || title.trim() === '') {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const result = await dbRun(
      'INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)',
      [req.userId, title.trim(), description.trim()],
    );

    const task = await dbGet<Task>('SELECT * FROM tasks WHERE id = ?', [result.lastID]);
    res.status(201).json({ data: task });
  } catch (err) {
    next(err);
  }
});

tasksRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description }: UpdateTaskDto = req.body;

    if (title === undefined && description === undefined) {
      res.status(400).json({ error: 'At least one field (title or description) is required' });
      return;
    }

    const existing = await dbGet<Task>(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId],
    );
    if (!existing) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const newTitle = title !== undefined ? title.trim() : existing.title;
    const newDesc = description !== undefined ? description.trim() : existing.description;

    if (newTitle === '') {
      res.status(400).json({ error: 'Title cannot be empty' });
      return;
    }

    await dbRun(
      'UPDATE tasks SET title = ?, description = ? WHERE id = ? AND user_id = ?',
      [newTitle, newDesc, req.params.id, req.userId],
    );

    const updated = await dbGet<Task>('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
});

tasksRouter.patch('/:id/toggle', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await dbGet<Task>(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId],
    );
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const newCompleted = task.completed === 0 ? 1 : 0;
    await dbRun(
      'UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?',
      [newCompleted, req.params.id, req.userId],
    );

    const updated = await dbGet<Task>('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
});

tasksRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await dbGet<Task>(
      'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId],
    );
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    await dbRun('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
