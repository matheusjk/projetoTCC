from datetime import timedelta


class Config(object):
    TESTING = False
    DEBUG = True

class ProductionConfig(Config):
    
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=5)
    REMEmBER_COOKIE_DURATION = timedelta(minutes=5)
    REMEMBER_COOKIE_REFRESH_EACH_REQUEST = True
    # SQLALCHEMY_DATABASE_URI = "mysql+pymysql://teste:123@mudar@localhost:3306/tcc"
    # SQLALCHEMY_DATABASE_URI = "mysql+pymysql://tcc2:123@mudar@192.168.0.8:3306/tcc"
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root@localhost:3306/tcc"
    # SQLALCHEMY_DATABASE_URI = "mysql+pymysql://tcc3:123@mudar*@192.168.0.12:3306/tcc"
    # SQLALCHEMY_DATABASE_URI = "mysql+pymysql://tcc2:123@mudar@192.168.0.7:3306/tcc?charset=utf8"
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_ECHO = False
    SECRET_KEY = "123@python+iot"

    MAIL_SERVER = "smtp-mail.outlook.com"
    MAIL_PORT = 587
    MAIL_USERNAME = ''
    MAIL_PASSWORD = ''
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False

class DevelopmentConfig(Config):
    # DEBUG = True

    # WTF_CSRF_ENABLED = True
    RECAPTCHA_OPTION = {'theme': 'custom'}
    RECAPTCHA_PRIVATE_KEY = '6LfelAIcAAAAAEbIZzO2LI88dyDKKXd4PcrF5pXq'
    RECAPTCHA_PUBLIC_KEY = '6LfelAIcAAAAABrcm4CwDKF-gnwwGS9IMwcrKXCP'
    UPLOAD_FOLDER = 'app/static/bootstrap-4.5.0-dist/images'
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=15)
    REMEMBER_COOKIE_DURATION = timedelta(minutes=15)
    REMEMBER_COOKIE_REFRESH_EACH_REQUEST = True
    # SESSION_COOKIE_NAME = "testePythonSessionJS"
    # SESSION_COOKIE_HTTPONLY = True 
    # SESSION_COOKIE_SAMESITE = 'Lax' 
    # SESSION_COOKIE_SECURE = True
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root@localhost:3306/tcc"
    # SQLALCHEMY_DATABASE_URI = "mysql+pymysql://tcc3:123@mudar*@192.168.0.12:3306/tcc"
    # SQLALCHEMY_DATABASE_URI = "mysql+pymysql://tcc2:123@mudar@192.168.0.7:3306/tcc?charset=utf8"
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_ECHO = False
    SECRET_KEY = "123@python+iot"

    MAIL_SERVER = "smtp-mail.outlook.com"
    MAIL_PORT = 587
    MAIL_USERNAME = 'matheusrodriguesh@hotmail.com'
    MAIL_PASSWORD = ''
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False

