import express from 'express';
import userCtrl from '../controllers/userCtrl.js';

const userRouter = express.Router();

userRouter.post('/register', userCtrl.registerUser);
userRouter.post('/login', userCtrl.loginUser);

export default userRouter;
