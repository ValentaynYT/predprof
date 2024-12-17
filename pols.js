document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('request-modal');
    const statusModal = document.getElementById('status-modal');
     const statusContent = document.getElementById('status-content');
    const openModalBtn = document.getElementById('open-modal-btn');
    const checkStatusBtn = document.getElementById('check-status-btn');
    const closeModalBtn = document.querySelectorAll('.close');
    const requestForm = document.getElementById('request-form');
    const selectedItemsContainer = document.getElementById('selected-items-container');
    const inventoryTable = document.getElementById('inventory-table');
    let selectedItems = {};
    let submittedRequests = [];

    inventoryTable.addEventListener('click', function (event) {
        if (event.target.classList.contains('select-item')) {
            const itemName = event.target.getAttribute('data-name');
            const itemRow = event.target.closest('tr');
            const quantityCell = itemRow.querySelector('td:nth-child(3)');
            let availableQuantity = parseInt(quantityCell.textContent);
             let quantity = prompt(`Введите количество для ${itemName}: (в наличии: ${availableQuantity})`, '1');

             if (quantity !== null && !isNaN(quantity) && parseInt(quantity) > 0) {
                quantity = parseInt(quantity);
                if (quantity <= availableQuantity) {
                     selectedItems[itemName] = (selectedItems[itemName] || 0) + quantity;
                     availableQuantity -= quantity;
                    quantityCell.textContent = availableQuantity;
                     updateSelectedItemsDisplay();
                 } else {
                    alert('Выбрано больше, чем есть в наличии.');
                  }
              }
               else {
                 alert('Некорректный ввод количества.');
              }
           }
        });


      function updateSelectedItemsDisplay() {
            if (Object.keys(selectedItems).length === 0) {
                selectedItemsContainer.innerHTML = "<p>Выбранный инвентарь:</p>";
            } else {
                selectedItemsContainer.innerHTML = "<p>Выбранный инвентарь:</p>";
                for (const itemName in selectedItems) {
                    selectedItemsContainer.innerHTML += `<p>- ${itemName}: ${selectedItems[itemName]} шт.</p>`;
                }
            }
        }



    openModalBtn.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    checkStatusBtn.addEventListener('click', function() {
        statusModal.style.display = 'block';
         updateStatusDisplay();
    });
    closeModalBtn.forEach(function (btn) {
        btn.addEventListener('click', function() {
          modal.style.display = 'none';
          statusModal.style.display = 'none';
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
         if(event.target == statusModal){
          statusModal.style.display = 'none';
        }
    });
     function updateStatusDisplay() {
            if (submittedRequests.length === 0) {
                statusContent.innerHTML = '<p>Нет поданных заявок.</p>';
            } else {
                  let requestsHTML = '';
                 submittedRequests.forEach((request, index) => {
                     requestsHTML += `<div class="request-item">
                       <h3>Заявка №${index + 1}</h3>
                         <p><strong>Имя:</strong> ${request.userName}</p>
                         <p><strong>Комментарий:</strong> ${request.userComment}</p>
                          <p><strong>Инвентарь:</strong></p>
                             <ul>`;
                   for(const itemName in request.selectedItems){
                   requestsHTML += `<li>- ${itemName}: ${request.selectedItems[itemName]} шт.</li>`
                    }
                    requestsHTML +=   `</ul></div>`;
                   });
              statusContent.innerHTML = requestsHTML;
          }
       }

    requestForm.addEventListener('submit', function(event) {
         event.preventDefault();
          const userName = document.getElementById('user-name').value;
        const userComment = document.getElementById('user-comment').value;

        submittedRequests.push({
              userName,
              userComment,
             selectedItems: { ...selectedItems }
        });

        console.log("Имя пользователя:", userName);
         console.log("Комментарий:", userComment);
          console.log("Выбранные элементы:", selectedItems);
          console.log("Заявки", submittedRequests)

        alert("Заявка успешно отправлена!");
         modal.style.display = 'none';
        selectedItems = {};
         updateSelectedItemsDisplay();
    });
});
