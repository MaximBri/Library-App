import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../shared/providers/AuthProvider';
import { ProtectedRoute } from '../shared/utils/ProtectedRoute';
import { APP_ROUTES } from '@/shared/routes';
import { AppLayout } from './AppLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from '@/pages/login';
import { RegisterPage } from '@/pages/register';
import { HomePage } from '@/pages/home';
import { LK } from '@/pages/lk';
import { Libraries } from '@/pages/libraries';
import { LibraryPage } from '@/pages/library';
import { UsersPage } from '@/pages/users';
import { APP_ROLES } from '@/shared/constants';
import { ReservationsPage } from '@/pages/reservations';
import { Toaster } from 'react-hot-toast';
import { MyReservationsPage } from '@/pages/my-reservations';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '10px',
            padding: '10px 14px',
            fontWeight: 500,
            boxShadow: '0 8px 24px rgba(16,24,40,0.12)',
          },
          success: {
            icon: '✅',
          },
          error: {
            icon: '❌',
          },
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />

            <Route path={APP_ROUTES.HOME} element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route
                path={APP_ROUTES.LK}
                element={
                  <ProtectedRoute>
                    <LK />
                  </ProtectedRoute>
                }
              />
              <Route path={APP_ROUTES.LIBRARIES}>
                <Route index element={<Libraries />} />
                <Route path={':id'}>
                  <Route index element={<LibraryPage />} />
                  <Route
                    path={APP_ROUTES.RESERVATIONS}
                    element={
                      <ProtectedRoute allowedRole={APP_ROLES.LIBRARIAN}>
                        <ReservationsPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>
              </Route>
              <Route path={APP_ROUTES.USERS}>
                <Route
                  index
                  element={
                    <ProtectedRoute allowedRole={APP_ROLES.ADMIN}>
                      <UsersPage />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path={APP_ROUTES.MY_RESERVATIONS}
                element={<MyReservationsPage />}
              />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
