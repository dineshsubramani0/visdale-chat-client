import GlobalErrorBoundary from '@/components/error/global-error-boundary';
import ProtectedRoute from '@/components/auth/protected-route';
import MainLayout from '@/layout/main-layout';
import loadable from '@loadable/component';
import { CHAT_ROUTES_CONSTANT } from './chat-routes.constant';
import RouteLoadingSpinner from '@/components/common/fall-back-loader/route-loading-spinner';

const ChatPage = loadable(() => import('@/page/chat/chat'), {
  fallback: <RouteLoadingSpinner />,
});

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
      {
        path: ':chatId',
        element: <ChatPage />,
        errorElement: <GlobalErrorBoundary />,
      },
    ],
  },
];
