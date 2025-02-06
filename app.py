import os
from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
import tkinter as tk
from tkinter import messagebox, simpledialog

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SECRET_KEY'] = 'key'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/upload", methods=['POST'])
def upload():
    if 'user_email' not in session:
        flash('Пожалуйста, войдите в систему.', 'danger')
        return redirect(url_for('login'))

@app.route("/", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password1']
        remember = 'remember' in request.form
        user = User.query.filter_by(email=email).first()
        if email == "admin@12" and password == "admin":
            flash('Вход успешен как администратор!', 'success')
            return render_template("admin.html")
        if user and user.password == password:
            session['user_email'] = user.email
            if remember:
                session.permanent = True
            flash('Вход успешен!', 'success')
            return render_template("pols.html")
        else:
            flash('Неверный email или пароль!', 'danger')
    return render_template("login.html")

@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password1 = request.form['password1']
        password2 = request.form['password2']
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            flash('Пользователь с таким email уже существует!', 'danger')
            return redirect(url_for('register'))
        if password1 != password2:
            flash('Пароли не совпадают!', 'danger')
            return redirect(url_for('register'))
        new_user = User(name=name, email=email, password=password1)
        db.session.add(new_user)
        db.session.commit()
        flash('Регистрация успешна!', 'success')
        return render_template("pols.html")
    return render_template("register.html")

@app.route("/logout")
def logout():
    session.pop('user_email', None)
    flash('Вы вышли из системы.', 'success')
    return redirect(url_for('login'))

class InventoryItem:
    def __init__(self, id, name, type, quantity, condition):
        self.id = id
        self.name = name
        self.type = type
        self.quantity = quantity
        self.condition = condition

class Assignment:
    def __init__(self, id, inventory_id, user, date):
        self.id = id
        self.inventory_id = inventory_id
        self.user = user
        self.date = date

class Supply:
    def __init__(self, id, inventory_id, price, date, supplier):
        self.id = id
        self.inventory_id = inventory_id
        self.price = price
        self.date = date
        self.supplier = supplier

class Request:
    def __init__(self, name):
        self.name = name

class InventoryManager:
    def __init__(self):
        self.inventory = []
        self.requests = []
        self.assignments = []
        self.supplies = []
        self.next_inventory_id = 1
        self.next_assignment_id = 1
        self.next_supply_id = 1

    def add_inventory_item(self, name, type, quantity, condition):
        new_item = InventoryItem(self.next_inventory_id, name, type, quantity, condition)
        self.inventory.append(new_item)
        self.next_inventory_id += 1

    def edit_inventory_item(self, id, name, type, quantity, condition):
        for item in self.inventory:
            if item.id == id:
                item.name = name
                item.type = type
                item.quantity = quantity
                item.condition = condition
                break

    def delete_inventory_item(self, id):
        self.inventory = [item for item in self.inventory if item.id != id]

    def add_request(self, name):
        self.requests.append(Request(name))

    def add_assignment(self, inventory_id, user, date):
        new_assignment = Assignment(self.next_assignment_id, inventory_id, user, date)
        self.assignments.append(new_assignment)
        self.next_assignment_id += 1

    def edit_assignment(self, id, inventory_id, user, date):
        for assignment in self.assignments:
            if assignment.id == id:
                assignment.inventory_id = inventory_id
                assignment.user = user
                assignment.date = date
                break

    def delete_assignment(self, id):
        self.assignments = [assignment for assignment in self.assignments if assignment.id != id]

    def add_supply(self, inventory_id, price, date, supplier):
        new_supply = Supply(self.next_supply_id, inventory_id, price, date, supplier)
        self.supplies.append(new_supply)
        self.next_supply_id += 1

    def edit_supply(self, id, inventory_id, price, date, supplier):
        for supply in self.supplies:
            if supply.id == id:
                supply.inventory_id = inventory_id
                supply.price = price
                supply.date = date
                supply.supplier = supplier
                break

    def delete_supply(self, id):
        self.supplies = [supply for supply in self.supplies if supply.id != id]

    def generate_report(self):
        report = "Отчет по спортивному инвентарю\n\n"
        report += "Инвентарь:\n"
        for item in self.inventory:
            report += f"{item.name}: Тип - {item.type}, Количество - {item.quantity}, Состояние - {item.condition}\n"
        report += "\nЗаявки:\n"
        for request in self.requests:
            report += f"{request.name}\n"
        report += "\nЗакрепление инвентаря:\n"
        for assignment in self.assignments:
            inventory_item = next((item for item in self.inventory if item.id == assignment.inventory_id), None)
            report += f"Инвентарь: {inventory_item.name if inventory_item else 'Не найдено'}, Пользователь: {assignment.user}, Дата: {assignment.date}\n"
        report += "\nПоставки:\n"
        for supply in self.supplies:
            inventory_item = next((item for item in self.inventory if item.id == supply.inventory_id), None)
            report += f"Инвентарь: {inventory_item.name if inventory_item else 'Не найдено'}, Цена: {supply.price}, Дата: {supply.date}, Поставщик: {supply.supplier}\n"
        return report

inventory_manager = InventoryManager()

@app.route("/inventory", methods=['GET', 'POST'])
def inventory():
    if request.method == 'POST':
        action = request.form['action']
        if action == 'add_item':
            name = request.form['name']
            type = request.form['type']
            quantity = int(request.form['quantity'])
            condition = request.form['condition']
            inventory_manager.add_inventory_item(name, type, quantity, condition)
        elif action == 'edit_item':
            id = int(request.form['id'])
            name = request.form['name']
            type = request.form['type']
            quantity = int(request.form['quantity'])
            condition = request.form['condition']
            inventory_manager.edit_inventory_item(id, name, type, quantity, condition)
        elif action == 'delete_item':
            id = int(request.form['id'])
            inventory_manager.delete_inventory_item(id)
        elif action == 'add_request':
            name = request.form['name']
            inventory_manager.add_request(name)
        elif action == 'add_assignment':
            inventory_id = int(request.form['inventory_id'])
            user = request.form['user']
            date = request.form['date']
            inventory_manager.add_assignment(inventory_id, user, date)
        elif action == 'edit_assignment':
            id = int(request.form['id'])
            inventory_id = int(request.form['inventory_id'])
            user = request.form['user']
            date = request.form['date']
            inventory_manager.edit_assignment(id, inventory_id, user, date)
        elif action == 'delete_assignment':
            id = int(request.form['id'])
            inventory_manager.delete_assignment(id)
        elif action == 'add_supply':
            inventory_id = int(request.form['inventory_id'])
            price = float(request.form['price'])
            date = request.form['date']
            supplier = request.form['supplier']
            inventory_manager.add_supply(inventory_id, price, date, supplier)
        elif action == 'edit_supply':
            id = int(request.form['id'])
            inventory_id = int(request.form['inventory_id'])
            price = float(request.form['price'])
            date = request.form['date']
            supplier = request.form['supplier']
            inventory_manager.edit_supply(id, inventory_id, price, date, supplier)
        elif action == 'delete_supply':
            id = int(request.form['id'])
            inventory_manager.delete_supply(id)
    report = inventory_manager.generate_report()
    return render_template("inventory.html", report=report)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)

class InventoryApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Inventory Management")
        self.selected_items = {}
        self.submitted_requests = []
        self.create_widgets()

    def create_widgets(self):
        self.inventory_table = tk.Listbox(self.root)
        self.inventory_table.pack()
        self.selected_items_container = tk.Label(self.root, text="Выбранный инвентарь:")
        self.selected_items_container.pack()
        self.open_modal_btn = tk.Button(self.root, text="Открыть модальное окно", command=self.open_modal)
        self.open_modal_btn.pack()
        self.check_status_btn = tk.Button(self.root, text="Проверить статус", command=self.check_status)
        self.check_status_btn.pack()
        self.status_content = tk.Label(self.root, text="")
        self.status_content.pack()
        self.modal = tk.Toplevel(self.root)
        self.modal.title("Request Modal")
        self.modal.withdraw()
        self.status_modal = tk.Toplevel(self.root)
        self.status_modal.title("Status Modal")
        self.status_modal.withdraw()
        self.request_form = tk.Frame(self.modal)
        self.request_form.pack()
        self.user_name_label = tk.Label(self.request_form, text="Имя пользователя:")
        self.user_name_label.pack()
        self.user_name_entry = tk.Entry(self.request_form)
        self.user_name_entry.pack()
        self.user_comment_label = tk.Label(self.request_form, text="Комментарий:")
        self.user_comment_label.pack()
        self.user_comment_entry = tk.Entry(self.request_form)
        self.user_comment_entry.pack()
        self.submit_btn = tk.Button(self.request_form, text="Отправить", command=self.submit_request)
        self.submit_btn.pack()
        self.close_modal_btn = tk.Button(self.modal, text="Закрыть", command=self.close_modal)
        self.close_modal_btn.pack()
        self.close_status_btn = tk.Button(self.status_modal, text="Закрыть", command=self.close_status_modal)
        self.close_status_btn.pack()
        self.inventory_table.bind('<Double-1>', self.select_item)

    def select_item(self, event):
        selected_item = self.inventory_table.get(self.inventory_table.curselection())
        item_name, available_quantity = selected_item.split(': ')
        available_quantity = int(available_quantity)
        quantity = simpledialog.askinteger("Input", f"Введите количество для {item_name}: (в наличии: {available_quantity})", minvalue=1, maxvalue=available_quantity)
        if quantity:
            if quantity <= available_quantity:
                self.selected_items[item_name] = self.selected_items.get(item_name, 0) + quantity
                available_quantity -= quantity
                self.update_inventory_table(selected_item, available_quantity)
                self.update_selected_items_display()
            else:
                messagebox.showerror("Ошибка", "Выбрано больше, чем есть в наличии.")
        else:
            messagebox.showerror("Ошибка", "Некорректный ввод количества.")

    def update_inventory_table(self, item, available_quantity):
        item_name = item.split(': ')[0]
        new_item = f"{item_name}: {available_quantity}"
        index = self.inventory_table.curselection()[0]
        self.inventory_table.delete(index)
        self.inventory_table.insert(index, new_item)

    def update_selected_items_display(self):
        selected_items_text = "Выбранный инвентарь:\n"
        for item_name, quantity in self.selected_items.items():
            selected_items_text += f"- {item_name}: {quantity} шт.\n"
        self.selected_items_container.config(text=selected_items_text)

    def open_modal(self):
        self.modal.deiconify()

    def close_modal(self):
        self.modal.withdraw()

    def check_status(self):
        self.status_modal.deiconify()
        self.update_status_display()

    def close_status_modal(self):
        self.status_modal.withdraw()

    def update_status_display(self):
        if not self.submitted_requests:
            self.status_content.config(text="Нет поданных заявок.")
        else:
            requests_text = ""
            for index, request in enumerate(self.submitted_requests):
                requests_text += f"Заявка №{index + 1}\n"
                requests_text += f"Имя: {request['userName']}\n"
                requests_text += f"Комментарий: {request['userComment']}\n"
                requests_text += "Инвентарь:\n"
                for item_name, quantity in request['selectedItems'].items():
                    requests_text += f"- {item_name}: {quantity} шт.\n"
            self.status_content.config(text=requests_text)

    def submit_request(self):
        user_name = self.user_name_entry.get()
        user_comment = self.user_comment_entry.get()
        self.submitted_requests.append({
            "userName": user_name,
            "userComment": user_comment,
            "selectedItems": self.selected_items.copy()
        })
        messagebox.showinfo("Успех", "Заявка успешно отправлена!")
        self.close_modal()
        self.selected_items.clear()
        self.update_selected_items_display()

if __name__ == "__main__":
    root = tk.Tk()
    app = InventoryApp(root)
    root.mainloop()
Объяснение:
Flask: Управляет веб-интерфейсом и взаимодействием с базой данных.
Tkinter: Управляет настольным интерфейсом.
InventoryManager: Общий класс для управления инвентарем, который используется как в веб-интерфейсе, так и в настольном приложении.
Теперь у вас есть единое приложение, которое может работать как веб-приложение через Flask, так и настольное приложение через Tkinter, используя общую логику управления инвентарем.
