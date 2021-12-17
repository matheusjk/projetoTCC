from app import login_user, render_template, redirect, url_for, login_required, current_user, request, logout_user, login_manager, Blueprint, flash, func, make_response, jsonify, pdfkit, datetime
from app.telemetria.forms import TelemetriaForm
from app.models.tables import Telemetria, db
import json


telemetria = Blueprint("telemetria", __name__, template_folder="templates", url_prefix="/telemetria")

linhas_por_pagina = 5

@telemetria.route("/listar", methods=['GET']) # , defaults={'pagina': 1})
# @telemetria.route("/listar/<int:pagina>", methods=["GET"])
@login_required
def listar():
    if current_user.tipoUsuario == 0:
        por_pagina = 5
        formTelemetria = TelemetriaForm()
        # telemetriaObj = Telemetria.query.order_by(Telemetria.id.asc()).paginate(pagina, por_pagina, error_out=False)
        telemetriaObj = Telemetria.query.all()  #.paginate(pagina, por_pagina, error_out=False)
        return render_template('telemetriaJSON.html', form=formTelemetria, telemetria=telemetriaObj)
    else:
        por_pagina = 5
        formTelemetriaComum = TelemetriaForm()
        # Telemetria.query.filter(func.json_contains(Telemetria.json['NOME'], current_user.nome) == 1).all()
        # print(Telemetria.query.filter(func.json_contains(Telemetria.json, "TESTE") == 1)) #.all())
        telemetriaObjComum = Telemetria.query.filter(func.json_extract(Telemetria.json, "$.IDUSUARIO") == current_user.id).all()   #.paginate(pagina, por_pagina, error_out=False)  
        # print(dir(telemetriaObjComum))
        # userObj = Usuario
        # for lin in telemetriaObjComum:
        #     if lin.json["IDUSUARIO"] == current_user.id:
        #         id_usuario = lin.json['IDUSUARIO']
        # print(telemetriaObjComum)
        return render_template('telemetriaJSON.html', form=formTelemetriaComum, telemetria=telemetriaObjComum)


@telemetria.route('/listarJson', methods=['GET'])
@login_required
def listarJson():
    # json.loads(Telemetria.query.all())
    objeto = Telemetria.query.filter(func.json_extract(Telemetria.json, "$.IDUSUARIO") == current_user.id).all()
    print(objeto)
    # lista = []
    for linha in objeto:
        dicionario = {
        "SENSORG":  linha.json["SENSORG"],
        "SENSORT":  linha.json["SENSORT"],
        "SENSORU":  linha.json["SENSORU"],
        "NOME":  linha.json["NOME"],
        "IDUSUARIO": linha.json["IDUSUARIO"]
        }
    #     lista.append(linha.json)
    return jsonify({"dados":  json.dumps(dicionario) })

@telemetria.route("/pdf", methods=["GET"])
@login_required
def pdf():
    if current_user.tipoUsuario == 0:
        try:
            # telemetriaObjComum = Telemetria.query.all()
            telemetriaObj = Telemetria.query.all() #.paginate(pagina, por_pagina, error_out=False)
            # print(telemetriaObjComum)
            # renderiza = render_template('telemetriaPdf.html', telemetria=telemetriaObjComum)
            # pdf = pdfkit.from_url(renderiza, False)
            
            renderiza = render_template('telemetriaPdf.html', telemetria=telemetriaObj, hora=datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
            options = {
                'page-size': 'Letter',
                'margin-top': '0.75in',
                'margin-right': '0.75in',
                'margin-bottom': '0.75in',
                'margin-left': '0.75in',
                'encoding': 'UTF-8'
            }
            pdf = pdfkit.from_string(renderiza, False, options=options)
            # for id, json, dataCriacao in telemetriaObj:
            #     '{} {} {} {} {} {}'.format(id, json["NOME"], json["SENSORG"], json["SENSORT"], json["SENSORU"]))

            response = make_response(pdf)
            response.headers['Content-Type'] = 'application/pdf'
            response.headers['Content-Disposition'] = 'attachment; filename=output.pdf'

            flash("Sucesso ao gerar o PDF!!!", category='info')
            return response
        except: 
            flash('Erro ao gerar o PDF!!!')
            return redirect(url_for('telemetria.listar'))
        return redirect(url_for('telemetria.listar'))
    else:
        try:
            telemetriaObjComum = Telemetria.query.filter(func.json_extract(Telemetria.json, "$.IDUSUARIO")).all()
            # telemetriaObjComum = Telemetria.query.all()    # .filter(func.json_extract(Telemetria.json, "$.IDUSUARIO")).paginate(pagina, por_pagina, error_out=False)
            # print(telemetriaObjComum)
            # renderiza = render_template('telemetriaPdf.html', telemetria=telemetriaObjComum)
            # pdf = pdfkit.from_url(renderiza, False)
            renderiza = render_template('telemetriaPdf.html', telemetria=telemetriaObjComum, hora=datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S") )
            options = {
                'page-size': 'Letter',
                'margin-top': '0.75in',
                'margin-right': '0.70in',
                'margin-bottom': '0.75in',
                'margin-left': '0.70in',
                'encoding': 'UTF-8'
            }
            pdf = pdfkit.from_string(renderiza, False, options=options)
            # for id, json, dataCriacao in telemetriaObj:
            #     '{} {} {} {} {} {}'.format(id, json["NOME"], json["SENSORG"], json["SENSORT"], json["SENSORU"]))

            response = make_response(pdf)
            response.headers['Content-Type'] = 'application/pdf'
            response.headers['Content-Disposition'] = 'attachment; filename=output.pdf'

            flash("Sucesso ao gerar o PDF!!!", category='info')
            return response
        except: 
            flash('Erro ao gerar o PDF!!!')
            return redirect(url_for('telemetria.listar'))
        return redirect(url_for('telemetria.listar'))


@telemetria.route("/registrarTelemetria", methods=["GET", "POST"])
@login_required
def registrarTelemetria():
    # d = 0
    # d = request.data
    print(request.get_json, request.data, request.host, request.json, request.content_type, request.content_length)
    # formTelemetria = TelemetriaForm()
    # if formTelemetria.validate_on_submit():
    # telemetriaObj = Telemetria(formTelemetria.json.data)
    # db.session.add(telemetriaObj)
    # db.session.commit()
    if request.method == "POST":
        db.session.add(request.json.get('groupName'))
        db.session.commit()
        print(request.json.get('groupName'))
    # flash("Telemtria inserida com sucesso!!!")
    # return redirect(url_for('.listar'))
    return "Telemtria inserida com sucesso!!!", 200



# @telemetria.route("/filtro", methods=['POST', 'GET'], defaults={'pagina': 1})
# @telemetria.route("/filtro/<int:pagina>", methods=["GET"])
# # @telemetria.route('/filtro', methods=['POST'])
# def listarFiltro(pagina):
#     por_pagina = 5
#     formTelemetria = TelemetriaForm()
#     if formTelemetria.validate_on_submit():
#         print(formTelemetria.dataInicio.data, formTelemetria.dataFim.data)
#         # x= [lin for lin in Telemetria.json]["dataCriacao"]
#         # for lin in Telemetria.query.all():
#         #     print(lin.json)
#         # print([json.loads(linha) for linha in Telemetria.json])
#         # telJ = Telemetria.query.all()
#         telemetriaQuery = Telemetria.query.filter(Telemetria.dataCriacao >= formTelemetria.dataInicio.data).filter(Telemetria.dataCriacao <= formTelemetria.dataFim.data).paginate(pagina, por_pagina, error_out=False)
#
#         # for linha in telemetriaQuery:
#         #     print(linha)
#
#         # if telemetriaQuery is None or len(telemetriaQuery) is None or len(telemetriaQuery) == 0:
#         #     flash('NENHUM REGISTRO ENCONTRADOS', "warning")
#         #     return redirect(url_for('telemetria.listar'))
#         # else:
#         flash('REGISTROS ENCONTRADOS', "info")
#         return render_template('telemetria.html', filtro=1, form=formTelemetria, telemetria=telemetriaQuery, telemetriaJSON=json)
#     else:
#         telemetriaQuery = Telemetria.query.filter(Telemetria.dataCriacao >= formTelemetria.dataInicio.data).filter(Telemetria.dataCriacao <= formTelemetria.dataFim.data).paginate(pagina, por_pagina, error_out=False)
#
#         flash('REGISTROS ENCONTRADOS 2 ', "info")
#         return render_template('telemetria.html', filtro=1, form=formTelemetria, telemetria=telemetriaQuery, telemetriaJSON=json)
#     # else:
#     #     flash("Erro ao fazer o filtro", "danger")
#     # return redirect(url_for('telemetria.listar'))


@telemetria.errorhandler(404)
def paginaNaoEncontrada(e):
    return render_template('error404.html')


@telemetria.route("/listarTesteJson", methods=['GET']) # , defaults={'pagina': 1})
# @telemetria.route("/listar/<int:pagina>", methods=["GET"])
@login_required
def listarTesteJson():
    if current_user.tipoUsuario == 0:
        # por_pagina = 5
        # formTelemetria = TelemetriaForm()
        # # telemetriaObj = Telemetria.query.order_by(Telemetria.id.asc()).paginate(pagina, por_pagina, error_out=False)
        # telemetriaObj = Telemetria.query.all()  #.paginate(pagina, por_pagina, error_out=False)
        # lista = []
        # for linha in telemetriaObj:
        #     lista.append({
        #         'id': linha.id,
        #         'json': linha.json,
        #         'dataCriacao': linha.dataCriacao
        #     })
        # jsonify(lista)
        return render_template('telemetriaJSON.html')
        # return render_template('telemetria.html', form=formTelemetria, telemetria=telemetriaObj)
    else:
        por_pagina = 5
        formTelemetriaComum = TelemetriaForm()
        # Telemetria.query.filter(func.json_contains(Telemetria.json['NOME'], current_user.nome) == 1).all()
        # print(Telemetria.query.filter(func.json_contains(Telemetria.json, "TESTE") == 1)) #.all())
        telemetriaObjComum = Telemetria.query.filter(func.json_extract(Telemetria.json, "$.IDUSUARIO") == current_user.id).all()   #.paginate(pagina, por_pagina, error_out=False)  
        # print(dir(telemetriaObjComum))
        # userObj = Usuario
        # for lin in telemetriaObjComum:
        #     if lin.json["IDUSUARIO"] == current_user.id:
        #         id_usuario = lin.json['IDUSUARIO']
        # print(telemetriaObjComum)
        return render_template('telemetriaJSON.html')


@telemetria.route("/listarTelemetriaJson", methods=['GET']) # , defaults={'pagina': 1})
# @telemetria.route("/listar/<int:pagina>", methods=["GET"])
@login_required
def listarTelemetriaJson():
    formTelemetria = TelemetriaForm()
    if current_user.tipoUsuario == 0:
        telemetriaObj = Telemetria.query.all()  #.paginate(pagina, por_pagina, error_out=False)
        lista = []
        for linha in telemetriaObj:
            lista.append({
                'id': linha.id,
                'IDUSUARIO': linha.json["IDUSUARIO"],
                'NOME': linha.json["NOME"],
                'SENSORG': linha.json["SENSORG"],
                'SENSORT': linha.json["SENSORT"],
                'SENSORU': linha.json["SENSORU"],
                'dataCriacao': linha.dataCriacao
            })
            # print(linha.dataCriacao)

        return  jsonify({"data": lista})
    else:
        telemetriaObj = Telemetria.query.filter(func.json_extract(Telemetria.json, "$.IDUSUARIO") == current_user.id).all()  #.paginate(pagina, por_pagina, error_out=False)
        lista = []
        for linha in telemetriaObj:
            lista.append({
                'id': linha.id,
                'IDUSUARIO': linha.json["IDUSUARIO"],
                'NOME': linha.json["NOME"],
                'SENSORG': linha.json["SENSORG"],
                'SENSORT': linha.json["SENSORT"],
                'SENSORU': linha.json["SENSORU"],
                'dataCriacao': linha.dataCriacao
            })
            # print(linha.dataCriacao)

        return  jsonify({"data": lista})





@telemetria.route("/listarTelemetriaJsonGraph", methods=['GET']) # , defaults={'pagina': 1})
# @telemetria.route("/listar/<int:pagina>", methods=["GET"])
@login_required
def listarTelemetriaJsonGraph():
    formTelemetria = TelemetriaForm()
    if current_user.tipoUsuario == 0:
        telemetriaObj = Telemetria.query.all()  #.paginate(pagina, por_pagina, error_out=False)
        lista = []
        for linha in telemetriaObj:
            lista.append({
                'id': linha.id,
                'IDUSUARIO': linha.json["IDUSUARIO"],
                'NOME': linha.json["NOME"],
                'SENSORG': linha.json["SENSORG"],
                'SENSORT': linha.json["SENSORT"],
                'SENSORU': linha.json["SENSORU"],
                'dataCriacao': linha.dataCriacao
            })
            # print(linha.dataCriacao)

        # return  jsonify({"data": lista})
        return  jsonify({
            "cols":[ {"id":"", "label": "NOME", "pattern": "", "type": "string"},
                     {"id":"", "label": "ID", "pattern": "", "type": "number"},
                     {"id":"", "label": "SENSOR GAS", "pattern": "", "type": "number"},
                     {"id":"", "label": "SENSOR TEMPERATURA", "pattern": "", "type": "number"},
                     {"id":"", "label": "SENSOR UMIDADE", "pattern": "", "type": "number"},
                     {"id":"", "label": "DATA CRIACAO", "pattern": "", "type": "datetime"}
            ] , 
            "rows":[
                {"c":[{"v": lista[0].get('id')}]},
                {"c":[{"v": lista[0].get('NOME')}]},
                {"c":[{"v": lista[0].get('SENSORG')}]},
                {"c":[{"v": lista[0].get('SENSORT')}]},
                {"c":[{"v": lista[0].get('SENSORU')}]},
                {"c":[{"v": lista[0].get('dataCriacao')}]}
                ]
            })

    else:
        telemetriaObj = Telemetria.query.filter(func.json_extract(Telemetria.json, "$.IDUSUARIO") == current_user.id).all()  #.paginate(pagina, por_pagina, error_out=False)
        lista = []
        for linha in telemetriaObj:
            lista.append({
                'id': linha.id,
                'IDUSUARIO': linha.json["IDUSUARIO"],
                'NOME': linha.json["NOME"],
                'SENSORG': linha.json["SENSORG"],
                'SENSORT': linha.json["SENSORT"],
                'SENSORU': linha.json["SENSORU"],
                'dataCriacao': linha.dataCriacao
            })
            # print(linha.dataCriacao)

        return  jsonify({
            "cols":[ {"id":"", "label": "ID", "pattern": "", "type": "number"}, 
                    #  {"id":"", "label": "NOME", "pattern": "", "type": "string"},
                    #  {"id":"", "label": "SENSOR GAS", "pattern": "", "type": "number"},
                    #  {"id":"", "label": "SENSOR TEMPERATURA", "pattern": "", "type": "number"},
                    #  {"id":"", "label": "SENSOR UMIDADE", "pattern": "", "type": "number"},
                    #  {"id":"", "label": "DATA CRIACAO", "pattern": "", "type": "datetime"}
            ] , 
            "rows":[{
                "c":[{"v": lista[0].get('id')}]
            }]
            })