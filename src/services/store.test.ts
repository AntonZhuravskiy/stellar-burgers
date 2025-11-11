import { rootReducer } from './store';

describe('rootReducer', () => {
  it('должен правильно инициализироваться и возвращать корректное начальное состояние при вызове с undefined состоянием и экшеном, который не обрабатывается ни одним редьюсером', () => {
    // Вызываем rootReducer с undefined состоянием и экшеном, который не обрабатывается
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    // Проверяем, что все слайсы присутствуют
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('burgerConstructor');
  });

  it('должен возвращать начальное состояние для всех слайсов при вызове с undefined состоянием', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    // Проверяем начальное состояние ingredients
    expect(state.ingredients).toEqual({
      ingredients: [],
      loading: false,
      error: null
    });
    
    // Проверяем начальное состояние user
    expect(state.user).toEqual({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });
    
    // Проверяем начальное состояние orders
    expect(state.orders).toEqual({
      feeds: [],
      total: 0,
      totalToday: 0,
      userOrders: [],
      currentOrder: null,
      orderRequest: false,
      orderModalData: null,
      loading: false,
      error: null
    });
    
    // Проверяем начальное состояние burgerConstructor
    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
  });
});

