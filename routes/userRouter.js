import express from 'express';
import userCtrl from '../controllers/userCtrl.js';
import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
} from '../schemas/usersSchemas.js';
import validateBody from '../helpers/validateBody.js';
import authMiddleware from '../middlewares/authenticate.js';
import { handleContentType } from '../middlewares/handleContentType.js';

const userRouter = express.Router();

userRouter.get('/current', authMiddleware, userCtrl.getCurrentUser);
userRouter.get('/refresh', userCtrl.refreshToken); // прописати!
userRouter.post(
  '/register',
  validateBody(createUserSchema),
  userCtrl.registerUser
);
userRouter.post('/login', validateBody(loginUserSchema), userCtrl.loginUser);
userRouter.post('/logout', authMiddleware, userCtrl.logoutUser);
userRouter.patch(
  '/update',
  authMiddleware,
  handleContentType,
  validateBody(updateUserSchema),
  userCtrl.updateUser
);

export default userRouter;
