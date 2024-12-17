document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('request-modal');
    const statusModal = document.getElementById('status-modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const checkStatusBtn = document.getElementById('check-status-btn');
    const closeModalBtn = document.querySelectorAll('.close');
    const requestForm = document.getElementById('request-form');
    const selectedItemsContainer = document.getElementById('selected-items-container');
    const inventoryTable = document.getElementById('inventory-table');
    let selectedItems = [];


    inventoryTable.addEventListener('click', function (event) {
       if (event.target.classList.contains('select-item')) {
            const itemName = event.target.getAttribute('data-name');
             if (!selectedItems.includes(itemName)) {
              selectedItems.push(itemName);
             }
             updateSelectedItemsDisplay()
        }
    });


    function updateSelectedItemsDisplay(){
       if(selectedItems.length === 0){
          selectedItemsContainer.innerHTML = "<p>Выбранный инвентарь:</p>"
       } else {
        selectedItemsContainer.innerHTML = "<p>Выбранный инвентарь:</p>"
         selectedItems.forEach(item => {
           selectedItemsContainer.innerHTML += `<p>- ${item}</p>`;
           })
       }
    }

    // Открыть модальное окно
    openModalBtn.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    // Открыть модальное окно статуса
    checkStatusBtn.addEventListener('click', function() {
        statusModal.style.display = 'block';
    });
    // Закрыть модальное окно
    closeModalBtn.forEach(function (btn) {
        btn.addEventListener('click', function() {
          modal.style.display = 'none';
          statusModal.style.display = 'none';
        });
    });

     // Закрыть модальное окно при клике вне его
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
         if(event.target == statusModal){
          statusModal.style.display = 'none';
        }
    });

    // Обработка отправки формы
    requestForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const userName = document.getElementById('user-name').value;
        const userComment = document.getElementById('user-comment').value;

        console.log("Имя пользователя:", userName);
         console.log("Комментарий:", userComment);
         console.log("Выбранные элементы:", selectedItems)
        alert("Заявка успешно отправлена!");
         modal.style.display = 'none';
        selectedItems = [];
        updateSelectedItemsDisplay()
    });
});
