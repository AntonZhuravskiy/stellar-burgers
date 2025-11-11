import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

describe('ingredientsSlice reducer', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    }
  ];

  it('должен возвращать начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('fetchIngredients.pending', () => {
    it('должен устанавливать loading в true при запросе', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('должен записывать данные в store и устанавливать loading в false при успешном запросе', () => {
      const pendingAction = { type: fetchIngredients.pending.type };
      const state1 = ingredientsReducer(initialState, pendingAction);
      
      const fulfilledAction = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state2 = ingredientsReducer(state1, fulfilledAction);
      
      expect(state2.loading).toBe(false);
      expect(state2.ingredients).toEqual(mockIngredients);
      expect(state2.error).toBeNull();
    });

    it('должен заменять существующие данные новыми', () => {
      const oldIngredients: TIngredient[] = [
        {
          _id: 'old-id',
          name: 'Старый ингредиент',
          type: 'main',
          proteins: 100,
          fat: 50,
          carbohydrates: 200,
          calories: 300,
          price: 100,
          image: 'old-image.png',
          image_mobile: 'old-image-mobile.png',
          image_large: 'old-image-large.png'
        }
      ];
      
      const state1 = {
        ingredients: oldIngredients,
        loading: false,
        error: null
      };
      
      const fulfilledAction = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state2 = ingredientsReducer(state1, fulfilledAction);
      
      expect(state2.ingredients).toEqual(mockIngredients);
      expect(state2.ingredients).not.toEqual(oldIngredients);
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('должен записывать ошибку в store и устанавливать loading в false при ошибке', () => {
      const pendingAction = { type: fetchIngredients.pending.type };
      const state1 = ingredientsReducer(initialState, pendingAction);
      
      const errorMessage = 'Failed to fetch ingredients';
      const rejectedAction = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state2 = ingredientsReducer(state1, rejectedAction);
      
      expect(state2.loading).toBe(false);
      expect(state2.error).toBe(errorMessage);
      expect(state2.ingredients).toEqual([]);
    });

    it('должен обрабатывать ошибку без сообщения', () => {
      const pendingAction = { type: fetchIngredients.pending.type };
      const state1 = ingredientsReducer(initialState, pendingAction);
      
      const rejectedAction = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const state2 = ingredientsReducer(state1, rejectedAction);
      
      expect(state2.loading).toBe(false);
      expect(state2.error).toBe('Failed to fetch ingredients');
    });
  });

  describe('последовательность состояний', () => {
    it('должен правильно обрабатывать последовательность pending -> fulfilled', () => {
      const pendingAction = { type: fetchIngredients.pending.type };
      const state1 = ingredientsReducer(initialState, pendingAction);
      expect(state1.loading).toBe(true);
      
      const fulfilledAction = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state2 = ingredientsReducer(state1, fulfilledAction);
      expect(state2.loading).toBe(false);
      expect(state2.ingredients).toEqual(mockIngredients);
    });

    it('должен правильно обрабатывать последовательность pending -> rejected', () => {
      const pendingAction = { type: fetchIngredients.pending.type };
      const state1 = ingredientsReducer(initialState, pendingAction);
      expect(state1.loading).toBe(true);
      
      const rejectedAction = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Network error' }
      };
      const state2 = ingredientsReducer(state1, rejectedAction);
      expect(state2.loading).toBe(false);
      expect(state2.error).toBe('Network error');
    });
  });
});

