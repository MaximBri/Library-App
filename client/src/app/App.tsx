import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../shared/providers/AuthProvider';
import { ProtectedRoute } from '../shared/utils/ProtectedRoute';
import { HomePage } from '../pages/home/HomePage';
import { APP_ROUTES } from '@/shared/routes';
import { LoginPage } from '@/pages/login/LoginPage';
import { RegisterPage } from '@/pages/register/RegisterPage';
import { AppLayout } from './AppLayout';
import { LK } from '@/pages/lk/LK';
import { Libraries } from '@/pages/libraries/Libraries';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />

            <Route path={APP_ROUTES.HOME} element={<AppLayout />}>
              <Route
                index
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={APP_ROUTES.LK}
                element={
                  <ProtectedRoute>
                    <LK />
                  </ProtectedRoute>
                }
              />
              <Route
                path={APP_ROUTES.LIBRARIES}
                element={<Libraries />}
              ></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
