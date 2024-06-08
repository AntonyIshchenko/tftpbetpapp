import express from 'express';
import cors from 'cors';

import taskRouter from './routes/taskRouter.js';
import userRouter from './routes/userRouter.js';
import authMiddleware from './middlewares/authenticate.js';
// import { handleContentType } from './middlewares/handleContentType.js';

// import taskServices from './services/taskServices.js';

const app = express();

app.use(cors());
app.use(express.json());
// app.use(handleContentType); //можна додати сюди - буде більш глобально.
app.use('/api/users', userRouter);
app.use('/api/tasks', authMiddleware, taskRouter);

// app.get('/api/test', async (req, res, next) => {
//   try {
//     // const result = await taskServices.board.create(req.body);
//     // const result = await taskServices.board.getAll('6661b076bbc0a6b102070a3f');
//     // const result = await taskServices.board.getData('66621f08aa779d7c5815ac62');

//     const result = await taskServices.task.create({
//       boardId: '66621f08aa779d7c5815ac62',
//       columnId: '6662216a26517c92994797e8',
//       name: 'Task5',
//     });

//     res.json(result);
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

export default app;
