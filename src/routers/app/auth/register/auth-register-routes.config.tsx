import RegisterPage from '@/page/register/registor';
import { AUTH_REGISTER_ROUTES_CONSTANT } from './auth-register-routes.constant';
import GlobalErrorBoundary from '@/components/error/global-error-boundary';
import ProtectedRoute from '@/components/auth/protected-route';

export const authRegisterRoutes = [
  {
    path: AUTH_REGISTER_ROUTES_CONSTANT.REGISTER_PAGE,
    element: (
      <ProtectedRoute>
        <RegisterPage />
      </ProtectedRoute>
    ),
    errorElement: <GlobalErrorBoundary />,
  },
];
