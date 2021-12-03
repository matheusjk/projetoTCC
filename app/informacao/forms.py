from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField, TextAreaField, SelectField
from wtforms.fields.html5 import IntegerField, EmailField, TelField
from wtforms.validators import DataRequired, ValidationError, Email, Length, EqualTo


class FormInformacao(FlaskForm):
    id = IntegerField("id")
    sensores_id = SelectField("Sensores",  coerce=int, validate_choice=False)
    local_id = SelectField("Local",  coerce=int, validate_choice=False)
    modulo_id = SelectField("Modulo", coerce=int, validate_choice=False)
    submit = SubmitField("Enviar")
