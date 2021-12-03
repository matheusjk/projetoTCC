from flask_wtf import FlaskForm
from wtforms import FileField, SubmitField, StringField, PasswordField, SelectField, BooleanField
from wtforms.fields.html5 import DateTimeLocalField, EmailField, IntegerField, TelField, DateField
from wtforms.validators import DataRequired, Length, URL, EqualTo, Email, ValidationError


class FormPessoa(FlaskForm):
    id = IntegerField("Id")
    nome = StringField("nome", validators=[DataRequired()])
    # idade = IntegerField("idade", validators=[DataRequired()])
    dataNasc = DateField("Data Nascimento", validators=[DataRequired()])
    sexo = SelectField("sexo", choices=[(1, "Masculino"), (0, "Feminino")], coerce=int, validators=[DataRequired()])
    cpf = StringField("cpf", validators=[DataRequired()])
    tel = TelField("Telefone", validators=[DataRequired()])
    # email = EmailField("email", validators=[Email(message="Não é um email valido"), DataRequired()])
    # senha = PasswordField("senha", validators=[DataRequired()])
    # confirmarSenha = PasswordField('Repete Senha', validators=[DataRequired(message="Por favor insira a senha"),
    #                                                            EqualTo("senha", message="Senhas devem ser iguais"),
    #                                                            Length(min=5, max=30,
    #                                                                   message="Senha deve ter no minimo 5 caracteres")])
    usuarioNome = SelectField("Nome Usuario", choices=[], coerce=int)
    submit = SubmitField("Enviar")
