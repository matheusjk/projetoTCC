from app import login_manager, login_user, login_required, current_user, logout_user, render_template, redirect, url_for, flash, Blueprint, request, jsonify
from app.models.tables import Local, Usuarios, db
from app.local.forms import FormLocal

local = Blueprint('local', __name__, template_folder='templates', url_prefix='/local')

linhas_por_pagina = 5

# @local.route('/listarLocal', methods=['GET'], defaults={'pagina': 1})
@local.route('/listaLocal', methods=['GET'])
@login_required
def listar():
    # por_pagina = 5
    if current_user.tipoUsuario == 0:
        # usuarios = Usuarios.query.all()
        # print(usuarios)
        # localObj = Local.query.order_by(Local.id.asc()).all()  #.paginate(pagina, por_pagina, error_out=False)
        # # for lin in usuarios:
        # #     print(lin.local.cidade)
        # formLocal = FormLocal()
        # formLocal.usuario_id.choices = [(linhas.id, linhas.nome) for linhas in usuarios]
        # return render_template('local.html', local=localObj, form=formLocal, usuarioLogado=current_user)
        return render_template('local.html')
    else:
        # usuarios = Usuarios.query.filter_by(nome=current_user.nome).first() # all()
        # print(usuarios.nome)
        # localObj = Local.query.filter_by(usuario_id=usuarios.id).all()   #.paginate(pagina, por_pagina, error_out=False) # order_by(Local.id.asc()) .paginate(pagina, por_pagina, error_out=False)
        # for lin in usuarios:
        #     print(lin.local.cidade)
        # formLocal = FormLocal()
        # formLocal.usuario_id.choices = [(usuarios.id, usuarios.nome)]
        return render_template('local.html')


@local.route('/registrarLocal', methods=['GET', 'POST'])
@login_required
def registrarLocal():
    formLocal = FormLocal()
    # print(formLocal.usuario_id.data, formLocal.cep.data, formLocal.endereco.data, formLocal)
    print(formLocal.cep.data, formLocal.endereco.data, formLocal.cidade.data, formLocal.bairro.data, formLocal.estado.data, formLocal.obs.data, formLocal.usuario_id.data)
    # print(formLocal.validate_on_submit())
    # if formLocal.validate_on_submit():
    print(formLocal.endereco.data)
    localObj = Local(formLocal.cep.data, formLocal.endereco.data, formLocal.cidade.data, formLocal.bairro.data, formLocal.estado.data, formLocal.obs.data, int(formLocal.usuario_id.data))
    db.session.add(localObj)
    db.session.commit()
    flash("Local adicionado com sucesso!!!", category='success')
    formLocal.cep = None
    formLocal.endereco = None
    formLocal.cidade =  None
    formLocal.bairro = None
    formLocal.estado = None
    formLocal.obs = None
    return redirect(url_for('local.listar'))


@local.route('/editarLocal', methods=['POST'])
@login_required
def editar():
    formLocal = FormLocal()
    print(formLocal.endereco.data, formLocal.id.data, formLocal.usuario_id.data)
    if formLocal.validate_on_submit():
        # print('ola')
        localObj = Local.query.get(formLocal.id.data)
        localObj.cep = formLocal.cep.data
        localObj.endereco = formLocal.endereco.data
        localObj.cidade = formLocal.cidade.data
        localObj.bairro = formLocal.bairro.data
        localObj.estado = formLocal.estado.data
        localObj.obs = formLocal.obs.data
        localObj.usuario_id = formLocal.usuario_id.data

        db.session.commit()
        flash("Local Alterado com sucesso!!!", category='success')
        return redirect(url_for('.listar'))
    return redirect(url_for('.listar'))

@local.route('/excluirLocal/<int:id>', methods=['DELETE'])
@login_required
def excluir(id):
    localObj = Local.query.get(id)
    db.session.delete(localObj)
    db.session.commit()
    return jsonify({'data': 'Deletado com sucesso'})
    # flash("Local excluido com sucesso", category='success')
    # return redirect(url_for('local.listar'))


@local.route('/formulario/<int:id>', methods=['GET'])
@login_required
def formulario(id):
    localObj = Local.query.get(id)
    
    return jsonify({"dadosUsuario": localObj.usuario_id}), 200



@local.route("/usuariosLocalJson", methods=["GET"])
@login_required
def listarUsuariosLocal():
    if current_user.tipoUsuario == 0:

        usuarioId = Usuarios.query.all()
        listaUsuarios = []

        for linhaUsuario in usuarioId:

            listaUsuarios.append({
                'idUsuario': linhaUsuario.id,
                'nomeUsuario': linhaUsuario.nome
            })
    elif current_user.tipoUsuario == 1:
        usuarioId = Usuarios.query.filter_by(nome=current_user.nome).first()
        listaUsuarios = []

        # for linhaUsuario in usuarioId:

        listaUsuarios.append({
            'idUsuario': usuarioId.id,
            'nomeUsuario': usuarioId.nome
        })

    return jsonify({'data': listaUsuarios}) 



@local.route("/editarPesquisarLocalJson/<int:id>", methods=['POST', 'GET'])
@login_required
def editarPesquisarLocalJson(id):
    if current_user.tipoUsuario == 0:
        linha = Local.query.filter_by(id=id).first()
        id_nome = Usuarios.query.all()

        print(linha)
        l = [ (linhas.id, linhas.nome ) for linhas in id_nome]
        # [ { "idUsuarioDicionario": linhas.id, "nomeUsuarioDicionario": linhas.nome, "tipoUsuario": linhas.tipoUsuario } for linhas in id_nome]
        print(l)
        print(linha)
        lista = {}
        if linha is not None: 
            lista = {
                'id': linha.id,
                "cep": linha.cep,
                "endereco": linha.endereco,
                'cidade': linha.cidade,
                'bairro': linha.bairro,
                'estado': linha.estado,
                'obs': linha.obs,
                'idUsuario': linha.usuarios.id,
                'nomeUsuario': linha.usuarios.nome,
                'usuariosIdNome': l
            }
            return jsonify({'data': lista if len(lista) != [] or lista is not None else "ID nao existente"})
        else:
            return jsonify({'data': lista if len(lista) > 0 else "ID nao existente"})
    elif current_user.tipoUsuario == 1:
        linha = Local.query.filter_by(id=id).first()
        id_nome = Usuarios.query.filter_by(id=current_user.id).all()

        print(linha)
        l = [ (linhas.id, linhas.nome) for linhas in id_nome]
        lista = {}
        if linha is not None: 
            lista = {
                'id': linha.id,
                "cep": linha.cep,
                "endereco": linha.endereco,
                'cidade': linha.cidade,
                'bairro': linha.bairro,
                'estado': linha.estado,
                'obs': linha.obs,
                'idUsuario': linha.usuarios.id,
                'nomeUsuario': linha.usuarios.nome,
                'usuariosIdNome': l
            }
            return jsonify({'data': lista if len(lista) != [] or lista is not None else "ID nao existente"})
        else:
            return jsonify({'data': lista if len(lista) > 0 else "ID nao existente"})


@local.route('/inserirLocalJson', methods=['GET', 'POST'])
@login_required
def inserirLocalJson():
    if request.method == 'POST':
        
        localObj = Local(request.get_json()["cep"], request.get_json()["endereco"], request.get_json()["cidade"], request.get_json()["bairro"], request.get_json()["estado"], request.get_json()["obs"], request.get_json()["nomeUsuario"])
        
        db.session.add(localObj)
        db.session.commit()
        
        return jsonify({"data": "registro adicionado com sucesso!!!"})


@local.route('/editarLocalJson', methods=['PUT'])
@login_required
def editarLocalJson():
    localObj = Local.query.get(request.get_json()["id"])
    localObj.cep = request.get_json()["cep"]
    localObj.endereco = request.get_json()["endereco"]
    localObj.cidade = request.get_json()["cidade"]
    localObj.bairro = request.get_json()["bairro"]
    localObj.estado = request.get_json()["estado"]
    localObj.obs = request.get_json()["obs"]
    localObj.usuario_id = request.get_json()["nomeUsuario"]

    print(localObj.cep, localObj, localObj.usuario_id)

    db.session.commit()
       
    return jsonify({"data": 'ALTERADO COM SUCESSO!!!'})



@local.route("/listarLocalJson", methods=['GET'])
@login_required
def listarLocalJson():
    if current_user.tipoUsuario == 0:

        
        localObj = Local.query.all() 

        lista = []
        

        for linha in localObj:
            lista.append({
                'id': linha.id,
                "cep": linha.cep,
                "endereco": linha.endereco,
                'cidade': linha.cidade,
                'bairro': linha.bairro,
                'estado': linha.estado,
                'obs': linha.obs,
                'idUsuario': linha.usuarios.id,
                'nomeUsuario': linha.usuarios.nome
            })
        return jsonify({'data': lista})

    elif current_user.tipoUsuario == 1:

        localObj = Local.query.filter_by(usuario_id=current_user.id).all() 

        lista = []
        

        for linha in localObj:
            lista.append({
                'id': linha.id,
                "cep": linha.cep,
                "endereco": linha.endereco,
                'cidade': linha.cidade,
                'bairro': linha.bairro,
                'estado': linha.estado,
                'obs': linha.obs,
                'idUsuario': linha.usuarios.id,
                'nomeUsuario': linha.usuarios.nome
            })

       

        return jsonify({'data': lista})

# @local.after_request
# def cookies():
#     response = make_response
#     response.set_cookie('same-site-cookie', {{ current_user.nome }}, samesite='Lax')
#     return response
