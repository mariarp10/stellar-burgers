import { TIngredient } from '../../src/utils/types';
import {
  BURGER_BUN,
  BURGER_INGREDIENT,
  INGREDIENT_MODAL,
  MODAL_TITLE,
  MODAL_CLOSE_BUTTON,
  MODAL_OVERLAY
} from './selectors';

describe('Тест для страницы конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', {
      fixture: 'mockIngredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/auth/user', {
      fixture: 'mockUser.json'
    }).as('getUser');

    cy.setCookie('accessToken', 'Bearer test-access-token');
    cy.visit('/');
    cy.wait('@getIngredients');
  });
  it('Добавление булки в конструктор', () => {
    cy.fixture('mockIngredients.json').then((fixture) => {
      const bun = fixture.data[0];
      const bunName = bun.name;

      cy.contains('p', bunName).closest('li').as('targetBun');

      cy.get('@targetBun').contains('button', 'Добавить').click();

      cy.get(BURGER_BUN).should('contain.text', bunName);
    });
  });
  it('Добавление начинок в конструктор', () => {
    cy.fixture('mockIngredients.json').then((fixture) => {
      const inredient = fixture.data[1];
      const ingredientName = inredient.name;

      cy.contains('p', ingredientName).closest('li').as('targetIngredient');

      cy.get('@targetIngredient').contains('button', 'Добавить').click();

      cy.get(BURGER_INGREDIENT).should('contain.text', ingredientName);
    });
  });
  it('Модальное окно ингредиента открывается и закрывается по крестику', () => {
    cy.fixture('mockIngredients.json').then((fixture) => {
      const { name, proteins, fat, carbohydrates, calories, _ } =
        fixture.data[0];

      const expectedModalContent = [
        name,
        proteins,
        fat,
        carbohydrates,
        calories
      ];

      const imageUrl = fixture.data[0].image_large;

      cy.contains('p', name).closest('li').find('a').click();

      cy.get(INGREDIENT_MODAL)
        .should('be.visible')
        .within(() => {
          expectedModalContent.forEach((item) => {
            cy.contains(item);
          });
        });

      cy.get(INGREDIENT_MODAL)
        .should('be.visible')
        .find('img')
        .should('have.attr', 'src', imageUrl);

      cy.get(MODAL_TITLE).should('contain.text', 'Детали ингредиента');

      cy.get(MODAL_CLOSE_BUTTON).click();

      cy.get(INGREDIENT_MODAL).should('not.exist');

      cy.get('body').type('{esc}');

      cy.get(INGREDIENT_MODAL).should('not.exist');
    });
  });
  it('Модальное окно закрывается по клику на esc', () => {
    cy.fixture('mockIngredients.json').then((fixture) => {
      const { name, _ } = fixture.data[0];
      cy.contains('p', name).closest('li').find('a').click();
      cy.get(INGREDIENT_MODAL).should('be.visible');
      cy.get('body').type('{esc}');
      cy.get(INGREDIENT_MODAL).should('not.exist');
    });
  });
  it('Модальное окно закрывается по клику на overlay', () => {
    cy.fixture('mockIngredients.json').then((fixture) => {
      const { name, _ } = fixture.data[0];
      cy.contains('p', name).closest('li').find('a').click();
      cy.get(INGREDIENT_MODAL).should('exist');
      cy.get(MODAL_OVERLAY).click({ force: true });
      cy.get(INGREDIENT_MODAL).should('not.exist');
    });
  });
  it('Создание и отправка заказа', () => {
    cy.intercept('GET', '**/auth/user', {
      fixture: 'mockUser.json'
    }).as('getUser');

    cy.intercept('POST', '**/orders', {
      fixture: 'mockOrder.json'
    }).as('createOrder');

    cy.setCookie('accessToken', 'test-access-token');

    cy.fixture('mockIngredients.json').then((fixture) => {
      const bun = fixture.data.find((item: TIngredient) => item.type === 'bun');
      const main = fixture.data.find(
        (item: TIngredient) => item.type === 'main'
      );

      cy.contains('p', bun.name).closest('li').as('targetBun');
      cy.get('@targetBun').contains('button', 'Добавить').click();

      cy.contains('p', main.name).closest('li').as('targetMain');
      cy.get('@targetMain').contains('button', 'Добавить').click();

      cy.get(BURGER_BUN).should('contain.text', bun.name);
      cy.get(BURGER_INGREDIENT).should('contain.text', main.name);

      cy.contains('button', 'Оформить заказ').click();

      cy.wait('@createOrder');
    });

    cy.fixture('mockOrder.json').then((orderFixture) => {
      const orderNumber = String(orderFixture.order.number);

      cy.get(INGREDIENT_MODAL)
        .contains(orderNumber)
        .should('be.visible')
        .closest(INGREDIENT_MODAL)
        .as('orderModal');

      cy.get('@orderModal').find(MODAL_CLOSE_BUTTON).click();

      cy.get(INGREDIENT_MODAL).should('not.exist');

      cy.get(BURGER_BUN).should('not.exist');
      cy.get(BURGER_INGREDIENT).should('not.exist');
    });
  });
});
