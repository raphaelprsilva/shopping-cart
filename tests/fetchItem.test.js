require('../mocks/fetchSimulator');
const { fetchItem } = require('../helpers/fetchItem');
const item = require('../mocks/item');

describe('2 - Teste a função fecthItem', () => {
  const productId = 'MLB1615760527';
  const correctEndPoint = `https://api.mercadolibre.com/items/${productId}`;

  it('should `fecthItem` be a function', () => {
    expect(typeof fetchItem).toBe('function');
  });

  it('should `fetchItem` be called with "MLB1615760527" argument', async () => {
    await fetchItem(productId);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should `fetchItem` use correct end point', async () => {
    await fetchItem(productId);
    expect(fetch).toHaveBeenCalledWith(correctEndPoint);
  });

  it('should `fetchItem` return an object as expected', async () => {
    const productData = await fetchItem(productId);
    expect(productData).toBe(item);
  });

  it('should `fetchItem` returns an Error when no parameter is passed', async () => {
    const product = await fetchItem();
    expect(product).toEqual(new Error('You must provide an url'));
  });
});
