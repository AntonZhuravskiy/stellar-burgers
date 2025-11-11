import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
import { TIngredient } from '../../utils/types';

describe('constructorSlice reducer', () => {
  const mockIngredient: TIngredient = {
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
  };

  const mockMainIngredient: TIngredient = {
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
  };

  const initialState = {
    bun: null,
    ingredients: []
  };

  it('должен возвращать начальное состояние', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('addIngredient', () => {
    it('должен добавлять булку в конструктор', () => {
      const action = addIngredient(mockIngredient);
      const state = constructorReducer(initialState, action);
      
      expect(state.bun).toEqual({
        ...mockIngredient,
        id: expect.any(String)
      });
      expect(state.ingredients).toEqual([]);
    });

    it('должен добавлять начинку в конструктор', () => {
      const action = addIngredient(mockMainIngredient);
      const state = constructorReducer(initialState, action);
      
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual({
        ...mockMainIngredient,
        id: expect.any(String)
      });
    });

    it('должен заменять булку при добавлении новой булки', () => {
      const firstBun = addIngredient(mockIngredient);
      const state1 = constructorReducer(initialState, firstBun);
      
      const newBun: TIngredient = {
        ...mockIngredient,
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3'
      };
      const secondBun = addIngredient(newBun);
      const state2 = constructorReducer(state1, secondBun);
      
      expect(state2.bun).toEqual({
        ...newBun,
        id: expect.any(String)
      });
      expect(state2.bun?.name).toBe('Флюоресцентная булка R2-D3');
    });

    it('должен добавлять несколько начинок', () => {
      const action1 = addIngredient(mockMainIngredient);
      const state1 = constructorReducer(initialState, action1);
      
      const sauceIngredient: TIngredient = {
        ...mockMainIngredient,
        _id: '643d69a5c3f7b9001cfa0942',
        name: 'Соус Spicy-X',
        type: 'sauce'
      };
      const action2 = addIngredient(sauceIngredient);
      const state2 = constructorReducer(state1, action2);
      
      expect(state2.ingredients).toHaveLength(2);
    });
  });

  describe('removeIngredient', () => {
    it('должен удалять ингредиент по id', () => {
      const addAction1 = addIngredient(mockMainIngredient);
      const state1 = constructorReducer(initialState, addAction1);
      
      const addAction2 = addIngredient({
        ...mockMainIngredient,
        _id: '643d69a5c3f7b9001cfa0942',
        name: 'Соус Spicy-X',
        type: 'sauce'
      });
      const state2 = constructorReducer(state1, addAction2);
      
      const ingredientId = state2.ingredients[0].id;
      const removeAction = removeIngredient(ingredientId);
      const state3 = constructorReducer(state2, removeAction);
      
      expect(state3.ingredients).toHaveLength(1);
      expect(state3.ingredients[0].id).not.toBe(ingredientId);
    });

    it('не должен удалять ингредиенты при неверном id', () => {
      const addAction = addIngredient(mockMainIngredient);
      const state1 = constructorReducer(initialState, addAction);
      
      const removeAction = removeIngredient('wrong-id');
      const state2 = constructorReducer(state1, removeAction);
      
      expect(state2.ingredients).toHaveLength(1);
    });
  });

  describe('moveIngredient', () => {
    it('должен изменять порядок ингредиентов в начинке', () => {
      // Добавляем три ингредиента
      const ingredient1: TIngredient = {
        ...mockMainIngredient,
        _id: '1',
        name: 'Ингредиент 1'
      };
      const ingredient2: TIngredient = {
        ...mockMainIngredient,
        _id: '2',
        name: 'Ингредиент 2'
      };
      const ingredient3: TIngredient = {
        ...mockMainIngredient,
        _id: '3',
        name: 'Ингредиент 3'
      };
      
      const state1 = constructorReducer(
        initialState,
        addIngredient(ingredient1)
      );
      const state2 = constructorReducer(state1, addIngredient(ingredient2));
      const state3 = constructorReducer(state2, addIngredient(ingredient3));
      
      // Перемещаем первый элемент на позицию 2
      const moveAction = moveIngredient({ fromIndex: 0, toIndex: 2 });
      const state4 = constructorReducer(state3, moveAction);
      
      expect(state4.ingredients).toHaveLength(3);
      expect(state4.ingredients[2].name).toBe('Ингредиент 1');
      expect(state4.ingredients[0].name).toBe('Ингредиент 2');
      expect(state4.ingredients[1].name).toBe('Ингредиент 3');
    });

    it('должен перемещать ингредиент в начало списка', () => {
      const ingredient1: TIngredient = {
        ...mockMainIngredient,
        _id: '1',
        name: 'Ингредиент 1'
      };
      const ingredient2: TIngredient = {
        ...mockMainIngredient,
        _id: '2',
        name: 'Ингредиент 2'
      };
      
      const state1 = constructorReducer(
        initialState,
        addIngredient(ingredient1)
      );
      const state2 = constructorReducer(state1, addIngredient(ingredient2));
      
      // Перемещаем второй элемент в начало
      const moveAction = moveIngredient({ fromIndex: 1, toIndex: 0 });
      const state3 = constructorReducer(state2, moveAction);
      
      expect(state3.ingredients[0].name).toBe('Ингредиент 2');
      expect(state3.ingredients[1].name).toBe('Ингредиент 1');
    });

    it('должен перемещать ингредиент в конец списка', () => {
      const ingredient1: TIngredient = {
        ...mockMainIngredient,
        _id: '1',
        name: 'Ингредиент 1'
      };
      const ingredient2: TIngredient = {
        ...mockMainIngredient,
        _id: '2',
        name: 'Ингредиент 2'
      };
      const ingredient3: TIngredient = {
        ...mockMainIngredient,
        _id: '3',
        name: 'Ингредиент 3'
      };
      
      const state1 = constructorReducer(
        initialState,
        addIngredient(ingredient1)
      );
      const state2 = constructorReducer(state1, addIngredient(ingredient2));
      const state3 = constructorReducer(state2, addIngredient(ingredient3));
      
      // Перемещаем первый элемент в конец
      const moveAction = moveIngredient({ fromIndex: 0, toIndex: 2 });
      const state4 = constructorReducer(state3, moveAction);
      
      expect(state4.ingredients[2].name).toBe('Ингредиент 1');
    });
  });

  describe('clearConstructor', () => {
    it('должен очищать конструктор', () => {
      const addBunAction = addIngredient(mockIngredient);
      const state1 = constructorReducer(initialState, addBunAction);
      
      const addMainAction = addIngredient(mockMainIngredient);
      const state2 = constructorReducer(state1, addMainAction);
      
      const clearAction = clearConstructor();
      const state3 = constructorReducer(state2, clearAction);
      
      expect(state3.bun).toBeNull();
      expect(state3.ingredients).toEqual([]);
    });
  });
});

