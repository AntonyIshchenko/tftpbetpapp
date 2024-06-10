import express from 'express';
import taskCtrls from '../controllers/taskCtrl.js';
import {
    createBoardSchema,
    updateBoardSchema,
    createColumnSchema,
    updateColumnSchema,
    createTaskSchema,
    updateTaskSchema
} from '../schemas/tasksSchemas.js';
import validateBody from '../helpers/validateBody.js';

const taskRouter = express.Router();

// Шляхи до Board
taskRouter.get('/boards', taskCtrls.getAllBoards);
taskRouter.get('/boards/:id', taskCtrls.getOneBoard);
taskRouter.post('/boards',
    validateBody(createBoardSchema),
    taskCtrls.createBoard);
taskRouter.patch('/boards/:id',
    validateBody(updateBoardSchema),
    taskCtrls.editBoard);
taskRouter.delete('/boards/:id', taskCtrls.deleteBoard);

//Шляхи до Column
taskRouter.post(
    '/columns/',
    validateBody(createColumnSchema),
    taskCtrls.createColumn);
taskRouter.patch(
    '/columns/:id',
    validateBody(updateColumnSchema),
    taskCtrls.editColumn);
taskRouter.delete('/columns/:id', taskCtrls.deleteColumn);

//Шляхи до Task
taskRouter.post(
    '/tasks/',
    validateBody(createTaskSchema),
    taskCtrls.createTask);
taskRouter.patch(
    '/tasks/:id',
    validateBody(updateTaskSchema),
    taskCtrls.editTask);
taskRouter.delete('/tasks/:id', taskCtrls.deleteTask);

export default taskRouter;
