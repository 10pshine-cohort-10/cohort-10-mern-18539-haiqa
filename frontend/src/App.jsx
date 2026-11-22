import { Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Application routes.
 * Week 2 adds /signup, /login, /forgot-password and /reset-password and protects
 * the AppLayout routes. Week 3 adds /notes, /notes/:id and /profile.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
