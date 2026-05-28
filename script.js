const form = document.getElementById('shopping-form');
const input = document.getElementById('item-input');
const quantityInput = document.getElementById('quantity-input');
const list = document.getElementById('shopping-list');
const clearButton = document.getElementById('clear-list');

const STORAGE_KEY = 'shoppingListItems';

function loadItems() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function createListItem(item, index) {
  const li = document.createElement('li');

  const quantityField = document.createElement('input');
  quantityField.type = 'number';
  quantityField.min = '1';
  quantityField.value = item.quantity;
  quantityField.className = 'item-quantity';
  quantityField.addEventListener('change', () => {
    const rawValue = parseInt(quantityField.value, 10);
    if (!Number.isInteger(rawValue) || rawValue < 1) {
      quantityField.value = item.quantity;
      return;
    }
    updateQuantity(index, rawValue);
  });

  const itemName = document.createElement('span');
  itemName.className = 'item-name';
  itemName.textContent = item.name;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Remover';
  deleteButton.type = 'button';
  deleteButton.addEventListener('click', () => {
    removeItem(index);
  });

  const rightActions = document.createElement('div');
  rightActions.className = 'item-actions';
  rightActions.append(deleteButton);

  li.append(quantityField, itemName, rightActions);
  return li;
}

function updateQuantity(index, quantity) {
  const items = loadItems();
  items[index].quantity = quantity;
  saveItems(items);
  renderList();
}

function renderList() {
  const items = loadItems();
  list.innerHTML = '';

  if (items.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.textContent = 'Sua lista está vazia. Adicione um item!';
    emptyMessage.style.color = '#666';
    emptyMessage.style.justifyContent = 'center';
    list.appendChild(emptyMessage);
    return;
  }

  items.forEach((item, index) => {
    list.appendChild(createListItem(item, index));
  });
}

function addItem(event) {
  event.preventDefault();
  const newItem = input.value.trim();
  const rawQuantity = parseInt(quantityInput.value, 10);
  const quantity = Number.isInteger(rawQuantity) && rawQuantity > 0 ? rawQuantity : 1;

  if (!newItem) {
    input.focus();
    return;
  }

  const items = loadItems();
  const duplicate = items.some(
    (item) => item.name.toLowerCase() === newItem.toLowerCase()
  );

  if (duplicate) {
    input.value = '';
    quantityInput.value = '1';
    input.focus();
    return;
  }

  items.push({ name: newItem, quantity });
  saveItems(items);
  input.value = '';
  quantityInput.value = '1';
  renderList();
}

function removeItem(index) {
  const items = loadItems();
  items.splice(index, 1);
  saveItems(items);
  renderList();
}

function clearList() {
  const confirmed = window.confirm('Deseja realmente limpar toda a lista?');
  if (!confirmed) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
  renderList();
}

form.addEventListener('submit', addItem);
clearButton.addEventListener('click', clearList);

renderList();
