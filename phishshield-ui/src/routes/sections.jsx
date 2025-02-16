import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from '../theme/styles';
import { AuthLayout } from '../layouts/auth/index.js';
import { DashboardLayout } from '../layouts/dashboard/index.js';
import PrivateRoute from "../components/auth/private-route.jsx";

export const HomePage = lazy(() => import('../pages/home.jsx'));
export const UserPage = lazy(() => import('../pages/user.jsx'));
export const SignInPage = lazy(() => import('../pages/sign-in.jsx'));
export const SignUpPage = lazy(() => import('../pages/sign-up.jsx'));
export const Page404 = lazy(() => import('../pages/page-not-found.jsx'));
export const PhishingDetectionPage = lazy(() => import('../pages/phishing-detection.jsx'));
export const AccountPage = lazy(() => import('../pages/account.jsx'));
export const AccountSettingPage = lazy(() => import('../pages/setting.jsx'));
export const PredictionHistoryPage = lazy(() => import('../pages/prediction-history.jsx'));
export const CommentsPage = lazy(() => import('../pages/comments.jsx'));
export const ChatPage = lazy(() => import('../pages/chat.jsx'));

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'user', element: <PrivateRoute><UserPage /></PrivateRoute> },
        { path: 'phishing-detection', element: <PrivateRoute><PhishingDetectionPage /></PrivateRoute> },
        { path: 'account', element: <PrivateRoute><AccountPage /></PrivateRoute> },
        { path: 'settings', element: <PrivateRoute><AccountSettingPage /></PrivateRoute> },
        { path: 'prediction-history', element: <PrivateRoute><PredictionHistoryPage /></PrivateRoute> },
        { path: 'comments', element: <PrivateRoute><CommentsPage/></PrivateRoute> },
        { path: 'chat', element: <PrivateRoute><ChatPage/></PrivateRoute> },
      ],
    },
    {
        path: 'sign-in',
        element: (
            <AuthLayout>
                <SignInPage />
            </AuthLayout>
        ),
    },
      {
        path: 'sign-up',
        element: (
            <AuthLayout>
                <SignUpPage />
            </AuthLayout>
        ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
