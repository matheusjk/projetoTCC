from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField, TextAreaField, SelectField
from wtforms.fields.html5 import IntegerField, EmailField, TelField
from wtforms.validators import DataRequired, ValidationError, Email, Length, EqualTo

class FormLocal(FlaskForm):
    id = IntegerField('id')
    cep = StringField("CEP", validators=[DataRequired()])
    endereco = StringField("Endereco", validators=[DataRequired()])
    cidade = StringField("Cidade", validators=[DataRequired()])
    bairro = StringField("Bairro", validators=[DataRequired()])
    estado = StringField("Estado", validators=[DataRequired()])
    obs = StringField("Obs")
    usuario_id = SelectField("Usuario", coerce=int, validate_choice=False)
    submit = SubmitField("Enviar")
