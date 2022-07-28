const localStorageSimulator = require('../mocks/localStorageSimulator');
const saveCartItems = require('../helpers/saveCartItems');

localStorageSimulator('setItem');

describe('4 - Teste a função saveCartItems', () => {
  it('should `saveCartItems` function call method `setItem` from `localStorage`', () => {
    const arg = '<ol><li>Item</li></ol>';
    saveCartItems(arg);
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should `saveCartItems` function has and calls `cartItems` and `item` parameters', () => {
    const arg = '<ol><li>Item</li></ol>';
    saveCartItems(arg);
    expect(localStorage.setItem).toHaveBeenCalledWith('cartItems', arg);
  });
});
