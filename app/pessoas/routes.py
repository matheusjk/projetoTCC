from app import login_user, render_template, redirect, url_for, login_required, current_user, request, logout_user, \
    login_manager
from flask import Blueprint, flash, render_template, redirect
from app.pessoas.forms import FormPessoa
from app.models.tables import Usuarios, Sensores, db
import requests, json

pessoa = Blueprint('pessoa', __name__, template_folder='templates', url_prefix='/pessoas')


@pessoa.route('/listarPessoas', methods=["GET"])
def listar():
    formPessoa = FormPessoa()
    formPessoa.usuarioNome.choices = [(user.id, user.nome) for user in User.query.all()]
    # if(formPessoa.sexo == "1")
    #     formPessoa.sexo.
    pessoaObj = Pessoa.query.all()
    userObj = User.query.all()
    # for linhas in userObj:
    #     print("{} |".format(linhas.pessoa.nome))

    # for lin in pessoaObj:
    #     print("{}".format(lin))

    # Pessoa.query.join().
    return render_template('pessoas.html', pessoa=pessoaObj, form=formPessoa)


@pessoa.route('/registrarPessoa', methods=["GET", "POST"])
def registrarPessoa():
    formPessoa = FormPessoa()
    formPessoa.usuarioNome.choices = [(user.id, user.nome) for user in User.query.all()]
    userObj = User.query.all()
    for linhas in userObj:
        print("{}".format(linhas.pessoa))
    if formPessoa.validate_on_submit():
        pessoaObj = Pessoa(formPessoa.nome.data, formPessoa.dataNasc.data, formPessoa.sexo.data, formPessoa.cpf.data,
                           formPessoa.tel.data, formPessoa.usuarioNome.data)
        db.session.add(pessoaObj)
        db.session.commit()
        flash("Pessoa cadastrada com sucesso!!!", "success")
    #     return redirect(url_for('.listar'))
    return redirect(url_for('.listar'))
    # return redirect(url_for('.listar'))


@pessoa.route("/listarBatalhao", methods=["GET"])
def listarBatalhao():
    r = requests.get("https://pgeo3.rio.rj.gov.br/arcgis/rest/services/Basicos/mapa_basico_UTM/MapServer/6/query?where=1%3D1&outFields=*&outSR=4326&f=json")
    # print(r.json())
    pega = r.json()
    # print(pega.get('features'))
    # print(pega.find("Nome"))
    # textJson = json.loads(r.text)
    # print(textJson)
    for linhas in pega.get('features'):
        # print(json.loads(linhas))
        print(linhas.get("attributes"))
    return render_template("testeRequestBombeiros.html", jsonText=r.json())