from flask import Flask, request, flash, url_for, redirect, jsonify, Response, make_response, current_app, session, Blueprint, render_template
from flask_login import UserMixin, LoginManager, login_user, login_required, logout_user, current_user, login_manager
from flask_mail import Mail, Message
from flask_wtf.csrf import CSRFProtect, generate_csrf
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from sqlalchemy.sql import func
import datetime
import os
import pdfkit
from flask_httpauth import HTTPBasicAuth

# auth 

csrf = CSRFProtect()
mail = Mail()
login_manager = LoginManager()
auth = HTTPBasicAuth()

def paginaNaoEncontrada(e):
    return render_template('error404.html')


def create_app():  # or def create_app(config_class=Config)

    app = Flask(__name__)

    app.config.from_object("config.DevelopmentConfig")  # or app.config.from_object(config_class)


    # db = SQLAlchemy(app)
    
    from app.models.tables import db
    db.init_app(app)


    # from app.login.routes import csrf
    csrf.init_app(app)

    login_manager.init_app(app)
    mail.init_app(app)

    

    with app.app_context():

        db.create_all()
        db.reflect()

    
    from app.sensor.routes import sensor
    from app.geolocalizacao.routes import geo
    from app.login.routes import form
    from app.pessoas.routes import pessoa
    from app.local.routes import local
    from app.telemetria.routes import telemetria
    from app.config.routes import config
    from app.modulos.routes import modulo
    from app.informacao.routes import informacao


    app.register_blueprint(sensor)
    app.register_blueprint(geo)
    app.register_blueprint(form)
    app.register_blueprint(pessoa)
    app.register_blueprint(local)
    app.register_blueprint(telemetria)
    app.register_blueprint(config)
    app.register_blueprint(modulo)
    app.register_blueprint(informacao)

   
    # from app.controllers import default
    
    # @auth.verify_password
    # def verify_password(usuario, senha):
    #     if usuario in 
    users = {
        "esp8266": generate_password_hash("python")
    }

    @auth.verify_password
    def verify_password(username, password):
        if username in users and check_password_hash(users.get(username), password):
            return username

    from app.models.tables import Usuarios
    @login_manager.user_loader
    def get_user(user_id):
        return Usuarios.query.get(int(user_id))

    # app.errorhandler(404)
    app.register_error_handler(400, paginaNaoEncontrada)   # sem o decorator
   

    return app




