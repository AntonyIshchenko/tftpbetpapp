import fs from 'node:fs';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

// import swaggerDocument from './swagger.json';
import HttpError from './helpers/httpError.js';
import taskRouter from './routes/taskRouter.js';
import userRouter from './routes/userRouter.js';
import authMiddleware from './middlewares/authenticate.js';
// import { handleContentType } from './middlewares/handleContentType.js';
// import taskServices from './services/taskServices.js';

const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf-8'));

const app = express();

app.use(cors());
app.use(express.json());
// app.use(handleContentType); //можна додати сюди - буде більш глобально.

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/users', userRouter);
app.use('/api', authMiddleware, taskRouter);

// app.get('/api/test', async (req, res, next) => {
//   try {
//     // const result = await taskServices.board.create(req.body);
//     // const result = await taskServices.board.getAll('6661b076bbc0a6b102070a3f');
//     const result = await taskServices.board.getData('66621f08aa779d7c5815ac62');

//     // const result = await taskServices.task.create({
//     //   boardId: '66621f08aa779d7c5815ac62',
//     //   columnId: '6662216a26517c92994797e8',
//     //   name: 'Task5',
//     // });

//     res.json(result);
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

app.use((req, res, next) => {
  next(HttpError(404, 'Route not found'));
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

export default app;
