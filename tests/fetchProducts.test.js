require('../mocks/fetchSimulator');
const { fetchProducts } = require('../helpers/fetchProducts');
const computadorSearch = require('../mocks/search');

describe('1 - Teste a função fecthProducts', () => {
  it('should `fetchProducts` be a function', () => {
    expect(typeof fetchProducts).toBe('function');
  });

  it('should `fetchProducts` be called with "computador" argument', async () => {
    const query = 'computador';
    await fetchProducts(query);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should check if fetch is correctly called', async () => {
    const query = 'computador';
    const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
    await fetchProducts(query);
    expect(fetch).toHaveBeenCalledWith(endPoint);
  });

  it('should `fetchProducts` response be equal mock', async () => {
    const query = 'computador';
    const products = await fetchProducts(query);
    expect(products).toBe(computadorSearch);
  });

  it('should `fetchProducts` returns an Error when no parameter is passed', async () => {
    const products = await fetchProducts();
    expect(products).toEqual(new Error('You must provide an url'));
  });
});
