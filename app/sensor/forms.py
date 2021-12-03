from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField, TextAreaField
from wtforms.fields.html5 import IntegerField, EmailField, TelField
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms.validators import DataRequired, ValidationError, Length, EqualTo

class FormSensor(FlaskForm):
    id = IntegerField('id')
    tipoSensor = StringField("Nome", validators=[DataRequired(), Length(min=3, max=15)])
    descritivo = StringField('Descritivo', validators=[DataRequired()])
    # fotoSensor = FileField("Foto Sensor")
    submit = SubmitField("Enviar")
