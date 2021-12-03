from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField, TextAreaField, SelectField
from wtforms.fields.html5 import IntegerField, EmailField, TelField, DecimalField, URLField
from wtforms.validators import DataRequired, ValidationError, Email, Length, EqualTo, URL


class FormConfiguracao(FlaskForm):
    id = IntegerField('id')
    tempoTelemetria = DecimalField('Tempo Telemetria(Minutos)', validators=[DataRequired()])
    tempoGeolocalizacao = DecimalField('Tempo Geolocalizacao(Minutos)', validators=[DataRequired()])
    tempoSoneca = DecimalField('Tempo Soneca(Minutos)', validators=[DataRequired()])
    tempoThingSpeak = DecimalField('Tempo ThingSpeak(Minutos)', validators=[DataRequired()])

    urlIpApi = URLField('URL IPAPI', validators=[DataRequired()])
    urlThingSpeak = URLField('URL THINGSPEAK', validators=[DataRequired()])
    secretKeyThingSpeak = StringField('ThingSpeak KEY')
    resetarConfigsWifi = SelectField('RESETAR WIFI', coerce=int, choices=[("1", "SIM"), ("0", "NAO")])
    alertaEmail = SelectField("Alerta Email", coerce=int, choices=[("1", "SIM"), ("0", "NAO")])
    valorGasAviso = DecimalField('Valor Gas Alerta', validators=[DataRequired()])
    # tipoTempo = SelectField("Tipo Tempo", coerce=int, choices=[("60000", "MINUTOS"), ()])
    usuario_id = SelectField("Usuario", coerce=int, validate_choice=False)
    submit = SubmitField("Enviar")
