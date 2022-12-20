from flask import current_app
from app import login_manager, login_user, login_required, current_user, logout_user, render_template, redirect, url_for, flash, Blueprint, request, func, jsonify, Response, csrf, auth
import json
import requests



bot = Blueprint('bot',  __name__, template_folder="templates", url_prefix='/bot')



@bot.route("/mandaMensagem", methods=['POST'])
@csrf.exempt
@auth.login_required
def mandaMensagem():
    # if request.method == "POST":
    print(request.get_json())
    
    # msg = "TESTE PYTHON BOT"
    msg = request.get_json()['mensagem']
    token = '636806365:AAGbBHi-1KJ6wXFKKY3J3JdZnOCeG3j-RFY'
    # url = "https://api.telegram.org/bot{}/getUpdates?offset=0".format(token)
    url_mensagem = "https://api.telegram.org/bot{}/sendMessage".format(token)
   
    # chatID = pegaChatId(url)

    try:
        response = requests.post(url_mensagem, json={'chat_id': 619977655, 'text': msg})
        print(response.text)
    except Exception as error:
        print(error)

    return jsonify({'data': response.status_code})



# def pegaChatId():
   
#     try:
#         response = requests.get(url)
#         # print(response.json())
#         # print(response.json()['result'])
#         r = json.dumps(response.json())
#         v = json.loads(r)
#         # print(v['result'][0]['message']['chat']['id'])
#         return v['result'][0]['message']['chat']['id']
#     except Exception as error:
#         print(error)

# msg = "TESTE PYTHON BOT"
# token = '636806365:AAGbBHi-1KJ6wXFKKY3J3JdZnOCeG3j-RFY'
# url = "https://api.telegram.org/bot{}/getUpdates?offset=0".format(token)
# url_mensagem = "https://api.telegram.org/bot{}/sendMessage".format(token)

# # pegaChatId(url)
# envia_mensagem(msg, token, url_mensagem)
