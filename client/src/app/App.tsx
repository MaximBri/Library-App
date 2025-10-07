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
import { BooksPage } from '@/pages/books';

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
                <Route path={':id'} element={<LibraryPage />} />
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
              <Route path={APP_ROUTES.BOOKS}>
                <Route index element={<BooksPage />}/>
                {/* <Route path='id' element={}/> */}
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
