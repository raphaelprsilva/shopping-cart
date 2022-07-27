const fetchItem = async (itemId) => {
  try {
    const url = `https://api.mercadolibre.com/items/${itemId}`;
    const response = await fetch(url);
    const product = await response.json();
    return product;
  } catch (error) {
    return error;
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
