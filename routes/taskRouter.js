import express from 'express';
import taskCtrls from '../controllers/taskCtrl.js';

const taskRouter = express.Router();

// Шляхи до Board
taskRouter.get('/boards', taskCtrls.getAllBoards);
taskRouter.get('/boards/:id', taskCtrls.getOneBoard);
taskRouter.post('/boards', taskCtrls.createBoard);
taskRouter.patch('/boards/:id', taskCtrls.editBoard);
taskRouter.delete('/boards/:id', taskCtrls.deleteBoard);

//Шляхи до Column
taskRouter.post('/columns/:boardId', taskCtrls.createColumn);
taskRouter.patch('/columns/:id', taskCtrls.editColumn);
taskRouter.delete('/columns/:id', taskCtrls.deleteColumn);

//Шляхи до Task
taskRouter.post('/tasks/:boardId/:columnId', taskCtrls.createTask);
taskRouter.patch('/tasks/:boardId/:columnId/:id', taskCtrls.editTask);
taskRouter.delete('/tasks/:boardId/:columnId/:id', taskCtrls.deleteTask);

export default taskRouter;
