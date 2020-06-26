const button = document.querySelector('#addItem');
const itemElement = document.querySelector('#itemName');
const listaElement = document.querySelector('#lista');
const templateElement = document.querySelector('#template-item-lista');
const template = templateElement.innerHTML;

const storageHandler = {
  key: 'items',
  storage: localStorage,
  setItems: function (arr) {
    if (arr instanceof Array) this.storage.setItem(this.key, JSON.stringify(arr));
    else throw 'O valor passado para storageHandler.setItems() deve ser Array';
  },
  getItems: function () {
    return JSON.parse(this.storage.getItem(this.key) || '[]');
  }
};

const render = () => {
  const itemsHTML = items.map((value, index) => templateToHTML(value, template, index));
  listaElement.innerHTML = itemsHTML.join('\n');
};

const setItems = (arr) => {
  storageHandler.setItems(arr);
  items = storageHandler.getItems();
  render();
};

const templateToHTML = (itemName, template, id) => {
  const itemWithName = replaceAll('{{ITEM}}', itemName, template);
  const itemWithNameAndID = replaceAll('{{ID}}', id, itemWithName);
  return itemWithNameAndID;
};

const cleanValueAndFocus = (element) => {
  element.value = '';
  element.focus();
};

const addItem = (itemElement) => {
  const itemName = itemElement.value;
  if (itemName) {
    const newItems = [...items, itemName];
    setItems(newItems);
    cleanValueAndFocus(itemElement);
  }
};

const onClick = () => addItem(itemElement);

const filterKeyboardEventByKeyCode = (keyCode, callback, stopPropagation) => {

  return (evt) => {
    if (evt.keyCode === keyCode) {
      callback(evt);
      if (stopPropagation) {
        evt.preventDefault();
        return false;
      }
    }
    return true;
  };
};

const onRemoveCliked = (evt) => {
    const index = parseInt(evt.target.attributes['data-id'].nodeValue);
    setItems(items.filter((v, i) => i !== index));
};

const init = () => {
  items = storageHandler.getItems();
  button.addEventListener('click', onClick);
  itemElement.addEventListener('keypress', filterKeyboardEventByKeyCode(13, () => addItem(itemElement)));
  listaElement.addEventListener('click', onRemoveCliked);
  itemElement.focus();
  render();
};

init();