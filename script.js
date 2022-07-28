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

const renderTotalPrice = (totalPrice) => {
  const totalPriceItem = document.querySelector('.total-price');
  totalPriceItem.textContent = `R$ ${totalPrice}`;
};

const setTotalPrice = () => {
  const cartItemsFromLocalStorage = JSON.parse(getSavedCartItems());
  const totalPrice = cartItemsFromLocalStorage.reduce((acc, { price }) => acc + price, 0);
  localStorage.setItem('totalPrice', totalPrice);
  renderTotalPrice(totalPrice);
};

function removeCartItem(clickedItem) {
  const dataTrashValue = clickedItem.dataset.trash;
  const cartItem = clickedItem.parentNode;

  if (dataTrashValue) {
    const cartItemsFromLocalStorage = JSON.parse(getSavedCartItems());
    const filteredCartItems = cartItemsFromLocalStorage.filter(({ id }) => id !== dataTrashValue);
    saveCartItems(JSON.stringify(filteredCartItems));
    cartItem.remove();
    setTotalPrice();
  }
}

function cartItemClickListener(event) {
  const clickedItem = event.target;
  removeCartItem(clickedItem);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';

  li.appendChild(createCustomElement('span', 'item__sku', sku));
  li.appendChild(createCustomElement('span', 'item__title', name));
  li.appendChild(createCustomElement('span', 'item__price', `R$ ${salePrice}`));

  const deleteProductIcon = createCustomElement('i', 'far fa-trash-alt', '');
  deleteProductIcon.dataset.trash = sku;
  li.appendChild(deleteProductIcon);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const setProductsProperties = (products, elementToAppend) =>
  products.forEach(({ id, title, thumbnail }) => {
    const newItemElement = createProductItemElement({ id, title, thumbnail });
    elementToAppend.appendChild(newItemElement);
  });

const saveCartItemAtLocalStorage = ({ id, title, price }) => {
  const cartItemsFromLocalStorage = JSON.parse(getSavedCartItems());
  cartItemsFromLocalStorage.push({ id, title, price });
  saveCartItems(JSON.stringify(cartItemsFromLocalStorage));
};

const setCartItem = async ({ target }) => {
  const productComponent = target.parentNode;
  const productId = getSkuFromProductItem(productComponent);
  const { id, title, price } = await fetchItem(productId);
  const productCart = createCartItemElement({ id, title, price });
  saveCartItemAtLocalStorage({ id, title, price });
  setTotalPrice();
  cartItems.appendChild(productCart);
};

const addProductToCart = async () => {
  const addProductButtons = document.querySelectorAll('.item__add');
  addProductButtons.forEach((button) => button.addEventListener('click', setCartItem));
};

const renderAllProducts = async () => {
  const items = document.querySelector('.items');
  const products = await fetchProducts('computador');
  const { results } = products;

  setProductsProperties(results, items);
  await addProductToCart();
};

const clearCartItems = () => {
  const emptyCartButton = document.querySelector('.empty-cart');
  const allCartItems = document.querySelectorAll('.cart__item');

  emptyCartButton.addEventListener('click', () => {
    allCartItems.forEach((cartItem) => cartItem.remove());
    saveCartItems(JSON.stringify([]));
    localStorage.setItem('totalPrice', 0);
    const getTotalPrice = localStorage.getItem('totalPrice');
    renderTotalPrice(getTotalPrice);
  });
};

const initialRenderization = () => {
  if (getSavedCartItems() === null) {
    saveCartItems(JSON.stringify([]));
    localStorage.setItem('totalPrice', 0);
  } else {
    const localStorageCartItems = JSON.parse(getSavedCartItems());
    localStorageCartItems
      .forEach(({ id, price, title }) => {
        const productCartLocalStorage = createCartItemElement({ id, price, title });
        cartItems.appendChild(productCartLocalStorage);
      });
    const localStorageTotalPrice = JSON.parse(localStorage.getItem('totalPrice'));
    renderTotalPrice(localStorageTotalPrice);
  }
};

const load = () => {
  const loadElement = document.createElement('div');
  loadElement.classList.add('loading');
  loadElement.innerText = 'Carregando...';
  document.querySelector('.items').appendChild(loadElement);
};

load();

const stopLoad = () => {
  document.querySelector('.loading').remove();
};

const loadHelper = (callback) => {
  setTimeout(callback, 1500);
};

window.onload = async () => {
  initialRenderization();
  loadHelper(renderAllProducts);
  loadHelper(stopLoad);
  clearCartItems();
};
