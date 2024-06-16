import express from 'express';
import authCtrl from '../controllers/authCtrl.js';
import authMiddleware from '../middlewares/authenticate.js';

const authRouter = express.Router();

authRouter.get('/refresh-tokens', authCtrl.refreshTokens);

authRouter.get('/google', authCtrl.googleAuth);
authRouter.get('/google-redirect', authCtrl.googleRedirect);
authRouter.post('/close-sessions', authMiddleware, authCtrl.closeAllSessions);

export default authRouter;
