from flask import Response
from app import login_user, render_template, redirect, url_for, login_required, current_user, request, logout_user, login_manager, Blueprint, flash, func, jsonify
from app.informacao.forms import FormInformacao
from app.models.tables import Informacao, Sensores, Local, Modulos, db
import json
import pprint

informacao = Blueprint("informacao", __name__, template_folder="templates", url_prefix="/informacao")


linhas_por_pagina = 5

# @informacao.route("/listar", methods=['GET'], defaults={'pagina': 1})
# @informacao.route("/listar/<int:pagina>", methods=["GET"])
# @login_required
# def listar(pagina):
#     por_pagina = 5
#     # localObj = Local.query.all()
#     # print(localObj.usuarios)
#     if current_user.tipoUsuario == 0:
#         sensoresObj = Sensores.query.all()
#         modulosObj = Modulos.query.all()
#         localObj = Local.query.all()
#         formInformacao = FormInformacao()
#         formInformacao.sensores_id.choices = [(linhas.id, linhas.tipoSensor) for linhas in sensoresObj]
#         x = [(linhas.id, linhas.endereco) for linhas in localObj]
#         formInformacao.local_id.choices = x if len(x) > 0 else [("0", "NAO EXISTE LOCAL CADASTRADO P/ ESSE USUARIO")]
#         y = [(linhas.id, linhas.json['MAC']) for linhas in modulosObj] 
#         formInformacao.modulo_id.choices = y if len(y) > 0 else [("0", "NAO EXISTE MODULOS CADASTRADO P/ ESSE USUARIO")]
#         informacaoObj = Informacao.query.order_by(Informacao.id.asc()).all()  #.paginate(pagina, por_pagina, error_out=False)
#         return render_template('informacao.html', form=formInformacao, informacao=informacaoObj)
#     else:
#         sensoresObj = Sensores.query.all()
#         modulosObj = Modulos.query.filter(func.json_extract(Modulos.json, "$.IDUSUARIO") == current_user.id).all()
#         localObj = Local.query.filter_by(usuario_id=current_user.id).all()
#         formInformacao = FormInformacao()
#         formInformacao.sensores_id.choices = [(linhas.id, linhas.tipoSensor) for linhas in sensoresObj]
#         x = [(linhas.id, linhas.endereco) for linhas in localObj]
#         formInformacao.local_id.choices = x if len(x) > 0 else [("0", "NAO EXISTE LOCAL CADASTRADO P/ ESSE USUARIO")] 
#         y = [(linhas.id, linhas.json['MAC']) for linhas in modulosObj]
#         formInformacao.modulo_id.choices = y if len(y) > 0 else [("0", "NAO EXISTE MODULOS CADASTRADO P/ ESSE USUARIO")]
#         x = [id.local.usuarios.id for id in Informacao.query.all()]
#         # print(x[0])
#         informacaoObj = Informacao.query.filter(x[0] == current_user.id).all()  #.paginate(pagina, por_pagina, error_out=False) # filter_by(id_local=current_user.id)
#         # print(informacaoObj[0].local.usuarios.nome)
#         return render_template('informacao.html', form=formInformacao, informacao=informacaoObj)


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


################################################################################


@informacao.route("/insereInfoJson", methods=['POST'])
@login_required
def insereInfoJson():
    if request.method == "POST":
        informacaoObj = Informacao(request.get_json()["id_sensores"], request.get_json()["id_modulos"], request.get_json()["id_local"])
        pprint.pprint(informacaoObj)
        db.session.add(informacaoObj)
        db.session.commit()
        return jsonify({'data': 'OK'})
    

@informacao.route("/listar", methods=["GET"])
@login_required
def listar():
   
    if current_user.tipoUsuario == 0:
        sensoresObj = Sensores.query.all()
        modulosObj = Modulos.query.all()
        localObj = Local.query.all()
        
        return render_template('informacao.html')
    else:
        sensoresObj = Sensores.query.all()
        modulosObj = Modulos.query.filter(func.json_extract(Modulos.json, "$.IDUSUARIO") == current_user.id).all()
        localObj = Local.query.filter_by(usuario_id=current_user.id).all()
       
        return render_template('informacao.html')



@informacao.route("/listarInfoJson/", methods=["GET"])
@login_required
def listarInfoJson():
    if current_user.tipoUsuario == 1:
        sensoresObj = [sensor for sensor in Sensores.query.all()]
        modulosObj = [modulos for modulos in Modulos.query.all()]
        localObj = [local for local in Local.query.all()]
        # informacaoObj = [i for i in Informacao.query.order_by(Informacao.id.asc()).all()] 

        # lista = [{
        #     'id': [i.id for i in informacaoObj],
        #     'id_sensores': [s.id_sensores for s in informacaoObj],
        #     'id_modulos': [m.id_modulos for m in informacaoObj],
        #     'id_local': [l.id_local for l in informacaoObj],
        # }]

        informacaoObj = Informacao.query.order_by(Informacao.id.asc()).all()
        lista = []
        
        # print(informacaoObj[2].sensores.tipoSensor)
        for linha in informacaoObj:
            # print(linha.sensores.tipoSensor)
            # print(linha.local.endereco)
            lista.append({
                'id': linha.id,
                'nome_sensores': linha.sensores.tipoSensor,
                'id_sensores': linha.sensores.id,
                'nome_modulos': linha.modulos.json['MAC'],
                'id_modulos': linha.id_modulos,
                'nome_local': linha.local.endereco if linha.local is not None else "NULL",
                'nome_local_usuarios': linha.local.usuarios.nome if linha.local is not None else "NULL",
                'id_local': linha.local.id if linha.local is not None else "NULL",
                'dataCriacao': linha.dataCriacao
            })
        
        listaA = [{
            'sensores': [(s.id, s.tipoSensor) for s in sensoresObj] ,
            'modulos': [(m.id, m.json['MAC']) for m in modulosObj] ,
            'local': [(l.id, l.endereco, l.usuarios.nome) for l in localObj]
        }]
        # pp = pprint.PrettyPrinter(deth=6)
        # pprint.pprint(lista)
        print(listaA[0].get('sensores'))
        if lista is None and listaA[0].get('sensores') == [] or listaA[0].get('local') == [] or listaA[0].get('modulos') == []:
            return Response("NENHUM DADO ENCONTRADO", 404)
        else:
            return jsonify({'data': lista, 'dados': listaA})
    elif current_user.tipoUsuario == 2:
        sensoresObj = Sensores.query.all()
        modulosObj = Modulos.query.filter(func.json_extract(Modulos.json, "$.IDUSUARIO") == current_user.id).all()
        localObj = Local.query.filter_by(usuario_id=current_user.id).all()
        infoUser = Informacao.query.all() 
        informacaoObj = []
        for lin in infoUser:
            print((lin.local.usuarios.id, lin.local.usuarios.nome))
            if current_user.id == lin.local.usuarios.id:
                informacaoObj.append({
                    'id': lin.id,
                    'nome_sensores': lin.sensores.tipoSensor,
                    'id_sensores': lin.sensores.id,
                    'nome_modulos': lin.modulos.json['MAC'],
                    'id_modulos': lin.id_modulos,
                    'nome_local': lin.local.endereco,
                    'nome_local_usuarios': lin.local.usuarios.nome,
                    'id_local': lin.local.id,
                    'dataCriacao': lin.dataCriacao
                })

        # print(infoUser)
        # return infoUser
        
        # informacaoObj = Informacao.query.filter(current_user.id).all()  #.paginate(pagina, por_pagina, error_out=False) # filter_by(id_local=current_user.id)
        
        # for linha in informacaoObj:
        #     lista.append({
        #         'id': linha.id,
        #         'nome_sensores': linha.sensores.tipoSensor,
        #         'id_sensores': linha.sensores.id,
        #         'nome_modulos': linha.modulos.json['MAC'],
        #         'id_modulos': linha.id_modulos,
        #         'nome_local': linha.local.endereco,
        #         'nome_local_usuarios': linha.local.usuarios.nome,
        #         'id_local': linha.local.id,
        #         'dataCriacao': linha.dataCriacao
        #     })
        
        listaA = [{
            'sensores': [(s.id, s.tipoSensor) for s in sensoresObj] ,
            'modulos': [(m.id, m.json['MAC']) for m in modulosObj] ,
            'local': [(l.id, l.endereco) for l in localObj]
        }]

        if lista is None and listaA[0].get('sensores') == [] or listaA[0].get('local') == [] or listaA[0].get('modulos') == []:
            return Response("NENHUM DADO ENCONTRADO", 404)
        else:
            return jsonify({'data': informacaoObj, 'dados': listaA})



@informacao.route('/editarPesquisarInformacaoJson/<int:id>', methods=['GET'])
@login_required
def editarPesquisarInformacaoJson(id):
    if current_user.tipoUsuario == 0:
        # sensoresObj = [sensor for sensor in Sensores.query.all()]
        # modulosObj = Modulos.query.filter(func.json_extract(Modulos.json, "$.IDUSUARIO") == current_user.id).all()
        # localObj = Local.query.filter_by(usuario_id=current_user.id).first()
        # linha = Informacao.query.filter_by(id=id).first()

        informacaoObj = Informacao.query.order_by(Informacao.id.asc()).all()
        lista = []
        for linha in informacaoObj:
            if linha.id == id:
                lista.append({
                    'id': linha.id,
                    'nome_sensores': linha.sensores.tipoSensor,
                    'id_sensores': linha.sensores.id,
                    'nome_modulos': linha.modulos.json['MAC'],
                    'id_modulos': linha.id_modulos,
                    'nome_local': linha.local.endereco,
                    'nome_local_usuarios': linha.local.usuarios.nome,
                    'id_local': linha.local.id,
                    'dataCriacao': linha.dataCriacao
                })

        return jsonify({'data': lista})
    elif current_user.tipoUsuario == 1:
        # sensoresObj = [sensor for sensor in Sensores.query.all()]
        modulosObj = Modulos.query.filter(func.json_extract(Modulos.json, "$.IDUSUARIO") == current_user.id).all()
        localObj = Local.query.filter_by(usuario_id=current_user.id).first()
        linha = Informacao.query.filter_by(id=id).first()

        lista = {
            'id': linha.id,
            'id_sensores': linha.id_sensores,
            'id_modulos': linha.id_modulos,
            'id_local': linha.id_local,
            # 'sensores': sensoresObj,
            'modulos': modulosObj,
            'local': localObj
        }

        return jsonify({'data': lista})


@informacao.route('/editarInformacaoJson', methods=['PUT'])
@login_required
def editarInformacaoJson():
    infoObj = Informacao.query.get(request.get_json()["id"])
    infoObj.id_sensores = request.get_json()["id_sensores"]
    infoObj.id_local = request.get_json()["id_local"]
    infoObj.id_modulos = request.get_json()["id_modulos"]
    # infoObj.bairro = request.get_json()["bairro"]
    
    db.session.commit()
    return jsonify({"data": 'ALTERADO COM SUCESSO!!!'})


@informacao.route('/excluirInformacaoJson/<int:id>', methods=["DELETE"])
@login_required
def excluirInformacaoJson(id):
    infoObj = Informacao.query.get(id)
    db.session.delete(infoObj)
    db.session.commit()
    # flash("Informacao deleteada com sucesso!!!", category="success")
    return jsonify({'data': "Informacao deleteada com sucesso!!!"})
