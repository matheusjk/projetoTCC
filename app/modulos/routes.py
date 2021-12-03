from app import login_manager, login_user, login_required, current_user, logout_user, render_template, redirect, url_for, flash, Blueprint, request, func, jsonify
from app.models.tables import Modulos, Telemetria, Geolocalizacao, Configuracao, db


modulo = Blueprint('modulo', __name__, template_folder='templates', url_prefix='/modulo')

linhas_por_pagina = 5

@modulo.route('/listarModulo', methods=['GET'], defaults={'pagina': 1})
@modulo.route('/listarModulo/<int:pagina>', methods=['GET'])
@login_required
def listar(pagina):
    por_pagina = 5
    if current_user.tipoUsuario == 0:  # current_user.nome == "Admin" or
        moduloObj = Modulos.query.all()  #paginate(pagina, por_pagina, error_out=False)  #filter(func.json_extract(Modulos.json, '$.IDUSUARIO'))
        print(moduloObj)
        return render_template('modulo.html', modulos=moduloObj)
    else:
        moduloObjComum = Modulos.query.filter(func.json_extract(Modulos.json, '$.IDUSUARIO') == current_user.id).all()  # paginate(pagina, por_pagina, error_out=False)
        print(moduloObjComum)
        return render_template('modulo.html', modulos=moduloObjComum)




@modulo.route('/listarModuloJson', methods=['GET'])
@login_required
def listarModuloJson():
    if current_user.tipoUsuario == 0:  # current_user.nome == "Admin" or
        moduloObj = Modulos.query.all()  #paginate(pagina, por_pagina, error_out=False)  #filter(func.json_extract(Modulos.json, '$.IDUSUARIO'))
        print(moduloObj)
        lista = []
        for linha in moduloObj:
            lista.append({
                "id": linha.id,
                "MAC": linha.json["MAC"],
                "IP_INTERNO": linha.json["IP_INTERNO"],
                "query": linha.json["query"],
                "region": linha.json["region"],
                "city": linha.json["city"],
                "NOME": linha.json["NOME"],
                "IDUSUARIO": linha.json["IDUSUARIO"],
                "dataCriacao": linha.dataCriacao
            })
        return jsonify({'data': lista})
    else:
        moduloObjComum = Modulos.query.filter(func.json_extract(Modulos.json, '$.IDUSUARIO') == current_user.id).all()  # paginate(pagina, por_pagina, error_out=False)
        print(moduloObjComum)
        lista = []
        for linha in moduloObjComum:
            lista.append({
                "id": linha.id,
                "MAC": linha.json["MAC"],
                "IP_INTERNO": linha.json["IP_INTERNO"],
                "query": linha.json["query"],
                "region": linha.json["region"],
                "city": linha.json["city"],
                "NOME": linha.json["NOME"],
                "IDUSUARIO": linha.json["IDUSUARIO"],
                "dataCriacao": linha.dataCriacao
            })
        return jsonify({'data': lista})

# @modulo.route('/registrarLocal', methods=['GET', 'POST'])
# @login_required
# def registrarModulo():
#     formModulos = FormModulos()
#
#     print(formModulos.mac.)
