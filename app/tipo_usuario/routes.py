from app import login_manager, login_user, login_required, current_user, logout_user, render_template, redirect, url_for, Blueprint, request, func, jsonify, csrf
from app.models.tables import TipoUsuario, db


tipo_usuario = Blueprint('tipo_usuario', __name__, template_folder='templates', url_prefix='/tipo_usuario')


@tipo_usuario.route('/listarTipoUsuarioJson', methods=['GET'])
@login_required
def listarTipoUsuarioJson():
    # if current_user.tipoUsuario == 0:
    tipo_usuario_obj = TipoUsuario.query.all()
    lista = []
    for linha in tipo_usuario_obj:
        lista.append({
            'id': linha.id,
            'tipoUsuario': linha.tipoUsuario,
            'dataCriacao': linha.dataCriacao,
            'dataAtualizacao': linha.dataAtualizacao
        })
    return jsonify({'data': lista})


@tipo_usuario.route("/registrarTipoUsuarioJson", methods=['POST'])
@login_required
def registrar():
    if request.method == "POST":
        tipo_usuario_obj = TipoUsuario(request.get_json()['tipoUsuario'])
        db.session.add(tipo_usuario_obj)
        db.session.commit()
    return jsonify({"mensagem": "TIPO USUARIO CADASTRADO COM SUCESSO"})
