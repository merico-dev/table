import { Navigate, Outlet, useNavigate } from 'react-router-dom';

export function RequireAuth() {
  // const navigate = useNavigate()
  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
