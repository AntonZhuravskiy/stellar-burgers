import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUserOrders,
  selectUserOrders
} from '../../services/slices/ordersSlice';
import {
  fetchIngredients,
  selectIngredients
} from '../../services/slices/ingredientsSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    dispatch(fetchUserOrders());
    dispatch(fetchIngredients());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
