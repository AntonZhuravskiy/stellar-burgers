import { FC, useEffect } from 'react';
import { IngredientDetails } from '../../components';
import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import styles from './ingredient-page.module.css';

export const IngredientPage: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5`}>
        Детали ингредиента
      </h1>
      <IngredientDetails />
    </div>
  );
};
