from app import login_manager, login_user, login_required, current_user, logout_user, render_template, redirect, url_for, flash, Blueprint, request, secure_filename, os, current_app, jsonify
from app.models.tables import Sensores, db
from app.sensor.forms import FormSensor


sensor = Blueprint('sensor', __name__, template_folder="templates", url_prefix='/sensor')
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

linhas_por_pagina = 5

@sensor.route('listarSensores', methods=['GET'], defaults={'pagina': 1})
@sensor.route('/listarSensores/<int:pagina>', methods=['GET'])
@login_required
def listar(pagina):
    por_pagina = 5
    formSensor = FormSensor()
    sensorObj = Sensores.query.all()  # .paginate(pagina, por_pagina, error_out=False)

    return render_template('sensores.html', sensores=sensorObj, form=formSensor)


# @sensor.route('/registrarSensor', methods=['GET', 'POST'])
# @login_required
# def registrarSensor():
#     formSensor = FormSensor()
#     print(formSensor.tipoSensor.data, formSensor.fotoSensor.data)
#     if formSensor.validate_on_submit():
#         # foto = formSensor.fotoSensor.data
#         # filename = secure_filename(foto.filename)
#         # urlFoto = os.path.join(current_app.config.get('UPLOAD_FOLDER'), filename)
#         # print(urlFoto)
#         # foto.save(urlFoto) # current_app.config['UPLOAD_FOLDER']
#         # print(formSensor.tipoSensor.data)
#         # urlFoto.split('/')
#         sensorObj = Sensores(formSensor.tipoSensor.data, formSensor.descritivo.data)
#         db.session.add(sensorObj)
#         db.session.commit()
#         flash("Sensor adicionado com sucesso!!!", category="success")
#     # else:
#     #     flash("Sensor falhou ao ser adicionado!!!", category="warning")
#     formSensor.tipoSensor = None
#     formSensor.descritivo = None
#     return redirect(url_for('.listar'))

# @sensor.route('/editarSensor', methods=['POST'])
# @login_required
# def editar():
#     formSensor = FormSensor()
#     if formSensor.validate_on_submit():
#         sensorObj = Sensores.query.get(formSensor.id.data)
#         sensorObj.tipoSensor = formSensor.tipoSensor.data
#         sensorObj.descritivo = formSensor.descritivo.data

#         db.session.commit()
#         flash("Sensor alterado com sucesso!!!", category="success")
#         return redirect(url_for('.listar'))


# @sensor.route('/excluirSensor/<int:id>', methods=['GET'])
# @login_required
# def excluir(id):
#     sensorObj = Sensores.query.get(id)
#     db.session.delete(sensorObj)
#     db.session.commit()
#     flash('Sensor deletado com sucesso!!!', category='success')
#     return redirect(url_for('sensor.listar'))


@sensor.route("/registraSensoresJson", methods=["POST"])
@login_required
def registraSensoresJson():
    if request.method == "POST":
        sensorObj = Sensores(request.get_json()['tipoSensor'], request.get_json()['descritivo'])
        db.session.add(sensorObj)
        db.session.commit()
        return jsonify({'data': 'Sensor adicionado com sucesso!!!'})


@sensor.route("/editarPesquisarSensorJson/<int:id>", methods=['GET'])
@login_required
def editarPesquisarSensoresJson(id):
    if current_user.tipoUsuario == 1:
        linha = Sensores.query.filter_by(id=id).first()

        if linha is not None:
            lista = {
                "id": linha.id,
                "descritivo": linha.descritivo,
                "tipoSensor": linha.tipoSensor,
                "dataSensor": linha.dataSensor
            }
            return jsonify({'data': lista})
        else:
            return jsonify({'data': 'Nenhum registro com esse id'})
    else:
        linha = Sensores.query.filter_by(id=id).first()

        if linha is not None:
            lista = {
                "id": linha.id,
                "descritivo": linha.descritivo,
                "tipoSensor": linha.tipoSensor,
                "dataSensor": linha.dataSensor
            }
            return jsonify({'data': lista})
        else:
            return jsonify({'data': 'Nenhum registro com esse id'})



@sensor.route("/editarSensoresJson", methods=['PUT'])
@login_required
def editarSensoresJson():
    sensorObj = Sensores.query.get(request.get_json()['id'])
    sensorObj.tipoSensor = request.get_json()['tipoSensor']
    sensorObj.descritivo = request.get_json()['descritivo']
    db.session.commit()
    return jsonify({"data": 'ALTERADO COM SUCESSO!!!'})



@sensor.route("/listarSensorJson", methods=['GET'])
@login_required
def listarSensorJson():
    if current_user.tipoUsuario == 1:

        sensorObj = Sensores.query.all()
        lista = []
        for linha in sensorObj:
            lista.append({
                "id": linha.id,
                "nome": linha.tipoSensor,
                "descritivo": linha.descritivo,
                "dataCriacao": linha.dataSensor
            })

        return jsonify({'data': lista})
    # elif current_user.tipoUsuario == 1:
    #     sensorObj = Sensores.query.filter_by(id)
    #     lista = []
    #     for linha in sensorObj:
    #         lista.append({
    #             "id": linha.id,
    #             "nome": linha.tipoSensor,
    #             "descritivo": linha.descritivo,
    #             "dataCriacao": linha.dataSensor
    #         })

    #     return jsonify({'data': lista})

@sensor.route("/excluirSensor/<int:id>", methods=['DELETE'])
@login_required
def excluir(id):
    sensorObj = Sensores.query.get(id)
    db.session.delete(sensorObj)
    db.session.commit()

    return jsonify({'data': 'Deletado com sucesso'})