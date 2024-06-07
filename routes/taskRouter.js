import express from 'express';
import taskCtrls from '../controllers/taskCtrl.js';

const taskRouter = express.Router();

// Шляхи до дошки (повернути всі, певну дошку, створити, змінити, видалити)
taskRouter.get('/boards', taskCtrls.getAllBoards);
taskRouter.get('/boards/:id', taskCtrls.getOneBoard);
taskRouter.post('/boards', taskCtrls.createBoard);
taskRouter.patch('/boards/:id', taskCtrls.editBoard);
taskRouter.delete('/boards/:id', taskCtrls.deleteBoard);

//Шляхи до колонок(створити, змінити, видалити)
taskRouter.post('/columns', taskCtrls.createColumn);
taskRouter.patch('/columns/:id', taskCtrls.editColumn);
taskRouter.delete('/columns/:id', taskCtrls.deleteColumn);

//Шляхи до завдань(створити, змінити, видалити)
taskRouter.post('/tasks', taskCtrls.createTask);
taskRouter.patch('/tasks/:id', taskCtrls.editTask);
taskRouter.delete('/tasks/:id', taskCtrls.deleteTask);

export default taskRouter;
