import LoginPage from '@/page/login/login';
import { AUTH_LOGIN_ROUTES_CONSTANT } from './auth-login-routes.constant';
import GlobalErrorBoundary from '@/components/error/global-error-boundary';
import ProtectedRoute from '@/components/auth/protected-route';

export const authLoginRoutes = [
  {
    path: AUTH_LOGIN_ROUTES_CONSTANT.LOGIN_PAGE,
    element: (
      <ProtectedRoute>
        <LoginPage />
      </ProtectedRoute>
    ),
    errorElement: <GlobalErrorBoundary />,
  },
];
