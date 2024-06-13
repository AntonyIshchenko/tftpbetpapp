import express from 'express';
import authCtrl from '../controllers/authCtrl.js';
import authMiddleware from '../middlewares/authenticate.js';

const authRouter = express.Router();

authRouter.get('/refresh-token', authMiddleware, authCtrl.refreshToken); // прописати!

export default authRouter;
