import express from 'express';
import taskCtrls from '../controllers/taskCtrl.js';
import validateId from '../middlewares/validateId.js';

const taskRouter = express.Router();

// Шляхи до Board
taskRouter.get('/boards', taskCtrls.getAllBoards);
taskRouter.post('/boards', taskCtrls.createBoard);
taskRouter.get('/boards/:id', validateId, taskCtrls.getOneBoard);
taskRouter.patch('/boards/:id', validateId, taskCtrls.editBoard);
taskRouter.delete('/boards/:id', validateId, taskCtrls.deleteBoard);

//Шляхи до Column
taskRouter.post('/columns', taskCtrls.createColumn);
taskRouter.patch('/columns/:id', validateId, taskCtrls.editColumn);
taskRouter.delete('/columns/:id', validateId, taskCtrls.deleteColumn);

//Шляхи до Task
taskRouter.post('/tasks', taskCtrls.createTask);
taskRouter.patch('/tasks/:id', validateId, taskCtrls.editTask);
taskRouter.delete('/tasks/:id', validateId, taskCtrls.deleteTask);

export default taskRouter;
