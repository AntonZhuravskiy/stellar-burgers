import { FC, useEffect } from 'react';
import { OrderInfo } from '../../components';
import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import styles from './order-page.module.css';

export const OrderPage: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <OrderInfo />
    </div>
  );
};
