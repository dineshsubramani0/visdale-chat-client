import ChatPage from '@/page/chat/chat';
import GlobalErrorBoundary from '@/components/error/global-error-boundary';
import ProtectedRoute from '@/components/auth/protected-route';
import MainLayout from '@/layout/main-layout';
import { CHAT_ROUTES_CONSTANT } from './chat-routes.constant';

export const chatRoutes = [
  {
    path: CHAT_ROUTES_CONSTANT.CHAT,
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        index: true,
        element: <ChatPage />,
        errorElement: <GlobalErrorBoundary />,
      },
    ],
  },
];
