const defaultItems = [
    { id: 1, name: 'Помідори', qty: 2, isBought: false },
    { id: 2, name: 'Печиво', qty: 1, isBought: false },
    { id: 3, name: 'Сир', qty: 1, isBought: false }
];

let items = JSON.parse(localStorage.getItem('shoppingCart')) || defaultItems;

const inputField = document.getElementById('new-item-input');
const addBtn = document.getElementById('add-btn');
const listElement = document.getElementById('shopping-list');
const statsToBuyElement = document.getElementById('stats-to-buy');
const statsBoughtElement = document.getElementById('stats-bought');

function render() {
    listElement.innerHTML = '';
    
    items.forEach(item => {
        const li = document.createElement('li');
        
        const nameSpan = document.createElement('span');
        nameSpan.className = `item-name ${item.isBought ? 'bought' : ''}`;
        nameSpan.textContent = item.name;
        
        if (!item.isBought) {
            nameSpan.addEventListener('click', () => {
                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.value = item.name;
                li.replaceChild(editInput, nameSpan);
                editInput.focus();
                
                editInput.addEventListener('blur', () => {
                    if (editInput.value.trim() !== '') {
                        item.name = editInput.value.trim();
                    }
                    saveAndRender();
                });
                
                editInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') editInput.blur();
                });
            });
        }

        const controls = document.createElement('div');
        controls.className = 'controls';

        if (!item.isBought) {
            const minusBtn = document.createElement('button');
            minusBtn.textContent = '-';
            minusBtn.disabled = item.qty === 1;
            minusBtn.onclick = () => { item.qty--; saveAndRender(); };

            const qtySpan = document.createElement('span');
            qtySpan.textContent = ` ${item.qty} `;

            const plusBtn = document.createElement('button');
            plusBtn.textContent = '+';
            plusBtn.onclick = () => { item.qty++; saveAndRender(); };

            const buyBtn = document.createElement('button');
            buyBtn.textContent = 'Куплено';
            buyBtn.onclick = () => { item.isBought = true; saveAndRender(); };

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '✖';
            deleteBtn.onclick = () => {
                items = items.filter(i => i.id !== item.id);
                saveAndRender();
            };

            controls.append(minusBtn, qtySpan, plusBtn, buyBtn, deleteBtn);
        } else {
            const unbuyBtn = document.createElement('button');
            unbuyBtn.textContent = 'Зробити не купленим';
            unbuyBtn.onclick = () => { item.isBought = false; saveAndRender(); };
            controls.append(unbuyBtn);
        }

        li.append(nameSpan, controls);
        listElement.append(li);
    });

    renderStats();
}

function renderStats() {
    statsToBuyElement.innerHTML = '';
    statsBoughtElement.innerHTML = '';

    items.forEach(item => {
        const statItem = document.createElement('div');
        statItem.className = 'stats-item';
        statItem.textContent = `${item.name} - ${item.qty} шт.`;

        if (item.isBought) {
            statsBoughtElement.append(statItem);
        } else {
            statsToBuyElement.append(statItem);
        }
    });
}

function saveAndRender() {
    localStorage.setItem('shoppingCart', JSON.stringify(items));
    render();
}

function addItem() {
    const text = inputField.value.trim();
    if (text === '') return;

    items.push({
        id: Date.now(),
        name: text,
        qty: 1,
        isBought: false
    });

    inputField.value = '';
    inputField.focus(); 
    saveAndRender();
}

addBtn.addEventListener('click', addItem);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addItem();
});

render();