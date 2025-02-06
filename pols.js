<div id="request-modal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Подать заявку</h2>
        <form id="request-form">
            <label for="user-name">Имя:</label>
            <input type="text" id="user-name" name="user-name" required>
            <label for="user-comment">Комментарий:</label>
            <textarea id="user-comment" name="user-comment"></textarea>
            <button type="submit">Отправить</button>
        </form>
    </div>
</div>

<div id="status-modal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Статус заявок</h2>
        <div id="status-content"></div>
    </div>
</div>

<button id="open-modal-btn">Подать заявку</button>
<button id="check-status-btn">Проверить статус</button>

<div id="selected-items-container">
    <p>Выбранный инвентарь:</p>
</div>

<table id="inventory-table">
    <thead>
        <tr>
            <th>Название</th>
            <th>Описание</th>
            <th>Количество</th>
            <th>Выбрать</th>
        </tr>
    </thead>
    <tbody>
        <!-- Пример строки инвентаря -->
        <tr>
            <td>Предмет 1</td>
            <td>Описание предмета 1</td>
            <td>10</td>
            <td><button class="select-item" data-name="Предмет 1">Выбрать</button></td>
        </tr>
        <!-- Добавьте больше строк по мере необходимости -->
    </tbody>
</table>
