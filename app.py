import os 
from flask import Flask, render_template, request, redirect, url_for, flash, session 
from flask_sqlalchemy import SQLAlchemy   
 
 
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
 
if __name__ == "__main__":   
    with app.app_context(): 
        db.create_all()  
    app.run(debug=True)
