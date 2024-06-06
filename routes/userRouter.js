import express from 'express';
import userCtrl from '../controllers/userCtrl.js';
import {
  createUserSchema,
  loginUserSchema,
  userThemeSchema,
  updateUserSchema,
} from '../schemas/usersSchemas.js';
import validateBody from '../helpers/validateBody.js';
import authMiddleware from '../middlewares/authenticate.js';

const userRouter = express.Router();

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
  validateBody(updateUserSchema),
  userCtrl.updateUser
);
userRouter.patch(
  '/:id',
  validateBody(userThemeSchema),
  userCtrl.modifyUserTheme
);

export default userRouter;
