const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

// change the state of the form button
itemInput.addEventListener('input', e => {
	if (isEditMode) {
		formBtn.style.backgroundColor = '#1aaf22';
		formBtn.innerHTML = `<i class="fa-solid fa-check"></i> Save changes`;
		console.log('Item input listener ||| ');
	}
});

// display items when page loads
function displayItems() {
	// get items from local storage
	const itemsFromLocalStorage = JSON.parse(localStorage.getItem('items'));

	if (itemsFromLocalStorage === null) {
		return;
	}

	for (const item of itemsFromLocalStorage) {
		addItemToDOM(item);
	}

	checkUI();
}

// add an item
function onAddItemSubmit(e) {
	e.preventDefault();

	const newItem = itemInput.value;

	if (newItem === '') {
		alert('Please enter the name of an item first');

		return;
	}

	// check if it is edit mode
	if (isEditMode) {
		const itemToEdit = itemList.querySelector('.edit-mode');

		removeItemFromLocalStorage(itemToEdit.textContent);

		itemToEdit.classList.remove('edit-mode');
		itemToEdit.remove();

		isEditMode = false;
	}

	// check it exists
	if (!checkItemExists(newItem)) {
		// create DOM item
		addItemToDOM(newItem);

		// add item to local storage
		addItemToStorage(newItem);

		checkUI();

		itemInput.value = '';
	}
}

function addItemToDOM(item) {
	// create list item
	const li = document.createElement('li');

	li.appendChild(document.createTextNode(item));

	const button = createButton('remove-item btn-link text-red');

	li.appendChild(button);

	// add item to the DOM
	itemList.appendChild(li);
}

function createButton(classes) {
	const button = document.createElement('button');

	button.className = classes;

	const icon = createIcon('fa-solid fa-xmark');

	button.appendChild(icon);

	return button;
}

function createIcon(classes) {
	const icon = document.createElement('i');

	icon.className = classes;

	return icon;
}

function addItemToStorage(item) {
	const itemsFromLocalStorage = getItemsFromLocalStorage();

	itemsFromLocalStorage.push(item);

	localStorage.setItem('items', JSON.stringify(itemsFromLocalStorage));
}

function removeItemFromLocalStorage(itemName) {
	let itemsFromLocalStorage = getItemsFromLocalStorage();

	// filter out the local storage items by the item name
	itemsFromLocalStorage = itemsFromLocalStorage.filter(
		item => item !== itemName
	);

	// persist the new items in local storage
	localStorage.setItem('items', JSON.stringify(itemsFromLocalStorage));
}

function getItemsFromLocalStorage() {
	let itemsFromStorage;

	if (localStorage.getItem('items') === null) {
		itemsFromStorage = [];
	} else {
		itemsFromStorage = JSON.parse(localStorage.getItem('items'));
	}

	return itemsFromStorage;
}

function onClickItem(e) {
	if (e.target.parentElement.classList.contains('remove-item')) {
		removeItem(e.target.parentElement.parentElement);
	} else {
		if (e.target.nodeName === 'UL') {
			return;
		} else {
			setItemToEdit(e.target);
		}
	}
}

// edit item
function setItemToEdit(item) {
	isEditMode = true;

	itemList.querySelectorAll('li').forEach(li => {
		li.classList.remove('edit-mode');
	});

	item.classList.add('edit-mode');

	formBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Edit item`;

	formBtn.style.backgroundColor = '#3168ce';

	itemInput.value = item.textContent;
}

// remove an item
function removeItem(item) {
	// remove form DOM
	if (confirm('Are you sure?')) {
		item.remove();
	}

	// remove from local storage
	removeItemFromLocalStorage(item.textContent);

	// check if the list item is empty after an item was removed
	checkUI();
}

// clear all items
function clearItems() {
	while (itemList.firstChild) {
		itemList.removeChild(itemList.firstChild);
	}

	// remove items from local storage
	localStorage.removeItem('items');

	checkUI();
}

function filterItems(e) {
	const items = itemList.querySelectorAll('li');
	const text = e.target.value.toLowerCase();

	for (let item of items) {
		const itemValue = item.firstChild.textContent.toLocaleLowerCase();

		if (itemValue.indexOf(text) != -1) {
			item.style.display = 'flex';
		} else {
			item.style.display = 'none';
		}
	}
}

// check if the list item is empty
function checkUI() {
	const items = itemList.querySelectorAll('li');

	if (items.length === 0) {
		itemFilter.style.display = 'none';
		clearBtn.style.display = 'none';
	} else {
		itemFilter.style.display = 'block';
		clearBtn.style.display = 'block';
	}

	// change the form button state to normal
	formBtn.style.backgroundColor = '#333';
	formBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add item`;

	isEditMode = false;
}

// check item already in the list
function checkItemExists(itemName) {
	const items = itemList.querySelectorAll('li');

	for (const item of items) {
		if (item.textContent === itemName) {
			alert(
				'The item you are trying to add is already in the list. Please consider changing the name.'
			);

			return true;
		}
	}
}

// event listeners
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);

// on page load
checkUI();
