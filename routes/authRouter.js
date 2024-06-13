import express from 'express';
import authCtrl from '../controllers/authCtrl.js';

const authRouter = express.Router();

authRouter.get('/refresh-token', authCtrl.refreshToken); // прописати!

export default authRouter;
