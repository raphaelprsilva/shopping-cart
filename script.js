const cartItems = document.querySelector('.cart__items');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';

  li.appendChild(createCustomElement('span', 'item__sku', sku));
  li.appendChild(createCustomElement('span', 'item__title', name));
  li.appendChild(createCustomElement('span', 'item__price', `R$ ${salePrice}`));
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const setProductsProperties = (products, elementToAppend) =>
  products.forEach(({ id, title, thumbnail }) => {
    const newItemElement = createProductItemElement({ id, title, thumbnail });
    elementToAppend.appendChild(newItemElement);
  });

const setCartItem = async ({ target }) => {
  const productComponent = target.parentNode;
  const productId = getSkuFromProductItem(productComponent);
  const { id, title, price } = await fetchItem(productId);
  const productCart = createCartItemElement({ id, title, price });
  cartItems.appendChild(productCart);
};

const addProductToCart = async () => {
  const addProductButtons = document.querySelectorAll('.item__add');
  addProductButtons.forEach((button) =>
    button.addEventListener('click', setCartItem));
};

const renderAllProducts = async () => {
  const items = document.querySelector('.items');
  const products = await fetchProducts('computador');
  const { results } = products;

  setProductsProperties(results, items);
  await addProductToCart();
};

window.onload = async () => {
  renderAllProducts();
};
