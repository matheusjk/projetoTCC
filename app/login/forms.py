from flask_wtf import FlaskForm, RecaptchaField, Recaptcha
from wtforms import FileField, SubmitField, StringField, PasswordField, SelectField, BooleanField
from wtforms.fields.html5 import DateTimeLocalField, EmailField, IntegerField, TelField, DateField
from wtforms.validators import DataRequired, Length, URL, EqualTo, Email, ValidationError, Regexp
from app.models.tables import Usuarios, db


class Unique(object):
    def __init__(self, model, field, message):
        self.model = model
        self.field = field
        self.message = message

    def __call__(self, form, field):
        check = self.model.query.filter(self.field == field.data).first()
        if check:
            raise ValidationError(self.message)


class LoginForm(FlaskForm):
    email = EmailField("Email", validators=[Email(message="Não é um email valido"), DataRequired()])
    senha = PasswordField("Senha", validators=[DataRequired()])
    recaptcha = RecaptchaField(validators=[Recaptcha(message="Recaptcha necessario")])
    submit = SubmitField('Efetuar Login')


class CadastroUsuario(FlaskForm):
    
    # def __init__(self, *args, **kwargs):
    #     kwargs['csrf_enabled'] = True
    #     super(CadastroUsuario, self).__init__(*args, **kwargs)

    nome = StringField('Nome', validators=[DataRequired()])
    email = EmailField("Email", validators=[Email(message="Não é um email valido"), Unique(Usuarios, Usuarios.email, message="Esse email com conta de usuario ja existe"), DataRequired()])
    senha = PasswordField("Senha", validators=[DataRequired()])
    confirmarSenha = PasswordField('Repete Senha', validators=[DataRequired(message="Por favor insira a senha"),
                                                               EqualTo("senha", message="Senhas devem ser iguais"),
                                                               Length(min=5, max=30,
                                                                      message="Senha deve ter no minimo 5 caracteres")])
    sexo = StringField("Sexo", validators=[DataRequired()])
    cpf = StringField("CPF", validators=[DataRequired(), Regexp("^\d{3}\.\d{3}\.\d{3}\-\d{2}$", message="Por favor colocar no formato de CPF")])
    tel = TelField("Telefone", validators=[DataRequired()])
    dataNasc = DateField("Data Nascimento", validators=[DataRequired()])
    tipoUsuario = SelectField("Tipo Usuario", coerce=int,  choices=[("1", "ADMINISTRADOR"), ("2", "COMUM")], validate_choice=False)
    botaoVolta = SubmitField("Voltar")
    submit = SubmitField("Enviar")


class Usuario(FlaskForm):
    # id = IntegerField("id")
    nome = StringField('Nome', validators=[DataRequired()])
    email = EmailField("Email", validators=[Email(message="Não é um email valido"), DataRequired()])
    senha = PasswordField("Senha", validators=[DataRequired()])
    confirmarSenha = PasswordField('Repete Senha', validators=[DataRequired(message="Por favor insira a senha"),
                                                               EqualTo("senha", message="Senhas devem ser iguais"),
                                                               Length(min=5, max=30,
                                                                      message="Senha deve ter no minimo 5 caracteres")])
    submit = SubmitField('Enviar')


class Recuperar(FlaskForm):
    email = EmailField("Email", validators=[Email(message="Não é um email valido"), DataRequired()])
    recaptcha = RecaptchaField(validators=[Recaptcha(message="Recaptcha necessario")])
    botaoVolta = SubmitField("Voltar")
    submit = SubmitField("Enviar")


class EditarUsuario(FlaskForm):
    id = IntegerField("id")
    nome = StringField('Nome', validators=[DataRequired()])
    email = EmailField("Email", validators=[Email(message="Não é um email valido"), DataRequired()])
    sexo = StringField("Sexo", validators=[DataRequired()])
    cpf = StringField("CPF", validators=[DataRequired(), Regexp("^\d{3}\.\d{3}\.\d{3}\-\d{2}$", message="Por favor colocar no formato de CPF")])
    tel = TelField("Telefone", validators=[DataRequired()])
    tipoUsuario = SelectField("Tipo Usuario", coerce=int,  choices=[("0", "ADMINISTRADOR"), ("1", "COMUM")], validate_choice=False)
    dataNasc = DateField("Data Nascimento", validators=[DataRequired()])
    submit = SubmitField("Enviar")
