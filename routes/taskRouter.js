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
import validateId from '../middlewares/validateId.js';

const taskRouter = express.Router();

// Шляхи до Board
taskRouter.get('/boards', taskCtrls.getAllBoards);
taskRouter.post('/boards',  validateBody(createBoardSchema), taskCtrls.createBoard);
taskRouter.get('/boards/:id', validateId, taskCtrls.getOneBoard);
taskRouter.patch('/boards/:id', validateId,  validateBody(updateBoardSchema), taskCtrls.editBoard);
taskRouter.delete('/boards/:id', validateId, taskCtrls.deleteBoard);

//Шляхи до Column
taskRouter.post('/columns', validateBody(createColumnSchema), taskCtrls.createColumn);
taskRouter.patch('/columns/:id', validateId, validateBody(updateColumnSchema), taskCtrls.editColumn);
taskRouter.delete('/columns/:id', validateId, taskCtrls.deleteColumn);

//Шляхи до Task
taskRouter.post('/tasks', validateBody(createTaskSchema), taskCtrls.createTask);
taskRouter.patch('/tasks/:id', validateId, validateBody(updateTaskSchema), taskCtrls.editTask);
taskRouter.delete('/tasks/:id', validateId, taskCtrls.deleteTask);

export default taskRouter;
