const saveCartItems = (item) => {
  const key = 'cartItems';
  return localStorage.setItem(key, item);
};

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
