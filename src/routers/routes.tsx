import { createBrowserRouter } from 'react-router-dom';
import { authRouter } from './app/auth';
import { RedirectRoutes } from './app/redirect/redirect-routes.config';
import { authRegisterRoutes } from './app/auth/register/auth-register-routes.config';
import { chatRouter } from './app/chat';

export const AppRouters = createBrowserRouter([
  ...RedirectRoutes,
  ...authRegisterRoutes,
  ...authRouter,
  ...chatRouter,
]);
