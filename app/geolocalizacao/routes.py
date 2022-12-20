from app import login_manager, login, login_required, current_user, logout_user, render_template, redirect, url_for, flash, Blueprint, request, func, jsonify, csrf, generate_password_hash, check_password_hash
from app.models.tables import Geolocalizacao, db

geo = Blueprint("geo", __name__, template_folder="templates", url_prefix="/geo")

linhas_por_pagina = 5

@geo.route("/listaGeo", methods=["GET"]) #, defaults={'pagina': 1})
# @geo.route("/listarGeo/<int:pagina>", methods=["GET"])
@login_required
def listar():
    # por_pagina = 5
    if current_user.tipoUsuario == 0:
        geoObj = Geolocalizacao.query.all()   # paginate(pagina, por_pagina, error_out=False)
        return render_template("geolocalizacao.html", geo=geoObj)
    else:
        geoObj = Geolocalizacao.query.filter(func.json_extract(Geolocalizacao.json, "$.IDUSUARIO") == current_user.id).all()
        return render_template("geolocalizacao.html", geo=geoObj)
    # print(json.loads(geoObj[0].json))
    # x = [j for j in geoObj]
    # t = []
    # for li in geoObj:
    #     t.append(json.loads(li.json))
    #     t.append(li.dataCriacao)
    #     t.append(li.id)
    # print(t['query'])
    # print(geoObj, dir(geoObj), geoObj[0].json)


@geo.route("/registrarGeo", methods=["GET", "POST"])
@csrf.exempt
def registrarGeo():
    # usuario = request.json["usuario"]
    print(request.get_json(), request.data)
    if request.method == "POST":
        # geoObj = Geolocalizacao(request.json.get("city"))
        # if len(request.json) > 25:
        geoObj = Geolocalizacao(request.json)
        db.session.add(geoObj)
        db.session.commit()
        print(geoObj)
    return jsonify({"mensagem": "GEO INCLUIDA COM SUCESSO"})


@geo.route('/listarPagGeoJson', methods=['GET'])
@login_required
def listaGeoJson():
    return render_template('geolocalizacaoJSON.html')


@geo.route("/listarGeoJson", methods=['GET'])
@login_required
def listarGeoJson():
    if current_user.tipoUsuario == 1:
        geoObj = Geolocalizacao.query.all()
        lista = []
        for linha in geoObj:
            # print(linha.json)
            lista.append({
                'id': linha.id,
                'dataCriacao': linha.dataCriacao,
                'NOME': linha.json.get('NOME'),
                'IDUSUARIO': linha.json.get('IDUSUARIO'),
                'as': linha.json['as'],
                'city': linha.json['city'],
                'country': linha.json['country'],
                'countryCode': linha.json['countryCode'],
                'isp': linha.json['isp'],
                'lat': linha.json['lat'],
                'long': linha.json['lon'],
                'org': linha.json['org'],
                'query': linha.json['query'],
                'region': linha.json['region'],
                'regionName': linha.json['regionName'],
                'status': linha.json['status'],
                'timezone': linha.json['timezone'],
                'zip': linha.json['zip']
            })
        # x = [lista.append(linha) for linha in geoObj ]
        return jsonify({"data": lista})
    else:
        geoObj = Geolocalizacao.query.filter(func.json_extract(Geolocalizacao.json, "$.IDUSUARIO") == current_user.id).all()
        lista = []
        for linha in geoObj:
            # print(linha.json)
            lista.append({
                'id': linha.id,
                'dataCriacao': linha.dataCriacao,
                'NOME': linha.json['NOME'],
                'IDUSUARIO': linha.json['IDUSUARIO'],
                'as': linha.json['as'],
                'city': linha.json['city'],
                'country': linha.json['country'],
                'countryCode': linha.json['countryCode'],
                'isp': linha.json['isp'],
                'lat': linha.json['lat'],
                'long': linha.json['lon'],
                'org': linha.json['org'],
                'query': linha.json['query'],
                'region': linha.json['region'],
                'regionName': linha.json['regionName'],
                'status': linha.json['status'],
                'timezone': linha.json['timezone'],
                'zip': linha.json['zip']
            })
        return jsonify({"data": lista })


    #  'id': linha.id,
    #             'dataCriacao': linha.dataCriacao,
    #             'status': linha.json["status"],
    #             'country': linha.json["country"],
    #             'countryCode': linha.json["countryCode"],
    #             'region': linha.json["region"],
    #             'regionName': linha.json["regionName"],
    #             'city': linha.json["city"],
    #             'zip': linha.json["zip"],
    #             'lat': linha.json["lat"],
    #             'lon': linha.json["lon"],
    #             'timezone': linha.json["timezone"],
    #             'isp': linha.json["isp"],
    #             'org': linha.json["org"],
    #             'as': linha.json["as"],
    #             'query': linha.json["query"],
    #             'NOME': linha.json["NOME"],
    #             'IDUSUARIO': linha.json["IDUSUARIO"]