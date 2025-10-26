import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/ordersSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.userOrders);
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  useEffect(() => {
    dispatch(fetchUserOrders());
    dispatch(fetchIngredients());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
