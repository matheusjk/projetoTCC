from app import login_manager, login_user, login_required, current_user, logout_user, render_template, redirect, url_for, flash, Blueprint, request, func, jsonify
from app.models.tables import ConfiguracaoJson, Usuarios, db
from app.config.forms import FormConfiguracao
import json
# from io import StringIO


config = Blueprint('config',  __name__, template_folder="templates", url_prefix='/config')


linhas_por_pagina = 5

@config.route('listarConfiguracoes',  methods=['GET'], defaults={'pagina': 1})
@config.route('/listarConfiguracoes/<int:pagina>', methods=['GET'])
@login_required
def listar(pagina):
    por_pagina = 5
    formConfig = FormConfiguracao()
    if current_user.tipoUsuario == 0:  # current_user.nome == "Admin" or
        configObj = ConfiguracaoJson.query.all()  #.paginate(pagina, por_pagina, error_out=False)  # filter_by(usuario_id=current_user.id) order_by(Configuracao.id.asc()).paginate(pagina, por_pagina, error_out=False)
        usuarioObj = Usuarios.query.all()
        formConfig.usuario_id.choices = [(linhas.id, linhas.nome) for linhas in usuarioObj]
        # resetarConfigsWifi = [linhas.resetar_configs_wifi for linhas in configObj]
        # alertaEmail =  [linhas.alerta_email for linhas in configObj]
        # print(resetarConfigsWifi, alertaEmail)
        # if resetarConfigsWifi == [1]:
        #     formConfig.resetarConfigsWifi.data = 1
        # elif resetarConfigsWifi == [0]:
        #     formConfig.resetarConfigsWifi.data = 0
       
        # if alertaEmail == [1]:
        #     formConfig.alertaEmail.data = 1
        # elif alertaEmail == [0]:
        #     formConfig.alertaEmail.data = 0
        # formConfig.resetarConfigsWifi.process()
        # formConfig.resetarConfigsWifi.
        return render_template('configuracao.html', config=configObj, form=formConfig)
    else:
        usuarioObjComum = Usuarios.query.filter_by(nome=current_user.nome).first()
        configObj = ConfiguracaoJson.query.filter_by(usuarioId=current_user.id).all()  # .paginate(pagina, por_pagina, error_out=False)  #filter_by(usuario_id=current_user.id).paginate(pagina, por_pagina, error_out=False)
        formConfig.usuario_id.choices = [(usuarioObjComum.id, usuarioObjComum.nome)]
        return render_template('configuracao.html', config=configObj, form=formConfig)


@config.route("/registrarConfiguracoes", methods=["GET", "POST"])
@login_required
def registrarConfiguracoes():
    form = FormConfiguracao()
    # print(formConfig.tempoTelemetria.data, formConfig.tempoGeolocalizacao.data, formConfig.tempoSoneca.data, formConfig.usuario_id.data)
    # print(form.tempoTelemetria.data)
    if request.method == "POST":
        print(request.get_json(), request.data, request.args.get('tempoTel'))
        # return "TUDO CERTO AQUI"

    # if form.validate_on_submit():
    #     # formrequest.form.to_dict(flat=False)
    #     # print(form.tempoGeolocalizacao.data)
    #     y = form.tempoGeolocalizacao.data
    #     # x = jsonify({'tempo_executa_geolocalizacao': '{}', 'tempo_executa_telemetria': '{}', 'tempo_executa_soneca': '{}', 'tempo_executa_thingspeak': '{}', 'url_thingspeak': '{}', 'url_ip_api': '{}', 'secret_key_thingspeak': '{}', 'resetar_configs_wifi': '{}',  'alerta_email': '{}', 'valor_gas_aviso': '{}'.format(float(form.tempoTelemetria.data),  form.tempoGeolocalizacao.data, form.tempoSoneca.data, form.tempoThingSpeak.data, form.urlThingSpeak.data, form.urlIpApi.data, form.secretKeyThingSpeak.data, form.resetarConfigsWifi.data, form.alertaEmail.data, form.valorGasAviso.data)})
    #     # x = json.dumps({'tempo_executa_geolocalizacao': str(form.tempoGeolocalizacao.data), 'tempo_executa_telemetria': str(form.tempoTelemetria.data), 'tempo_executa_soneca': str(form.tempoSoneca.data), 'tempo_executa_thingspeak': str(form.tempoThingSpeak.data), 'url_thingspeak': str(form.urlThingSpeak.data), 'url_ip_api': str(form.urlIpApi.data), 'secret_key_thingspeak': str(form.secretKeyThingSpeak.data), 'resetar_configs_wifi': str(form.resetarConfigsWifi.data),  'alerta_email': str(form.alertaEmail.data), 'valor_gas_aviso': str(form.valorGasAviso.data)}, sort_keys=True)
    #     # io = StringIO() #, 'tempo_executa_telemetria': form.tempoTelemetria.data, 'tempo_executa_soneca': form.tempoSoneca.data, 'tempo_executa_thingspeak': form.tempoThingSpeak.data, 'url_thingspeak': form.urlThingSpeak.data, 'url_ip_api': form.urlIpApi.data, 'secret_key_thingspeak': form.secretKeyThingSpeak.data, 'resetar_configs_wifi': form.resetarConfigsWifi.data,  'alerta_email': form.alertaEmail.data, 'valor_gas_aviso': form.valorGasAviso.data
    #     # x = json.loads(json.dumps({'tempo_executa_geolocalizacao': str(form.tempoGeolocalizacao.data), 'tempo_executa_telemetria': str(form.tempoTelemetria.data), 'tempo_executa_soneca': str(form.tempoSoneca.data), 'tempo_executa_thingspeak': str(form.tempoThingSpeak.data), 'url_thingspeak': str(form.urlThingSpeak.data), 'url_ip_api': str(form.urlIpApi.data), 'secret_key_thingspeak': str(form.secretKeyThingSpeak.data), 'resetar_configs_wifi': str(form.resetarConfigsWifi.data),  'alerta_email': str(form.alertaEmail.data), 'valor_gas_aviso': str(form.valorGasAviso.data)}))       # return x
    #     # x = {'tempo_executa_geolocalizacao': form.tempoGeolocalizacao.data, 'tempo_executa_telemetria': form.tempoTelemetria.data, 'tempo_executa_soneca': form.tempoSoneca.data, 'tempo_executa_thingspeak': form.tempoThingSpeak.data, 'url_thingspeak': form.urlThingSpeak.data, 'url_ip_api': form.urlIpApi.data, 'secret_key_thingspeak': form.secretKeyThingSpeak.data, 'resetar_configs_wifi': form.resetarConfigsWifi.data,  'alerta_email': form.alertaEmail.data, 'valor_gas_aviso': form.valorGasAviso.data}
    #     # x = json.dumps({'tempo_executa_geolocalizacao': str(form.tempoGeolocalizacao.data), 'tempo_executa_telemetria': str(form.tempoTelemetria.data), 'tempo_executa_soneca': str(form.tempoSoneca.data), 'tempo_executa_thingspeak': str(form.tempoThingSpeak.data), 'url_thingspeak': str(form.urlThingSpeak.data), 'url_ip_api': str(form.urlIpApi.data), 'secret_key_thingspeak': str(form.secretKeyThingSpeak.data), 'resetar_configs_wifi': str(form.resetarConfigsWifi.data),  'alerta_email': str(form.alertaEmail.data), 'valor_gas_aviso': str(form.valorGasAviso.data) })
    #     # print(x)
    #     # jsonConfig = '{"tempo_execucao_telemetria": form.tempoTelemetria.data\', form.tempoGeolocalizacao.data, form.tempoSoneca.data, form.usuario_id.data}'
    configObj = ConfiguracaoJson(request.get_json(), request.get_json()['usuarioId'])   # form.tempoTelemetria.data, form.tempoGeolocalizacao.data, form.tempoSoneca.data, form.tempoThingSpeak.data, form.secretKeyThingSpeak.data, form.urlThingSpeak.data, form.urlIpApi.data, form.resetarConfigsWifi.data, form.alertaEmail.data, form.valorGasAviso.data, form.usuario_id.data
    db.session.add(configObj)
    db.session.commit()
    #     flash("Configuracoes adicionadas com sucesso!!!", category="success")
    #     # form.tempoTelemetria = None
    #     # form.tempoGeolocalizacao = None
    #     # form.tempoSoneca = None
    #     return redirect(url_for('.listar'))
    return 'OK', 200


@config.route('/editarConfiguracoes', methods=['POST'])
@login_required
def editar():
    formConfig = FormConfiguracao()
    # print(formConfigAlterar.tempoGeolocalizacao.data, formConfigAlterar.tempoTelemetria.data)
    # if formConfigAlterar.validate_on_submit():
    if formConfig.validate_on_submit():
        configObj = ConfiguracaoJson.query.get(formConfig.id.data)
        configObj.tempo_execucao_telemetria = formConfig.tempoTelemetria.data
        configObj.tempo_execucao_geolocalizacao = formConfig.tempoGeolocalizacao.data
        configObj.tempo_execucao_soneca = formConfig.tempoSoneca.data
        configObj.tempo_execucao_thingspeak = formConfig.tempoThingSpeak.data
        configObj.secret_key_thingspeak = formConfig.secretKeyThingSpeak.data
        configObj.url_thingspeak = formConfig.urlThingSpeak.data
        configObj.url_ip_api =  formConfig.urlIpApi.data
        configObj.resetar_configs_wifi = formConfig.resetarConfigsWifi.data
        configObj.alerta_email = formConfig.alertaEmail.data
        configObj.valor_gas_aviso = formConfig.valorGasAviso.data
        configObj.usuario_id = formConfig.usuario_id.data

        db.session.commit()
        flash("Configuracoes alteradas com sucesso!!!", category="success")
        return redirect(url_for('.listar'))

    return redirect(url_for('.listar'))


@config.route('/formulario/<int:id>', methods=['GET'])
@login_required
def formulario(id):
    # formConfig = FormConfiguracao()
    # print(formConfigAlterar.tempoGeolocalizacao.data, formConfigAlterar.tempoTelemetria.data)
    configObj = ConfiguracaoJson.query.get(id)
    print(configObj)

    return jsonify({"dadosConfigsWiFi": configObj.resetar_configs_wifi, "dadosAlertaEmail": configObj.alerta_email, "dadosUsuario": configObj.usuario_id}), 200

    # return redirect(url_for('.listar'))


@config.route('/excluirConfig/<int:id>', methods=['GET'])
@login_required
def excluir(id):
    config = ConfiguracaoJson.query.get(id)
    db.session.delete(config)
    db.session.commit()
    flash("Configuracao deletada com sucesso!!!", category="success")
    return redirect(url_for('config.listar'))



@config.route('/listarConfigJson', methods=['GET'])
@login_required
def listarConfigJson():
    if current_user.tipoUsuario == 0:

        configObj = ConfiguracaoJson.query.all()
        print(configObj, dir(configObj))
        for l in configObj:
            print(l.usuarioId)
        lista = []
        for linha in configObj:
            lista.append({
                "id": linha.id,
                "tempo_execucao_telemetria": linha.json["tempoTel"],
                "tempo_execucao_geolocalizacao": linha.json["tempoGeo"],
                "tempo_execucao_soneca": linha.json["tempoSoneca"],
                "tempo_execucao_thingspeak": linha.json["tempoThingSpeak"],
                "secret_key_thingspeak": linha.json["secretKey"],
                "url_ip_api": linha.json["urlIpApi"],
                "url_thingspeak": linha.json["urlThingSpeak"],
                "resetar_configs_wifi": linha.json["resetarConfigsWifi"],
                "alerta_email": linha.json["alertaEmail"],
                "valor_gas_aviso": linha.json["valorGasAviso"],
                "dataCriacao": linha.dataCriacao,
                "dataAtualizacao": linha.dataAtualizacao,
                "usuario_id": linha.usuarios.nome  # linha.json["usuarioId"]
            }) 
        return jsonify({'data': lista})
    else:
        configObj = ConfiguracaoJson.query.filter(func.json_extract(ConfiguracaoJson.json, "$.usuarioId") == current_user.id).all()
        lista = []
        for linha in configObj:
            lista.append({
                "id": linha.id,
                "tempo_execucao_telemetria": linha.json["tempoTel"],
                "tempo_execucao_geolocalizacao": linha.json["tempoGeo"],
                "tempo_execucao_soneca": linha.json["tempoSoneca"],
                "tempo_execucao_thingspeak": linha.json["tempoThingSpeak"],
                "secret_key_thingspeak": linha.json["secretKey"],
                "url_ip_api": linha.json["urlIpApi"],
                "url_thingspeak": linha.json["urlThingSpeak"],
                "resetar_configs_wifi": linha.json["resetarConfigsWifi"],
                "alerta_email": linha.json["alertaEmail"],
                "valor_gas_aviso": linha.json["valorGasAviso"],
                "dataCriacao": linha.dataCriacao,
                "dataAtualizacao": linha.dataAtualizacao,
                "usuario_id": linha.usuarios.nome 
            }) 
        return jsonify({'data': lista})



@config.route('/editarPesquisarConfigJson/<int:id>', methods=['POST', 'GET'])
@login_required
def editarPesquisarConfigJson(id):
    if current_user.tipoUsuario == 0:
        linha = ConfiguracaoJson.query.filter_by(id=id).first()
        id_nome = Usuarios.query.all()

        print(linha)
        l = [ (linhas.id, linhas.nome) for linhas in id_nome ]
        print(l)
        lista = {
                "id": linha.id,
                "tempo_execucao_telemetria": linha.json["tempoTel"],
                "tempo_execucao_geolocalizacao": linha.json["tempoGeo"],
                "tempo_execucao_soneca": linha.json["tempoSoneca"],
                "tempo_execucao_thingspeak": linha.json["tempoThingSpeak"],
                "secret_key_thingspeak": linha.json["secretKey"],
                "url_ip_api": linha.json["urlIpApi"],
                "url_thingspeak": linha.json["urlThingSpeak"],
                "resetar_configs_wifi": linha.json["resetarConfigsWifi"],
                "alerta_email": linha.json["alertaEmail"],
                "valor_gas_aviso": linha.json["valorGasAviso"],
                "dataCriacao": linha.dataCriacao,
                "dataAtualizacao": linha.dataAtualizacao,
                "usuario_id": linha.usuarios.nome,   # linha.json["usuarioId"]
                "usuariosIdNome":  l
        }
        return jsonify({'data': lista})
    else:
        linha = ConfiguracaoJson.query.filter_by(id=id).first()
        id_nome = Usuario.query.filter_by(id=current_user.id)
        print(linha)
        l = [ (linhas.id, linhas.nome) for linhas in id_nome ]
        
        lista = {
                "id": linha.id,
                "tempo_execucao_telemetria": linha.json["tempoTel"],
                "tempo_execucao_geolocalizacao": linha.json["tempoGeo"],
                "tempo_execucao_soneca": linha.json["tempoSoneca"],
                "tempo_execucao_thingspeak": linha.json["tempoThingSpeak"],
                "secret_key_thingspeak": linha.json["secretKey"],
                "url_ip_api": linha.json["urlIpApi"],
                "url_thingspeak": linha.json["urlThingSpeak"],
                "resetar_configs_wifi": linha.json["resetarConfigsWifi"],
                "alerta_email": linha.json["alertaEmail"],
                "valor_gas_aviso": linha.json["valorGasAviso"],
                "dataCriacao": linha.dataCriacao,
                "dataAtualizacao": linha.dataAtualizacao,
                "usuario_id": linha.usuarios.nome,   # linha.json["usuarioId"]
                "usuariosIdNome": l
        }
        return jsonify({'data': lista})


@config.route('/editarConfiguracoesJson', methods=['POST'])
@login_required
def editarConfigJson():
    # formConfig = FormConfiguracao()
    # print(formConfigAlterar.tempoGeolocalizacao.data, formConfigAlterar.tempoTelemetria.data)
    # if formConfigAlterar.validate_on_submit():
    # if formConfig.validate_on_submit():
    print("AQUI URL SPLIT {} ".format(request.get_json()["id"]))
    configObj = ConfiguracaoJson.query.get(request.get_json()["id"])
    print(configObj.json)
    novoJson = dict(configObj.json)
    
    novoJson["tempoTel"] = request.get_json()["tempoTel"]
    novoJson["tempoGeo"] = request.get_json()["tempoGeo"]
    novoJson["tempoSoneca"] = request.get_json()["tempoSoneca"]
    novoJson["tempoThingSpeak"] = request.get_json()["tempoThingSpeak"]
    novoJson["urlIpApi"] = request.get_json()["urlIpApi"]
    novoJson["urlThingSpeak"] = request.get_json()["urlThingSpeak"]
    novoJson["secretKey"] = request.get_json()["secretKey"]
    novoJson["resetarConfigsWifi"] = request.get_json()["resetarConfigsWifi"]
    novoJson["alertaEmail"] = request.get_json()["alertaEmail"]
    novoJson["valorGasAviso"] = request.get_json()["valorGasAviso"]
    configObj.usuario_id = request.get_json()["usuarioId"]
    print(novoJson)
    configObj.json = novoJson

    # db.session.merge(configObj)
    # db.session.flush()
    db.session.commit()

    return jsonify({'data': 'OK'})


@config.errorhandler(404)
@login_required
def paginaNaoEncontrada():
    return render_template('error404.html'), 404
