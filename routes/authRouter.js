import express from 'express';
import authCtrl from '../controllers/authCtrl.js';

const authRouter = express.Router();

authRouter.get('/refresh-token', authCtrl.refreshToken); // прописати!

authRouter.get('/google', authCtrl.googleAuth);
authRouter.get('/google-redirect', authCtrl.googleRedirect);

export default authRouter;
