/// <reference types="cypress" />

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Загружаем моковые данные
    cy.fixture('ingredients').then((ingredientsData) => {
      // Перехватываем запрос к API ингредиентов
      // Используем универсальный паттерн для перехвата запросов
      cy.intercept('GET', '**/ingredients', {
        statusCode: 200,
        body: ingredientsData
      }).as('getIngredients');
    });

    // Переходим на страницу конструктора
    cy.visit('/');
    
    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
    
    // Ждем, пока страница полностью загрузится
    cy.contains('Соберите бургер').should('be.visible');
  });

  it('должен отображать список ингредиентов', () => {
    // Проверяем наличие ингредиентов в списке
    cy.fixture('ingredients').then((ingredientsData) => {
      // Проверяем, что ингредиенты существуют в DOM (не все могут быть видимы из-за прокрутки)
      ingredientsData.data.forEach((ingredient) => {
        cy.contains(ingredient.name).should('exist');
      });
      
      // Проверяем, что хотя бы несколько ингредиентов видимы
      const firstIngredient = ingredientsData.data[0];
      cy.contains(firstIngredient.name)
        .should('exist')
        .scrollIntoView()
        .should('be.visible');
    });
  });

  it('должен добавлять один ингредиент в конструктор', () => {
    cy.fixture('ingredients').then((ingredientsData) => {
      // Находим первый ингредиент типа main (начинка)
      const mainIngredient = ingredientsData.data.find(
        (ing) => ing.type === 'main'
      );
      
      expect(mainIngredient).to.exist;
      
      // Находим элемент ингредиента и кнопку "Добавить"
      cy.contains(mainIngredient.name)
        .should('exist')
        .scrollIntoView()
        .parents('li')
        .should('exist')
        .within(() => {
          cy.contains('Добавить').should('be.visible').click();
        });

      // Проверяем, что ингредиент появился в конструкторе
      cy.contains(mainIngredient.name, { timeout: 5000 }).should('be.visible');
    });
  });

  it('должен добавлять булку в конструктор', () => {
    cy.fixture('ingredients').then((ingredientsData) => {
      // Находим первую булку
      const bun = ingredientsData.data.find((ing) => ing.type === 'bun');
      
      expect(bun).to.exist;
      
      // Находим кнопку "Добавить" для булки
      cy.contains(bun.name)
        .should('exist')
        .scrollIntoView()
        .parents('li')
        .within(() => {
          cy.contains('Добавить').should('be.visible').click();
        });

      // Проверяем, что булка появилась в конструкторе (верх и низ)
      cy.contains(`${bun.name} (верх)`, { timeout: 5000 }).should('be.visible');
      cy.contains(`${bun.name} (низ)`).should('be.visible');
    });
  });

  it('должен добавлять начинки в конструктор', () => {
    cy.fixture('ingredients').then((ingredientsData) => {
      // Находим все начинки (main и sauce)
      const fillings = ingredientsData.data.filter(
        (ing) => ing.type === 'main' || ing.type === 'sauce'
      );

      expect(fillings.length).to.be.greaterThan(0);

      // Добавляем каждую начинку
      fillings.forEach((filling) => {
        cy.contains(filling.name)
          .should('exist')
          .scrollIntoView()
          .parents('li')
          .within(() => {
            cy.contains('Добавить').should('be.visible').click();
          });
      });

      // Проверяем, что все начинки появились в конструкторе
      fillings.forEach((filling) => {
        cy.contains(filling.name, { timeout: 5000 }).should('be.visible');
      });
    });
  });

  it('должен добавлять булку и начинки в конструктор', () => {
    cy.fixture('ingredients').then((ingredientsData) => {
      // Находим булку
      const bun = ingredientsData.data.find((ing) => ing.type === 'bun');
      
      // Находим начинки
      const fillings = ingredientsData.data.filter(
        (ing) => ing.type === 'main' || ing.type === 'sauce'
      );

      expect(bun).to.exist;
      expect(fillings.length).to.be.greaterThan(0);

      // Добавляем булку
      cy.contains(bun.name)
        .should('exist')
        .scrollIntoView()
        .parents('li')
        .within(() => {
          cy.contains('Добавить').should('be.visible').click();
        });

      // Добавляем начинки
      fillings.forEach((filling) => {
        cy.contains(filling.name)
          .should('exist')
          .scrollIntoView()
          .parents('li')
          .within(() => {
            cy.contains('Добавить').should('be.visible').click();
          });
      });

      // Проверяем булку (верх и низ)
      cy.contains(`${bun.name} (верх)`, { timeout: 5000 }).should('be.visible');
      cy.contains(`${bun.name} (низ)`).should('be.visible');

      // Проверяем начинки
      fillings.forEach((filling) => {
        cy.contains(filling.name).should('be.visible');
      });
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должно открываться при клике на ингредиент и отображать данные именно того ингредиента, по которому произошел клик', () => {
      cy.fixture('ingredients').then((ingredientsData) => {
        // Находим конкретный ингредиент для проверки
        const ingredient = ingredientsData.data[1]; // Берем второй ингредиент для более явной проверки
        
        // Кликаем на ингредиент (на Link, который обернут вокруг ингредиента)
        cy.contains(ingredient.name)
          .should('exist')
          .scrollIntoView()
          .click({ force: true });

        // Проверяем, что модальное окно открылось
        cy.contains('Детали ингредиента').should('be.visible');
        
        // Проверяем, что в модальном окне отображается информация именно об этом ингредиенте
        cy.contains(ingredient.name).should('be.visible');
        
        // Проверяем, что отображаются данные именно этого ингредиента
        cy.contains(ingredient.calories.toString()).should('be.visible');
        cy.contains(ingredient.proteins.toString()).should('be.visible');
        cy.contains(ingredient.fat.toString()).should('be.visible');
        cy.contains(ingredient.carbohydrates.toString()).should('be.visible');
        
        // Проверяем, что отображаются правильные метки
        cy.contains('Калории, ккал').should('be.visible');
        cy.contains('Белки, г').should('be.visible');
        cy.contains('Жиры, г').should('be.visible');
        cy.contains('Углеводы, г').should('be.visible');
      });
    });

    it('должно закрываться при клике на крестик', () => {
      cy.fixture('ingredients').then((ingredientsData) => {
        const ingredient = ingredientsData.data[0];
        
        // Открываем модальное окно
        cy.contains(ingredient.name)
          .should('exist')
          .scrollIntoView()
          .click({ force: true });

        // Проверяем, что модальное окно открылось
        cy.contains('Детали ингредиента').should('be.visible');

        // Находим и кликаем на кнопку закрытия (крестик)
        // Модальное окно рендерится в #modals через portal
        cy.get('#modals')
          .find('button')
          .should('be.visible')
          .click();

        // Проверяем, что модальное окно закрылось
        cy.contains('Детали ингредиента').should('not.exist');
      });
    });

    it('должно закрываться при клике на оверлей', () => {
      cy.fixture('ingredients').then((ingredientsData) => {
        const ingredient = ingredientsData.data[0];
        
        // Открываем модальное окно
        cy.contains(ingredient.name)
          .should('exist')
          .scrollIntoView()
          .click({ force: true });

        // Проверяем, что модальное окно открылось
        cy.contains('Детали ингредиента').should('be.visible');

        // Кликаем на оверлей (overlay рендерится в #modals через portal)
        // Структура: #modals содержит два элемента - модальное окно и overlay
        // Overlay - это div, который является прямым потомком #modals и не содержит кнопку
        cy.get('#modals')
          .children()
          .filter((index, el) => {
            // Ищем элемент, который не содержит кнопку (это overlay)
            return !el.querySelector('button');
          })
          .first()
          .click({ force: true });

        // Проверяем, что модальное окно закрылось
        cy.contains('Детали ингредиента').should('not.exist');
      });
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Устанавливаем моковые токены авторизации
      const mockAccessToken = 'mock-access-token-12345';
      const mockRefreshToken = 'mock-refresh-token-12345';
      
      cy.setCookie('accessToken', mockAccessToken);
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', mockRefreshToken);
      });

      // Мокаем API для получения данных пользователя
      cy.fixture('user').then((userData) => {
        cy.intercept('GET', '**/auth/user', {
          statusCode: 200,
          body: userData
        }).as('getUser');
      });

      // Мокаем API для создания заказа
      cy.fixture('order').then((orderData) => {
        cy.intercept('POST', '**/orders', {
          statusCode: 200,
          body: orderData
        }).as('createOrder');
      });

      // Загружаем моковые данные ингредиентов
      cy.fixture('ingredients').then((ingredientsData) => {
        cy.intercept('GET', '**/ingredients', {
          statusCode: 200,
          body: ingredientsData
        }).as('getIngredients');
      });

      // Переходим на страницу конструктора
      cy.visit('/');
      
      // Ждем загрузки ингредиентов и данных пользователя
      cy.wait('@getIngredients');
      cy.wait('@getUser');
      
      // Ждем, пока страница полностью загрузится
      cy.contains('Соберите бургер').should('be.visible');
    });

    afterEach(() => {
      // Очищаем токены авторизации после каждого теста
      cy.clearCookie('accessToken');
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
    });

    it('должен создавать заказ и отображать модальное окно с номером заказа', () => {
      cy.fixture('ingredients').then((ingredientsData) => {
        // Находим булку
        const bun = ingredientsData.data.find((ing) => ing.type === 'bun');
        // Находим начинку
        const filling = ingredientsData.data.find(
          (ing) => ing.type === 'main' || ing.type === 'sauce'
        );

        expect(bun).to.exist;
        expect(filling).to.exist;

        // Добавляем булку
        cy.contains(bun.name)
          .should('exist')
          .scrollIntoView()
          .parents('li')
          .within(() => {
            cy.contains('Добавить').should('be.visible').click();
          });

        // Добавляем начинку
        cy.contains(filling.name)
          .should('exist')
          .scrollIntoView()
          .parents('li')
          .within(() => {
            cy.contains('Добавить').should('be.visible').click();
          });

        // Проверяем, что ингредиенты добавлены в конструктор
        cy.contains(`${bun.name} (верх)`, { timeout: 5000 }).should('be.visible');
        cy.contains(filling.name).should('be.visible');

        // Кликаем на кнопку "Оформить заказ"
        cy.contains('Оформить заказ')
          .should('be.visible')
          .click();

        // Ждем запроса на создание заказа
        cy.wait('@createOrder');

        // Проверяем, что модальное окно открылось
        cy.fixture('order').then((orderData) => {
          // Проверяем, что модальное окно открылось (ищем по номеру заказа)
          cy.contains(orderData.order.number.toString(), { timeout: 5000 }).should('be.visible');

          // Проверяем, что номер заказа отображается
          cy.contains(orderData.order.number.toString()).should('be.visible');
          
          // Проверяем текст "идентификатор заказа"
          cy.contains('идентификатор заказа').should('be.visible');
        });
      });
    });

    it('должен закрывать модальное окно заказа и очищать конструктор', () => {
      cy.fixture('ingredients').then((ingredientsData) => {
        // Находим булку
        const bun = ingredientsData.data.find((ing) => ing.type === 'bun');
        // Находим начинку
        const filling = ingredientsData.data.find(
          (ing) => ing.type === 'main' || ing.type === 'sauce'
        );

        expect(bun).to.exist;
        expect(filling).to.exist;

        // Добавляем булку
        cy.contains(bun.name)
          .should('exist')
          .scrollIntoView()
          .parents('li')
          .within(() => {
            cy.contains('Добавить').should('be.visible').click();
          });

        // Добавляем начинку
        cy.contains(filling.name)
          .should('exist')
          .scrollIntoView()
          .parents('li')
          .within(() => {
            cy.contains('Добавить').should('be.visible').click();
          });

        // Кликаем на кнопку "Оформить заказ"
        cy.contains('Оформить заказ')
          .should('be.visible')
          .click();

        // Ждем запроса на создание заказа
        cy.wait('@createOrder');

        // Ждем, пока модальное окно откроется
        cy.fixture('order').then((orderData) => {
          cy.contains(orderData.order.number.toString(), { timeout: 5000 }).should('be.visible');

          // Закрываем модальное окно по клику на крестик
          // Модальное окно рендерится в #modals через portal
          cy.get('#modals')
            .find('button')
            .should('be.visible')
            .click();

          // Проверяем, что модальное окно закрылось
          cy.contains(orderData.order.number.toString()).should('not.exist');
        });

        // Проверяем, что конструктор пуст
        // Проверяем, что нет ингредиентов (должна быть надпись "Выберите булки")
        cy.contains('Выберите булки').should('be.visible');
      });
    });
  });
});

