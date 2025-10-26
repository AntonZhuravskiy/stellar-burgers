import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIsAuthenticated,
  selectUserLoading
} from '../../services/slices/userSlice';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  children: JSX.Element;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectUserLoading);

  // Показываем лоадер во время проверки авторизации
  if (loading) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuthenticated) {
    // Если маршрут только для неавторизованных, а пользователь авторизован
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    // Если маршрут защищен, а пользователь не авторизован
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }

  return children;
};
