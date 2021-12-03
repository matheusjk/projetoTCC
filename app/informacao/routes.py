from app import login_user, render_template, redirect, url_for, login_required, current_user, request, logout_user, login_manager, Blueprint, flash, func
from app.informacao.forms import FormInformacao
from app.models.tables import Informacao, Sensores, Local, Modulos, db

informacao = Blueprint("informacao", __name__, template_folder="templates", url_prefix="/informacao")


linhas_por_pagina = 5

@informacao.route("/listar", methods=['GET'], defaults={'pagina': 1})
@informacao.route("/listar/<int:pagina>", methods=["GET"])
@login_required
def listar(pagina):
    por_pagina = 5
    # localObj = Local.query.all()
    # print(localObj.usuarios)
    if current_user.tipoUsuario == 0:
        sensoresObj = Sensores.query.all()
        modulosObj = Modulos.query.all()
        localObj = Local.query.all()
        formInformacao = FormInformacao()
        formInformacao.sensores_id.choices = [(linhas.id, linhas.tipoSensor) for linhas in sensoresObj]
        x = [(linhas.id, linhas.endereco) for linhas in localObj]
        formInformacao.local_id.choices = x if len(x) > 0 else [("0", "NAO EXISTE LOCAL CADASTRADO P/ ESSE USUARIO")]
        y = [(linhas.id, linhas.json['MAC']) for linhas in modulosObj] 
        formInformacao.modulo_id.choices = y if len(y) > 0 else [("0", "NAO EXISTE MODULOS CADASTRADO P/ ESSE USUARIO")]
        informacaoObj = Informacao.query.order_by(Informacao.id.asc()).all()  #.paginate(pagina, por_pagina, error_out=False)
        return render_template('informacao.html', form=formInformacao, informacao=informacaoObj)
    else:
        sensoresObj = Sensores.query.all()
        modulosObj = Modulos.query.filter(func.json_extract(Modulos.json, "$.IDUSUARIO") == current_user.id).all()
        localObj = Local.query.filter_by(usuario_id=current_user.id).all()
        formInformacao = FormInformacao()
        formInformacao.sensores_id.choices = [(linhas.id, linhas.tipoSensor) for linhas in sensoresObj]
        x = [(linhas.id, linhas.endereco) for linhas in localObj]
        formInformacao.local_id.choices = x if len(x) > 0 else [("0", "NAO EXISTE LOCAL CADASTRADO P/ ESSE USUARIO")] 
        y = [(linhas.id, linhas.json['MAC']) for linhas in modulosObj]
        formInformacao.modulo_id.choices = y if len(y) > 0 else [("0", "NAO EXISTE MODULOS CADASTRADO P/ ESSE USUARIO")]
        x = [id.local.usuarios.id for id in Informacao.query.all()]
        # print(x[0])
        informacaoObj = Informacao.query.filter(x[0] == current_user.id).all()  #.paginate(pagina, por_pagina, error_out=False) # filter_by(id_local=current_user.id)
        # print(informacaoObj[0].local.usuarios.nome)
        return render_template('informacao.html', form=formInformacao, informacao=informacaoObj)


@informacao.route("/registrarInformacao", methods=['GET', 'POST'])
@login_required
def registrarInformacao():
    formInformacao = FormInformacao()
    print(type(formInformacao.sensores_id.data), formInformacao.modulo_id.data, formInformacao.local_id.data)
    if formInformacao.validate_on_submit():
        if formInformacao.local_id.data == 0 or formInformacao.modulo_id.data == 0 or formInformacao.sensores_id.data == 0:
            flash("Informacao nao pode ser adicionada!!!", category="danger")
            return redirect(url_for('informacao.listar'))
        else:
            informacaoObj = Informacao(formInformacao.sensores_id.data, formInformacao.modulo_id.data, formInformacao.local_id.data)
            db.session.add(informacaoObj)
            db.session.commit()
            flash("Informacao adicionada com sucesso!!!", category="success")
            return redirect(url_for('informacao.listar'))
    else:
        flash("Informacao nao pode ser adicionada!!!", category="danger")
        return redirect(url_for('informacao.listar'))


@informacao.route('/editarInformacao', methods=['POST'])
@login_required
def editar():
    formInfo = FormInformacao()
    print(formInfo.id.data, formInfo.sensores_id.data, formInfo.modulo_id.data, formInfo.local_id.data)
    # if formInformacao.validate_on_submit():
    informacaoObj = Informacao.query.get(formInfo.id.data)
    print(informacaoObj.id_sensores)
    informacaoObj.id_sensores = formInfo.sensores_id.data
    informacaoObj.id_modulo = formInfo.modulo_id.data
    informacaoObj.id_local = formInfo.local_id.data

    db.session.commit()
    flash("Informacao alterada com sucesso!!!", category='success')
    return redirect(url_for("informacao.listar"))


@informacao.route('/excluirInformacao/<int:id>', methods=["GET"])
@login_required
def excluirInformacao(id):
    infoObj = Informacao.query.get(id)
    db.session.delete(infoObj)
    db.session.commit()
    flash("Informacao deleteada com sucesso!!!", category="success")
    return redirect(url_for('informacao.listar'))
