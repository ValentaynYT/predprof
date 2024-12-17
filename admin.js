let inventory = [];
let requests = [];
let assignments = [];
let supplies = [];
let nextInventoryId = 1;
let nextAssignmentId = 1;
let nextSupplyId = 1;


function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
    document.getElementById('inventory-form').reset();
    document.getElementById('assignment-form').reset();
    document.getElementById('supply-form').reset();
}

function openAddInventoryModal(editId) {
     openModal('addInventoryModal');
      if (editId) {
            const item = inventory.find(item => item.id === editId);
            document.getElementById('inventory-id').value = item.id;
            document.getElementById('name').value = item.name;
            document.getElementById('type').value = item.type;
            document.getElementById('quantity').value = item.quantity;
            document.getElementById('condition').value = item.condition;
        } else {
            document.getElementById('inventory-id').value = '';
            document.getElementById('inventory-form').reset();
        }
}


document.getElementById('inventory-form').addEventListener('submit', function(event){
    event.preventDefault();
       const id = document.getElementById('inventory-id').value;
    const name = document.getElementById('name').value;
    const type = document.getElementById('type').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const condition = document.getElementById('condition').value;

     if (id) {
           const index = inventory.findIndex(item => item.id === parseInt(id));
            if (index !== -1) {
                inventory[index] = {id: parseInt(id),name: name, type: type, quantity: quantity, condition: condition};
            }
        } else {
            const newItem = {id: nextInventoryId++, name: name, type: type, quantity: quantity, condition: condition};
            inventory.push(newItem);
        }
        closeModal('addInventoryModal');
        renderInventoryTable();
         renderSupplyInventoryOptions();
           renderAssignmentInventoryOptions();
});


function deleteInventoryItem(id) {
    inventory = inventory.filter(item => item.id !== id);
     renderInventoryTable();
      renderSupplyInventoryOptions();
       renderAssignmentInventoryOptions();
}


function renderInventoryTable() {
    const tableBody = document.getElementById('inventory-body');
    tableBody.innerHTML = '';
    inventory.forEach(item => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = item.name;
        row.insertCell().textContent = item.type;
        row.insertCell().textContent = item.quantity;
        row.insertCell().textContent = item.condition;
        const actionsCell = row.insertCell();

        const editButton = document.createElement('button');
        editButton.textContent = 'Изменить';
         editButton.onclick = () => openAddInventoryModal(item.id);
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
         deleteButton.textContent = 'Удалить';
        deleteButton.onclick = () => deleteInventoryItem(item.id);
         actionsCell.appendChild(deleteButton);
    });
}



function addRequest(name) {
    requests.push({name: name});
    renderRequests();
}

function renderRequests() {
    const requestList = document.getElementById('request-list');
    requestList.innerHTML = '';
    requests.forEach(req => {
        const listItem = document.createElement('li');
        listItem.textContent = req.name;
        requestList.appendChild(listItem);
    });
}


function openAddAssignmentModal(editId) {
    openModal('addAssignmentModal');
       if (editId) {
            const item = assignments.find(item => item.id === editId);
            document.getElementById('assignment-id').value = item.id;
           document.getElementById('assignment-inventory').value = item.inventoryId;
           document.getElementById('assignment-user').value = item.user;
           document.getElementById('assignment-date').value = item.date;
        } else {
            document.getElementById('assignment-id').value = '';
            document.getElementById('assignment-form').reset();
        }
}

function renderAssignmentInventoryOptions() {
    const selectElement = document.getElementById('assignment-inventory');
    selectElement.innerHTML = '';

    inventory.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        selectElement.appendChild(option);
    });
}

document.getElementById('assignment-form').addEventListener('submit', function(event){
     event.preventDefault();
        const id = document.getElementById('assignment-id').value;
        const inventoryId = document.getElementById('assignment-inventory').value;
        const user = document.getElementById('assignment-user').value;
        const date = document.getElementById('assignment-date').value;

     if (id) {
           const index = assignments.findIndex(item => item.id === parseInt(id));
            if (index !== -1) {
                assignments[index] = {id: parseInt(id), inventoryId:inventoryId, user: user, date: date};
            }
        } else {
            const newAssignment = {id: nextAssignmentId++, inventoryId: inventoryId, user: user, date: date};
             assignments.push(newAssignment);
        }
        closeModal('addAssignmentModal');
        renderAssignmentsTable();
});


function deleteAssignmentItem(id) {
    assignments = assignments.filter(item => item.id !== id);
     renderAssignmentsTable();
}


function renderAssignmentsTable() {
    const tableBody = document.getElementById('assignments-body');
    tableBody.innerHTML = '';
      assignments.forEach(item => {
            const inventoryItem = inventory.find(inv => inv.id === parseInt(item.inventoryId));
             const row = tableBody.insertRow();
              row.insertCell().textContent = inventoryItem ? inventoryItem.name : 'Не найдено';
                row.insertCell().textContent = item.user;
                row.insertCell().textContent = item.date;
                const actionsCell = row.insertCell();

                 const editButton = document.createElement('button');
                  editButton.textContent = 'Изменить';
                  editButton.onclick = () => openAddAssignmentModal(item.id);
                   actionsCell.appendChild(editButton);

                    const deleteButton = document.createElement('button');
                   deleteButton.textContent = 'Удалить';
                  deleteButton.onclick = () => deleteAssignmentItem(item.id);
                 actionsCell.appendChild(deleteButton);

        });
}

function openAddSupplyModal(editId) {
     openModal('addSupplyModal');
      if (editId) {
            const item = supplies.find(item => item.id === editId);
            document.getElementById('supply-id').value = item.id;
           document.getElementById('supply-inventory').value = item.inventoryId;
           document.getElementById('supply-price').value = item.price;
            document.getElementById('supply-date').value = item.date;
            document.getElementById('supply-supplier').value = item.supplier;

        } else {
             document.getElementById('supply-id').value = '';
           document.getElementById('supply-form').reset();
        }
}

function renderSupplyInventoryOptions() {
    const selectElement = document.getElementById('supply-inventory');
    selectElement.innerHTML = '';

    inventory.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        selectElement.appendChild(option);
    });
}

document.getElementById('supply-form').addEventListener('submit', function(event){
    event.preventDefault();
    const id = document.getElementById('supply-id').value;
    const inventoryId = document.getElementById('supply-inventory').value;
        const price = parseFloat(document.getElementById('supply-price').value);
        const date = document.getElementById('supply-date').value;
         const supplier = document.getElementById('supply-supplier').value;


      if (id) {
           const index = supplies.findIndex(item => item.id === parseInt(id));
            if (index !== -1) {
                supplies[index] = {id: parseInt(id), inventoryId:inventoryId, price: price, date: date, supplier: supplier};
            }
        } else {
            const newSupply = {id: nextSupplyId++,inventoryId: inventoryId, price: price, date: date, supplier: supplier};
            supplies.push(newSupply);
        }
        closeModal('addSupplyModal');
        renderSupplyTable();
});


function deleteSupplyItem(id) {
    supplies = supplies.filter(item => item.id !== id);
     renderSupplyTable();
}

function renderSupplyTable() {
    const tableBody = document.getElementById('supply-body');
    tableBody.innerHTML = '';
    supplies.forEach(item => {
            const inventoryItem = inventory.find(inv => inv.id === parseInt(item.inventoryId));
              const row = tableBody.insertRow();
               row.insertCell().textContent = inventoryItem ? inventoryItem.name : 'Не найдено';
                row.insertCell().textContent = item.price;
                 row.insertCell().textContent = item.date;
                 row.insertCell().textContent = item.supplier;
                const actionsCell = row.insertCell();

                const editButton = document.createElement('button');
                  editButton.textContent = 'Изменить';
                 editButton.onclick = () => openAddSupplyModal(item.id);
                  actionsCell.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Удалить';
                 deleteButton.onclick = () => deleteSupplyItem(item.id);
                actionsCell.appendChild(deleteButton);
        });
}


function generateReport() {
    const reportOutput = document.getElementById('report-output');
    reportOutput.innerHTML = '';
     const reportContent = `
        <h2>Отчет по спортивному инвентарю</h2>
        <h3>Инвентарь:</h3>
         ${inventory.map(item => `<p><b>${item.name}:</b> Тип - ${item.type}, Количество - ${item.quantity}, Состояние - ${item.condition}</p>`).join('')}
          <h3>Заявки:</h3>
            ${requests.map(request => `<p>${request.name}</p>`).join('')}
        <h3>Закрепление инвентаря:</h3>
        ${assignments.map(assignment => {
           const inventoryItem = inventory.find(inv => inv.id === parseInt(assignment.inventoryId));
            return `<p><b>Инвентарь:</b> ${inventoryItem ? inventoryItem.name : 'Не найдено'}, Пользователь: ${assignment.user}, Дата: ${assignment.date}</p>`;
        }).join('')}
         <h3>Поставки:</h3>
           ${supplies.map(supply => {
            const inventoryItem = inventory.find(inv => inv.id === parseInt(supply.inventoryId));
                return `<p><b>Инвентарь:</b> ${inventoryItem ? inventoryItem.name : 'Не найдено'}, Цена: ${supply.price}, Дата: ${supply.date}, Поставщик: ${supply.supplier}</p>`;
        }).join('')}

    `;
     reportOutput.innerHTML = reportContent;
}

renderInventoryTable();
renderRequests();
renderAssignmentsTable();
renderSupplyTable();
renderSupplyInventoryOptions();
renderAssignmentInventoryOptions();
