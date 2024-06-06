import express from 'express';
import cors from 'cors';

import taskRouter from './routes/taskRouter.js';
import userRouter from './routes/userRouter.js';
import authMiddleware from './middlewares/authenticate.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/tasks', authMiddleware, taskRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

export default app;
