from enum import auto
from app import login_manager, generate_password_hash, check_password_hash, func, UserMixin, datetime
from flask_sqlalchemy import SQLAlchemy
# create_engine =


db = SQLAlchemy()

class Usuarios(UserMixin, db.Model):
    __tablename__ = "usuarios"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)
    dataCriacao = db.Column(db.DateTime(), default=func.localtimestamp(), nullable=False)
    sexo = db.Column(db.String(20), nullable=False)
    cpf = db.Column(db.String(14), nullable=False)
    tel = db.Column(db.String(15), nullable=False)
    idade = db.Column(db.Integer, nullable=False)
    dataNasc = db.Column(db.Date(), nullable=False)
    tipoUsuario = db.Column(db.Integer, db.ForeignKey("tipo_usuario.id", ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    local = db.relationship('Local', backref='usuarios', lazy=True, passive_deletes=False)
    
    # sensor = db.Column(db.Integer, db.ForeignKey('sensores.id', ondelete="CASCADE", onupdate="CASCADE"), nullable=True)
    configuracao_id = db.relationship('ConfiguracaoJson', backref='usuarios', lazy=True, passive_deletes=False)
    # pessoa = db.relationship('Pessoa', uselist=False, backref='user')

    def __init__(self, nome, email, senha, sexo, cpf, tel, dataNasc, tipoUsuario):
        self.nome = nome
        self.email = email
        self.senha = generate_password_hash(senha)
        # self.dataCriacao = dataCriacao
        self.sexo = sexo
        self.cpf = cpf
        self.tel = tel
        self.dataNasc = dataNasc
        self.idade = self.calculaIdade()
        self.tipoUsuario = tipoUsuario


    def verifica_senha(self, senhaTemp):
        return check_password_hash(self.senha, senhaTemp)

    def calculaIdade(self):
        # ano = int(self.dataNasc.year)
        # mes = int(self.dataNasc.month)
        # dia = int(self.dataNasc.day)
        dataForm = datetime.date(day=self.dataNasc.day, month=self.dataNasc.month, year=self.dataNasc.year)
        idade = datetime.date.today() - dataForm
        print(idade)
        print((idade / 365))
        if datetime.date.month == self.dataNasc.month and datetime.date.day == self.dataNasc.day:
            idade = idade + 1
            return (idade / 365).days
        else:
            return (idade / 365).days
        return (idade / 365).days


class TipoUsuario(UserMixin, db.Model):
    __tablename__ = "tipo_usuario"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipoUsuario = db.Column(db.String(50), nullable=False)
    usuario_id = db.relationship('Usuarios', backref='tipo_usuario', lazy=True, passive_deletes=False)
    dataCriacao = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=True)
    dataAtualizacao = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=True)

    def __init__(self, tipoUsuario):
        self.tipoUsuario = tipoUsuario


class Sensores(UserMixin, db.Model):
    __tablename__ = "sensores"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipoSensor = db.Column(db.String(100), nullable=False)
    descritivo = db.Column(db.String(100), nullable=False)
    dataSensor = db.Column(db.DateTime(), default=func.localtimestamp(), nullable=False)
    # fotoSensor = db.Column(db.String(100), nullable=False)
    informacao_id = db.relationship('Informacao', backref='sensores', uselist=False, passive_deletes=False)


    def __init__(self, tipoSensor, descritivo):
        self.tipoSensor = tipoSensor
        self.descritivo = descritivo
        # self.fotoSensor = fotoSensor


class Geolocalizacao(UserMixin, db.Model):
    __tablename__ = "geolocalizacao"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    dataCriacao = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    json = db.Column(db.JSON, nullable=False)
    # dataCriacao = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)

    def __init__(self, json):
        self.json = json


class Telemetria(UserMixin, db.Model):
    __tablename__ = "telemetria"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    json = db.Column(db.JSON, nullable=False)
    dataCriacao = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)

    def __init__(self, json):
        self.json = json


class Informacao(UserMixin, db.Model):
    __tablename__ = "informacao"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_sensores = db.Column(db.Integer, db.ForeignKey('sensores.id', ondelete="CASCADE", onupdate="CASCADE"), nullable=True)
    # id_telemetria = db.Column(db.Integer, db.ForeignKey('telemetria.id', ondelete="CASCADE", onupdate="CASCADE"), nullable=True)
    id_modulos = db.Column(db.Integer, db.ForeignKey('modulos.id', ondelete="CASCADE", onupdate="CASCADE"), nullable=True)
    # id_local = db.Column(db.Integer, db.ForeignKey('local.id', ondelete="CASCADE", onupdate="CASCADE"), nullable=True)
    dataCriacao = db.Column(db.DateTime(timezone=True), default=func.now(), nullable=False)

    def __init__(self, id_sensores, id_modulos, id_local):
        self.id_sensores = id_sensores
        self.id_modulos = id_modulos
        self.id_local = id_local


class Local(UserMixin, db.Model):
    __tablename__ = "local"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cep = db.Column(db.String(11), nullable=False)
    endereco = db.Column(db.String(100), nullable=False)
    cidade = db.Column(db.String(100), nullable=False)
    bairro = db.Column(db.String(100), nullable=False)
    estado = db.Column(db.String(100), nullable=False)
    obs = db.Column(db.Text)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    # informacao_id = db.relationship('Informacao', backref='local', uselist=False, passive_deletes=False)

    def __init__(self, cep, endereco, cidade, bairro, estado, obs, usuario):
        self.cep = cep
        self.endereco = endereco
        self.cidade = cidade
        self.bairro = bairro
        self.estado = estado
        self.obs = obs
        self.usuario_id = usuario


class Configuracao(UserMixin, db.Model):
    __tablename__ = "configuracao"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tempo_execucao_telemetria = db.Column(db.Float, nullable=False)
    tempo_execucao_geolocalizacao = db.Column(db.Float, nullable=False)
    tempo_execucao_soneca = db.Column(db.Float, nullable=False)
    tempo_execucao_thingspeak = db.Column(db.Float, nullable=False)
    secret_key_thingspeak = db.Column(db.String(50), nullable=False)
    url_ip_api = db.Column(db.String(50), nullable=False)
    url_thingspeak = db.Column(db.String(50), nullable=False)
    resetar_configs_wifi = db.Column(db.Boolean, nullable=False)
    alerta_email = db.Column(db.Boolean, nullable=False)
    valor_gas_aviso = db.Column(db.Float, nullable=False)
    # json = db.Column(db.JSON, nullable=False)
    dataCriacao = db.Column(db.DateTime(timezone=True), default=func.now(), nullable=False)
    dataAtualizacao = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id', ondelete="CASCADE", onupdate="CASCADE"), nullable=True)

    def __init__(self, tempoTelemetria, tempoGeolocalizacao, tempoSoneca, tempoThingSpeak, secretKeyThingSpeak, urlIpApi, urlThingSpeak, resetarConfigsWifi, alertaEmail, valorGasAviso, usuario_id):
        self.tempo_execucao_telemetria = tempoTelemetria
        self.tempo_execucao_geolocalizacao = tempoGeolocalizacao
        self.tempo_execucao_soneca = tempoSoneca
        self.tempo_execucao_thingspeak = tempoThingSpeak
        self.secret_key_thingspeak = secretKeyThingSpeak
        self.url_ip_api = urlIpApi
        self.url_thingspeak = urlThingSpeak
        self.resetar_configs_wifi = resetarConfigsWifi
        self.alerta_email = alertaEmail
        self.valor_gas_aviso = valorGasAviso
        # self.json = json
        self.usuario_id = usuario_id


class Modulos(UserMixin, db.Model):
    __tablename__ = "modulos"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    json = db.Column(db.JSON, nullable=False)
    dataCriacao = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    dataAtualizacao = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    informacao_id = db.relationship('Informacao', backref='modulos', uselist=False, passive_deletes=False)
    # mac = db.Column(db.String(15), nullable=False)
    # ip_interno = db.Column(db.String(15), nullable=False)
    # id_geo = db.Column(db.Integer, nullable=False)

    def __init__(self, json):
        self.json = json



class ConfiguracaoJson(UserMixin, db.Model):
    __tablename__ = "configuracaoJson"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    json = db.Column(db.JSON, nullable=False)
    usuarioId = db.Column(db.Integer, db.ForeignKey('usuarios.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    dataCriacao = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    dataAtualizacao = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.current_timestamp(), nullable=False)

    def __init__(self, json, usuarioId):
        self.json = json
        self.usuarioId = usuarioId


# class

# db.session.remove()
# db.reflect()  # reflete tabelas do banco de dados
# db.drop_all()
# db.create_all()


# class Pessoa(UserMixin, db.Model):
#     __tablename__ = "pessoas"

#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     nome = db.Column(db.String(100), nullable=False)
#     # idade = db.Column(db.Integer, nullable=False)
#     dataNasc = db.Column(db.Date, nullable=False)

#     usuario_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="NO ACTION", onupdate="CASCADE"),
#                            nullable=False, unique=True)

#     # usuario_id = db.relationship("User", back_populates="pessoas")

#     # local_id = db.Column(db.Integer, db.ForeignKey(''))

#     def __init__(self, nome, dataNasc, sexo, cpf, tel, usuario_id):
#         self.nome = nome
#         # self.idade = idade
#         self.dataNasc = dataNasc
#         self.sexo = sexo
#         self.cpf = cpf
#         self.tel = tel
#         self.usuario_id = usuario_id
