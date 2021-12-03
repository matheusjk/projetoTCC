from app import login_user, login_required, current_user, request, logout_user, \
    login_manager, Mail, Message, mail, generate_password_hash, session, datetime, jsonify
from flask import Blueprint, flash, render_template, redirect, url_for
# from flask_login import login_required
from app.login.forms import LoginForm, Usuario, CadastroUsuario, Recuperar, EditarUsuario
from app.models.tables import Usuarios, db
from app.pessoas.routes import pessoa
import random
import string

# from app.pessoas.routes import pessoa

form = Blueprint('form', __name__, template_folder='templates', url_prefix='/form')

login_manager.login_view = "form.index"
login_manager.login_message = "Por favor se autenticar antes de acessar o sistema!!!"
login_manager.login_message_category = "info"
login_manager.refresh_view = "form.index"
login_manager.needs_refresh_message = u"Para proteger sua conta, por favor reautentique para acessar a pagina"
login_manager.needs_refresh_message_category = "info"

# mail = Mail(form)


# @form.route("/", methods=["GET"])
# def index():
#     return render_template('login.html')

@form.route('/recuperar', methods=["GET", "POST"])
def recuperar():
    forms = Recuperar()
    if forms.validate_on_submit():
        print(forms.email.data)
        email = Usuarios.query.filter_by(email=forms.email.data).first()
        if email is not None:
            email.senha = "123@mudar"
            db.session.commit()
            print("EMAIL VINDO DO BANCO {}".format(email))
            msg = Message('Ola isso é um texte', sender='matheusrodriguesh@hotmail.com', recipients=[email.email])
            msg.body = "Sua senha foi resetada para 123@mudar para mudar clique no link http://127.0.0.1:58000/form/alterarSenha"
            mail.send(msg)
            flash('Email disparado com sucesso!!!', 'info')
            return redirect(url_for('form.index'))
        else:
            flash("Email não cadastrado na base de dados", "warning")
            return redirect(url_for('form.index'))
    return render_template("recuperar.html", form=forms)


@form.route('/alterarSenha', methods=["GET", "POST"])
def recuperarAlterar():
    formsAlterar = LoginForm()
    if formsAlterar.validate_on_submit():
        email = Usuarios.query.filter_by(email=formsAlterar.email.data).first()
        if email is not None:
            email.senha = generate_password_hash(formsAlterar.senha.data)
            db.session.commit()
            # print(email.senha, email, email.email, forms.senha.data)
            flash("Senha alterada com sucesso!!!", "success")
            return redirect(url_for('form.index'))
        else:
            flash("Erro ao alterar a senha", "warning")
            return redirect(url_for("form.index"))
    return render_template('recuperarAlterar.html', form=formsAlterar)


@form.route('/register', methods=["GET", "POST"])
def register():
    formRegistroPessoa = CadastroUsuario()
    print(formRegistroPessoa.nome.data, formRegistroPessoa.tipoUsuario.data)
    usuario = Usuarios.query.filter_by(tipoUsuario=0).all()

    # usuario = [user for user in usuario if user == 1 else user = 0]
    print(formRegistroPessoa.errors, usuario)
    if formRegistroPessoa.validate_on_submit():
        print(formRegistroPessoa.dataNasc.data, formRegistroPessoa.tipoUsuario.data)
        if len(usuario) > 0 or usuario:
            flash("Desculpe ja existe usuario administrador escolha tipo usuario COMUM", category='info')

        else:
            # if usuario == None or usuario == [] or usuario.tipoUsuario == 0:
            #     user = Usuarios(formRegistroPessoa.nome.data, formRegistroPessoa.email.data, formRegistroPessoa.senha.data, formRegistroPessoa.sexo.data, formRegistroPessoa.cpf.data, formRegistroPessoa.tel.data, formRegistroPessoa.dataNasc.data, formRegistroPessoa.tipoUsuario.data)
            #     print(user.nome)
            #     print(formRegistroPessoa.nome.data, formRegistroPessoa.tipoUsuario.data)
            #     db.session.add(user)
            #     db.session.commit()
            #     flash("Usuario cadastrado com sucesso!!!", "success")
            #     return redirect(url_for('form.index'))
            # elif usuario.tipoUsuario == formRegistroPessoa.tipoUsuario.data:
            #     flash("Desculpe mas ja temos um usuario ADMINISTRADOR cadastrado!!!", "info")
            #     return redirect(url_for('form.register'))
            # else:
            user = Usuarios(formRegistroPessoa.nome.data, formRegistroPessoa.email.data, formRegistroPessoa.senha.data, formRegistroPessoa.sexo.data, formRegistroPessoa.cpf.data, formRegistroPessoa.tel.data, formRegistroPessoa.dataNasc.data, formRegistroPessoa.tipoUsuario.data)
            print(user.nome)
            print(formRegistroPessoa.nome.data)
            db.session.add(user)
            db.session.commit()
            flash("Usuario cadastrado com sucesso!!!", "success")
            return redirect(url_for('form.index'))
    return render_template('register.html', form=formRegistroPessoa)


@form.route('/login', methods=["GET", "POST"])
def index():
    forms = LoginForm()
    if forms.validate_on_submit():
        print(forms.email.data, forms.senha.data)
        user = Usuarios.query.filter_by(email=forms.email.data).first()
        print(user, type(user), dir(user))
        if user is None:
            flash("Verifique email ou senha!!!", 'danger')
            return redirect(url_for('form.index'))
        elif user.nome == "admin" and user.tipoUsuario == 0:
            print(user.nome)
            login_user(user, remember=True)
            return redirect(url_for('form.listarBemVindo'))

        elif user is None or not user.verifica_senha(forms.senha.data):
            flash("Verifique email ou senha!!!", 'danger')
            return redirect(url_for('form.index'))

        print(user.nome)
        login_user(user, remember=True)
        return redirect(url_for('form.listarBemVindo'))
    else:
        print(forms.errors)
    return render_template('login.html', form=forms)


@form.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('form.index'))


@form.app_template_filter('strftime')
def formataDataTemplate(date, fmt='%d/%m/%Y %H:%M:%S'):
    return date.strftime(fmt)


@form.route('/listarUsuarios', methods=["GET", "POST"])
@login_required
def listar():
    # forms = CadastroUsuario()
    formsLista = EditarUsuario()
    if current_user.is_authenticated:
        if current_user.tipoUsuario == 0:
            user = Usuarios.query.all()
            print(user[0].dataCriacao)
            return render_template('usuariosBlue.html', user=user, form=formsLista) #, name=current_user)
        else:
            user = Usuarios.query.filter_by(nome=current_user.nome).all()
            print(user[0].dataCriacao)
            return render_template('usuariosBlue.html', user=user, form=formsLista) #, name=current_user)
    return redirect(url_for('logout'))

@form.route('/editarUsuario', methods=["POST"])
@login_required
def editar():
    formsEditar = EditarUsuario()
    # if formsEditar.is_submitted():
    #     print(formsEditar.nome.data, formsEditar.tipoUsuario.data, formsEditar.errors)
    print(formsEditar.nome.data, formsEditar.tipoUsuario.data, formsEditar.tel.data)
    if formsEditar.validate_on_submit():
        usuarioObj = Usuarios.query.filter_by(tipoUsuario=formsEditar.tipoUsuario.data).first()
        print(usuarioObj.tipoUsuario)
        # usuarioObj = Usuarios.query.get(form.id.data)
        # [lin for lin in usuarioGeral if lin.tipoUsuario == ]
        if current_user.tipoUsuario == 1:
            if usuarioObj.tipoUsuario == 0:
                flash("Desculpe esse sistema permite somente um usuario ADMINISTRADOR", category="info")
                return redirect(url_for("form.listar"))
            elif usuarioObj.tipoUsuario == 1:
                usuarioObj = Usuarios.query.get(form.id.data)
                # usuarioObj.get(formsEditar.id.data)
                usuarioObj.nome = formsEditar.nome.data
                usuarioObj.senha = usuarioObj.senha
                usuarioObj.email = formsEditar.email.data
                usuarioObj.sexo = formsEditar.sexo.data
                usuarioObj.dataNasc = formsEditar.dataNasc.data
                usuarioObj.tel = formsEditar.tel.data
                usuarioObj.cpf = formsEditar.cpf.data
                usuarioObj.idade = usuarioObj.idade
                usuarioObj.tipoUsuario = formsEditar.tipoUsuario.data
                print(usuarioObj.idade, usuarioObj.dataNasc)
                # usuarioObj. = form..data
               
                db.session.commit()
                flash("Usuario alterado com sucesso!!!", category="success")
                return redirect(url_for("form.listar"))
                # flash("Usuario alterado com sucesso!!!", category="success")
        elif current_user.tipoUsuario == 0:
                usuarioObj = Usuarios.query.get(formsEditar.id.data)
                # usuarioObj.get(formsEditar.id.data)
                usuarioObj.nome = formsEditar.nome.data
                usuarioObj.senha = usuarioObj.senha
                usuarioObj.email = formsEditar.email.data
                usuarioObj.sexo = formsEditar.sexo.data
                usuarioObj.dataNasc = formsEditar.dataNasc.data
                usuarioObj.tel = formsEditar.tel.data
                usuarioObj.cpf = formsEditar.cpf.data
                usuarioObj.idade = usuarioObj.calculaIdade()
                usuarioObj.tipoUsuario = formsEditar.tipoUsuario.data
                print(usuarioObj.idade, usuarioObj.dataNasc)
                # usuarioObj. = form..data

                print("ANTES DE ALTERAR IDADE {}".format(usuarioObj.idade))
                db.session.commit()
                flash("Usuario alterado com sucesso!!!", category="success")
                return redirect(url_for("form.listar"))
                # flash("Usuario alterado com sucesso!!!", category="success")

    return redirect(url_for("form.listar"))

@form.route('/insereFormulario', methods=["GET", "POST"])
def insereFormulario():
    formUser = Usuario()
    return render_template('usuariosInsereBlue.html', f=formUser)


@form.route('/inserir', methods=["GET", "POST"])
@login_required
def insert():
    forms = Usuario()
    print(forms.nome.data)
    # if forms.validate_on_submit():
    user = Usuarios(forms.nome.data, forms.email.data, forms.senha.data)
    db.session.add(user)
    db.session.commit()
    flash("Usuario cadastrado com sucesso!!!", "success")
    # return redirect(url_for('listar'))
    return redirect(url_for('form.listar'))


@form.route('/formulario/<int:id>', methods=["GET"])
@login_required
def formulario(id):
    usuarioObj = Usuarios.query.get(id)
    if usuarioObj.tipoUsuario == 0:
        user = False
    else:
        user = True
    return jsonify({"dadosTipoUsuario": user})


@form.route('/listarBemVindo', methods=['GET'])
@login_required
def listarBemVindo():
    return render_template('bemvindo.html')

# @form.after_request
# def cookies():
    
#     same_cookie = session