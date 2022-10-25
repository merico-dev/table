import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function RequireAuth() {
  const location = useLocation();
  if (!localStorage.getItem('token')) {
    const redirect_to = `${location.pathname}${location.search}`;
    window.localStorage.setItem('redirect_to', redirect_to);
    return <Navigate to={`/login?redirect_to=${redirect_to}`} replace />;
  }
  return <Outlet />;
}
