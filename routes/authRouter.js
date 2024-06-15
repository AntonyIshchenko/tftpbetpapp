import express from 'express';
import authCtrl from '../controllers/authCtrl.js';

const authRouter = express.Router();

authRouter.get('/refresh-tokens', authCtrl.refreshTokens); // прописати!
authRouter.get('/google', authCtrl.googleAuth);
authRouter.get('/google-redirect', authCtrl.googleRedirect);
authRouter.post('/close-sessions', authCtrl.closeAllSessions);

export default authRouter;
