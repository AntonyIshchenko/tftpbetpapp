import express from 'express';
import authCtrl from '../controllers/authCtrl.js';

const authRouter = express.Router();

authRouter.get('/refresh-tokens', authCtrl.refreshTokens); // прописати!

export default authRouter;
