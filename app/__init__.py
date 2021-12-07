from flask import Flask, render_template, request, flash, url_for, redirect, Blueprint, session, jsonify, Response, make_response, current_app
from flask_wtf.csrf import CSRFProtect
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, LoginManager, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from sqlalchemy.sql import func
from flask_mail import Mail, Message
import datetime
import pdfkit
import os
# from flask_wtf.csrf import CSRFProtect

# from flask_migrate import Migrate, MigrateCommand
# print(SQLAlchemy, dir(SQLAlchemy))
# def create_app():
#     app = Flask(__name__)
#
#     app.config.from_object("config")
#     from app.login.routes import form
#     # app.register_blueprint(api)
#     # app.register_blueprint(site)
#     app.register_blueprint(form)
#
#     return app


# db = SQLAlchemy(create_app())

# class MinhaReposta(Response):
#     headers = {
#         'X-Content-Type-Options': 'nosniff'    
#     }

app = Flask(__name__)

app.config.from_object("config.DevelopmentConfig")  #from_object("config")

 
# app.response_class = list(MinhaReposta.headers.get('X-Content-Type-Options')) 
# session.permanent = True
# app.permanent_session_lifetime = datetime.timedelta(seconds=15)
# session.modified = True


csrf = CSRFProtect()
csrf.init_app(app)

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)


mail = Mail(app)


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
app.register_blueprint(config) # , url_prefix="/config")
app.register_blueprint(modulo)
app.register_blueprint(informacao)


from app.models.forms import LoginForm, Usuario
from app.models.tables import Usuarios
# from app.controllers import default

@app.errorhandler(404)
def paginaNaoEncontrada(e):
    return render_template('error404.html')

@login_manager.user_loader
def get_user(user_id):
    return Usuarios.query.get(int(user_id))

# app.run(debug=True, host='192.168.0.9', port=58000)
