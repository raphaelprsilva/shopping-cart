const cartItems = document.querySelector('.cart__items');

const setNewPrice = (price) => price.toString().replace('.', ',');

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

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('span', 'item__price', `R$ ${price}`));
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
  const totalPrice = cartItemsFromLocalStorage
    .reduce((acc, { price, quantity }) => acc + (price * quantity), 0);
  const roundedTotalPrice = Math.round(totalPrice * 100) / 100;
  const convertedTotalPrice = setNewPrice(roundedTotalPrice);
  localStorage.setItem('totalPrice', convertedTotalPrice);
  renderTotalPrice(convertedTotalPrice);
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

function createCartItemElement({ id: sku, title: name, price: salePrice, quantity }) {
  const newPriceNotation = setNewPrice(salePrice);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.dataset.id = sku;

  li.appendChild(createCustomElement('span', 'item__sku', sku));
  li.appendChild(createCustomElement('span', 'item__title', name));
  li.appendChild(createCustomElement('span', 'item__quantity', `Quantidade: ${quantity}`));
  li.appendChild(createCustomElement('span', 'item__price', `R$ ${newPriceNotation}`));

  const deleteProductIcon = createCustomElement('i', 'far fa-trash-alt', '');
  deleteProductIcon.dataset.trash = sku;
  li.appendChild(deleteProductIcon);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const setProductsProperties = (products, elementToAppend) =>
  products.forEach(({ id, title, thumbnail, price }) => {
    const brazilizanPriceNotation = setNewPrice(price);
    const product = { id, title, thumbnail, price: brazilizanPriceNotation };
    const newItemElement = createProductItemElement(product);
    elementToAppend.appendChild(newItemElement);
  });

const saveCartItemAtLocalStorage = ({ id, title, price, quantity }) => {
  const cartItemsFromLocalStorage = JSON.parse(getSavedCartItems());
  cartItemsFromLocalStorage.push({ id, title, price, quantity });
  saveCartItems(JSON.stringify(cartItemsFromLocalStorage));
};

const updateProductsCartQuantity = (products, productId) => products.map((product) => {
  if (product.id === productId) return { ...product, quantity: product.quantity + 1 };
  return product;
});

const updatedProductCart = (products, productId) => {
  const updatedProducts = updateProductsCartQuantity(products, productId);
  const { id, price, quantity } = updatedProducts.find((product) => product.id === productId);
  const totalPrice = price * quantity;
  const elementToReRender = document.querySelector(`[data-id=${id}]`);
  elementToReRender.querySelector('.item__quantity').textContent = `Quantidade: ${quantity}`;
  elementToReRender.querySelector('.item__price').textContent = `Total: R$ ${totalPrice}`;
  saveCartItems(JSON.stringify(updatedProducts));
  setTotalPrice();
};

const saveProductCartItem = async (productId) => {
  const { id, title, price, quantity = 1 } = await fetchItem(productId);
  const productCart = createCartItemElement({ id, title, price, quantity });
  saveCartItemAtLocalStorage({ id, title, price, quantity });
  setTotalPrice();
  cartItems.appendChild(productCart);
};

const setCartItem = async ({ target }) => {
  const productComponent = target.parentNode;
  const productId = getSkuFromProductItem(productComponent);
  const cartItemsFromLocalStorage = JSON.parse(getSavedCartItems());
  const isProductAlreadyExists = cartItemsFromLocalStorage
    .some((product) => product.id === productId);
  if (isProductAlreadyExists) {
    updatedProductCart(cartItemsFromLocalStorage, productId);
  } else {
    saveProductCartItem(productId);
  }
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
      .forEach(({ id, price, title, quantity }) => {
        const productCartLocalStorage = createCartItemElement({ id, price, title, quantity });
        cartItems.appendChild(productCartLocalStorage);
      });
    const localStorageTotalPrice = localStorage.getItem('totalPrice');
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
