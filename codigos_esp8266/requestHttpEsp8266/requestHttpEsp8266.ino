#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
//#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <base64.h>
//#include <CTBot.h>


#include <WiFiManager.h>
#include <DHT.h>
#include <ESP_Mail_Client.h>


#define SMTP_HOST "smtp.gmail.com"
#define SMTP_PORT 465


//#define SMTP_HOST "smtp.live.com"
//#define SMTP_PORT 587


/* CREDENCIAIS EMAIL */
#define AUTOR_EMAIL "projetotccfinal2022@gmail.com"
#define AUTOR_SENHA "hrlhnaxangjdgpat"

//#define RECIPIENT_EMAIL "matheusrodriguesh1@gmail.com"

/* Sessao SMTP objeto usado para o envio do email */
SMTPSession smtp;


#define MQ_analog A0
#define MQ_dig D7
#define DHTPINO D5
#define DHTTYPE DHT11


//CTBot meuBot;

DHT dht(DHTPINO, DHTTYPE);


int valor_analog;
int valor_dig;

//#define ssid "netvirtua1567 ap 101"
//#define senha "1098550000"


String serverName = "http://192.168.0.20:59000/config/listarConfigJsonEsp/5";

bool enviou = false;
int cont = 0;

unsigned long ultimoTempoTelemetria = 0, ultimoTempoThingSpeak = 0, ultimoTempoGeo = 0, ultimoTempoBot = 0;

unsigned long lastTime = 0;

unsigned long timerDelay = 30000; // de 5 em 5 segundos 30.000


//unsigned long ultimoTempoBot = 0;
//unsigned long timerDelayBot = 20000;
//bool passouBot = false;


WiFiManager wifiManager;
DynamicJsonDocument doc(1024);
char json[] = "";



void smtpCallback(SMTP_Status status);  // funçoã de callback para enviar status email


void setup() {
  Serial.begin(115200);
  pinMode(MQ_analog, INPUT);
  pinMode(MQ_dig, INPUT);
  dht.begin();

  wifiManager.autoConnect("ESP8266", "123@mudar");

//  meuBot.wifiConnect(ssid, senha);
  
//   WiFi.begin(ssid, senha);
// 
//
//  Serial.println("Conectando...");
//  while(WiFi.status() != WL_CONNECTED){
//    delay(1000);
//    Serial.print(".");
//  }
  
  Serial.println("Conectando...");
 
  Serial.println("");
  Serial.print("Conectado a rede WiFi com o IP: ");
  Serial.println(WiFi.localIP());
  
  Serial.println("Tempo configurado de 5 em 5 segundos");
  
}


int lerSensorMQ(){
      valor_analog = analogRead(MQ_analog);
      valor_dig = digitalRead(MQ_dig);
      
      Serial.print(valor_analog);
      Serial.print(valor_dig);

      if(valor_dig == 0){
        Serial.println("GAS DETECTADO !!!");
      }else {
        Serial.println("GAS AUSENTE !!!");
      }
      return valor_analog;
}


float * lerSensorDhtTemperatura(){
     static float retorno[2];
     float temperatura = dht.readTemperature();
     float umidade = dht.readHumidity();
    
    if(isnan(temperatura) and isnan(umidade)){  // verifica se uma das variaveis sao numericos is not number
      Serial.print("Falha ao ler temperatura e umidade no sensor DHT11");
      return NULL;
    }else {
      Serial.print("TEMP: ");
      Serial.println(temperatura);
      Serial.print("UMIDADE: ");
      Serial.println(umidade);
      retorno[0] = temperatura;
      retorno[1] = umidade;
  }
  return retorno;
}


void enviaThingSpeak(String urlThingSpeak, String secretKeyThingSpeak, float temp, float umidadeLocal, float gasLocal, float tempo_execucao_thingspeak){
   
//   ThingSpeak.begin(clienteThingSpeak);
   
   if((millis() - ultimoTempoThingSpeak) > (tempo_execucao_thingspeak * 60000)){
       if(WiFi.status() == WL_CONNECTED){

          WiFiClient clienteThing;
          HTTPClient httpThing;
//        int temp = ThingSpeak.writeField()
          
          Serial.println("VINDO DA FUNCAO THINGSPEAK ");
          Serial.println(urlThingSpeak);
          httpThing.begin(clienteThing, urlThingSpeak);
        
          httpThing.addHeader("Content-Type", "application/json");
          String httpRequestData = "{\"api_key\":\"" + secretKeyThingSpeak + "\",\"field1\":\"" + temp + "\",\"field2\":\"" + umidadeLocal + "\", \"field3\":\"" + gasLocal + "\" }" ;
          int httpResponseCode = httpThing.POST(httpRequestData);
        
          Serial.print("HTTP Response Code: ");
          Serial.print(httpResponseCode);

          if(httpResponseCode > 0){
              Serial.print("HTTP Response Code: ");
              Serial.println(httpResponseCode);
              String payload = httpThing.getString();
              Serial.println(payload);  
          }else {
              Serial.print("Error code: ");
              Serial.println(httpResponseCode);
          }

          
        
          httpThing.end();
      }else {
        Serial.print("WiFi desconectado!!!");
      }
      
      ultimoTempoThingSpeak = millis();
  }
//    ESP.wdtFeed();

}




void chamaTelemetria(float temperatura, float umidade, float tempo_execucao_telemetria, String nome_usuario, int usuario_id){
        Serial.print("TEMPO TELEMETRIA => ");
        Serial.print(tempo_execucao_telemetria);
        if((millis() - ultimoTempoTelemetria) > (tempo_execucao_telemetria * 60000)){
      
           ultimoTempoTelemetria = millis();

           WiFiClient clienteTel;
           HTTPClient httpTel;

          

           String payload = "{}";
           
           
           String serverTelemetria = "http://192.168.0.20:59000/telemetria/registrarTelemetriaEsp";

               String usuarioHttp = "esp8266";
               String senhaHttp = "python";
               String auth = base64::encode(usuarioHttp + ":" + senhaHttp);
               httpTel.begin(clienteTel, serverTelemetria);
               httpTel.setTimeout(60000); // em ms - milesegundos
               httpTel.addHeader("Authorization", "Basic " + auth);
              
              Serial.println("http begin OK Telemetria");
           
           
             httpTel.addHeader("Content-Type", "application/json");
  
//             sprintf(json, "{\"SENSORG\": \"%d\", \"SENSORT\": \"%.2f\", \"SENSORU\": \"%.2f\", \"NOME\": \"%s\", \"IDUSUARIO\": \"%d\" }", rand() % 100, temperatura, umidade, nome_usuario, usuario_id);  // "'{\"SENSORG\": %d, \"SENSORT\": %.2f, \"SENSORU\": %.2f, \"NOME\": \"%s\", \"IDUSUARIO\": %d }'", rand() % 100, temperatura, umidade, nome_usuario, usuario_id
//             Serial.println();
//             Serial.println(json);
  
             DynamicJsonDocument objeto(2048);
             objeto["SENSORG"] = lerSensorMQ(); // rand() % 100;
             objeto["SENSORT"] =  (float)String(temperatura).toDouble() ;  // converte String em Float .toFloat()
             objeto["SENSORU"] =  String(umidade, 2).toFloat();
             objeto["NOME"] = nome_usuario;
             objeto["IDUSUARIO"] = usuario_id;
  
             String obj;
             serializeJson(objeto, obj);
//             Serial.println(obj);
                   
             int httpResponseCode = httpTel.POST(obj);
             Serial.println(obj);
             
             if(httpResponseCode > 0){
                 Serial.print("HTTP Response Code: ");
                 Serial.println(httpResponseCode);
                 payload = httpTel.getString();
                 Serial.println(payload);  
             }else {
                 Serial.print("Error code: ");
                 Serial.println(httpResponseCode);
             }

             httpTel.end(); // liberando recursos;

        }
        ESP.wdtFeed();
//        yield();
}



void chamaGeo(String url_ip_api, float tempo_execucao_geolocalizacao, String nome, int usuario_id){

    if((millis() - ultimoTempoGeo) > (tempo_execucao_geolocalizacao * 60000)){
      if(WiFi.status() == WL_CONNECTED){
  //     Serial.println(lerSensorMQ());
       
       HTTPClient httpGeo;
       WiFiClient clienteGeo;

       String urlGeo = "http://192.168.0.20:59000/geo/registrarGeo";
       
        
       httpGeo.begin(clienteGeo, url_ip_api);
  
       int httpResponseCode = httpGeo.GET();
        
       if(httpResponseCode > 0){
          Serial.print("HTTP Response Code: ");
          Serial.println(httpResponseCode);
          String payload = httpGeo.getString();
          Serial.println(payload);
          enviou = true;
          cont = cont + 1;
       
          httpGeo.setURL(urlGeo);
          httpGeo.addHeader("Content-Type", "application/json");
              
          deserializeJson(doc, payload);

          DynamicJsonDocument objeto(2048);


          objeto["status"] = doc["status"];
          objeto["country"] = doc["country"];
          objeto["countryCode"] = doc["countryCode"];
          objeto["region"] = doc["region"];
          objeto["regionName"] = doc["regionName"];
          objeto["city"] = doc["city"];
          objeto["zip"] = doc["zip"];
          objeto["lat"] = doc["lat"];
          objeto["lon"] = doc["lon"];
          objeto["timezone"] = doc["timezone"];
          objeto["isp"] = doc["isp"]; 
          objeto["org"] = doc["org"];
          objeto["as"] = doc["as"];
          objeto["query"] = doc["query"];
          objeto["NOME"] = nome;
          objeto["IDUSUARIO"] = usuario_id;
            
          String obj;
          serializeJson(objeto, obj);

          int httpResponseCode = httpGeo.POST(obj);
          Serial.println(obj);
          Serial.println(nome);

          String carga = "{}";
          
          if(httpResponseCode > 0){
              Serial.print("HTTP Response Code: ");
              Serial.println(httpResponseCode);
              carga = httpGeo.getString();
              Serial.println(carga);  
          }else {
              Serial.print("Error code: ");
              Serial.println(httpResponseCode);
          }
             
//          if(enviou == true and cont == 1){
            Serial.print(cont);
//            enviou = false;
   
//              Serial.println("MAC JA GRAVADO");
//              deserializeJson(doc, payload);

               String urlModulos = "http://192.168.0.20:59000/modulo/registrarModulos";

               httpGeo.setURL(urlModulos);
               httpGeo.addHeader("Content-Type", "application/json");
                       
              Serial.println(WiFi.localIP());
              Serial.println(WiFi.softAPmacAddress().c_str());
//              Serial.println(doc["query"]);
//              Serial.println(doc["region"]);
//              Serial.println(doc["city"]);

               String mac = WiFi.softAPmacAddress().c_str();
               String ip_interno = WiFi.localIP().toString().c_str();
                
               DynamicJsonDocument objetoModulos(2048);
               objetoModulos["MAC"] = mac;
               objetoModulos["IP_INTERNO"] = ip_interno; // WiFi.localIP().toString().c_str()
               objetoModulos["query"] = doc["query"]; 
               objetoModulos["region"] = doc["region"];
               objetoModulos["city"] = doc["city"];
               objetoModulos["NOME"] = nome;
               objetoModulos["IDUSUARIO"] = usuario_id;
    
               String objModulos;
               serializeJson(objetoModulos, objModulos);
  //             Serial.println(obj);
                     
               int httpResponseCodeModulos = httpGeo.POST(objModulos);
               Serial.println(objModulos);
                
               if(httpResponseCodeModulos > 0){
                  Serial.print("HTTP Response Code Modulos: ");
                  Serial.println(httpResponseCodeModulos);
                  String payload = httpGeo.getString();
                  Serial.println(payload);
            
                }else{
                  Serial.println("HTTP JSON GEO JA FOI INSERIDO");
                }
              //https://forum.arduino.cc/t/how-to-manipulate-ipaddress-variables-convert-to-string/222693/9
              // old school
//              sprintf(json, "{\"MAC\": \"%s\" ,\"IP_INTERNO\": \"%s\" , \"query\": \"%s\", \"region\": \"%s\", \"city\": \"%s\", \"NOME\": \"%s\", \"IDUSUARIO\": \"%d\"}", WiFi.softAPmacAddress().c_str(), WiFi.localIP().toString().c_str(), ip_externo, region, city, nome.c_str(), usuarioId);
//              Serial.print(json);
//              sprintf(query_insert_modulo, INSERT_SQL_MODULO, json);
//              Serial.println(query_insert_modulo);
//              cur_mem->execute(query_insert_modulo);
//          }
              

          

//             httpTel.end(); // liberando recursos;
         

       }else{
        Serial.println("Codigo de Erro: ");
        Serial.println(httpResponseCode);
       }
       httpGeo.end(); // liberando os recursos        
      
    }
     ultimoTempoGeo = millis();
  }
  ESP.wdtFeed();
}



void chamaBotTelegram(String token, float temperatura, float umidade, float gas, String nome_usuario){
    
    if(WiFi.status() == WL_CONNECTED){
       
       HTTPClient httpBot;
       WiFiClient clienteBot;

       String urlBot = "http://192.168.0.20:59000/bot/mandaMensagem";

        String usuarioHttpBot = "espBotAlerta";
        String senhaHttpBot = "python123";
        String auth_bot = base64::encode(usuarioHttpBot + ":" + senhaHttpBot);
        httpBot.begin(clienteBot, urlBot);
        httpBot.setTimeout(60000); // em ms - milesegundos
        httpBot.addHeader("Authorization", "Basic " + auth_bot);
                  

        httpBot.addHeader("Content-Type", "application/json");
              
          DynamicJsonDocument objeto(1024);

         
//          objeto["regionName"] = doc["regionName"];
//          objeto["city"] = doc["city"];
//          objeto["zip"] = doc["zip"];
          objeto["mensagem"] = "Temperatura em " + (String)temperatura + " ºC alerta de possível vazamento de gás: " + (String)gas + " PPM";
          objeto["NOME"] = nome_usuario;
            
          String obj;
          serializeJson(objeto, obj);

          int httpResponseCode = httpBot.POST(obj);
          Serial.println(obj);
//          Serial.println(nome);

          String carga = "{}";
          
          if(httpResponseCode > 0){
              Serial.print("HTTP Response Code: ");
              Serial.println(httpResponseCode);
              carga = httpBot.getString();
              Serial.println(carga);  
          }else {
              Serial.print("Error code: ");
              Serial.println(httpResponseCode);
          }
       
       httpBot.end(); // liberando os recursos        
    }
     ESP.wdtFeed();
}
  


//void chamaBot(String token, float temperatura, float umidade, float gas){
//
//   
//   TBMessage msg;
//   String aviso;
//
//
////   meuBot.wifiConnect(ssid, senha);
//  if(passouBot == false){
//   meuBot.setTelegramToken("636806365:AAGbBHi-1KJ6wXFKKY3J3JdZnOCeG3j-RFY");
//   passouBot = true;
//  }
//  
//  if(meuBot.testConnection()){
//     Serial.println("\n Conexão OK!");
//   }else {
//     Serial.println("\n Falha na conexão!");
//   }
//   
//  
//   Serial.println();
//   Serial.println(token);
//
//   aviso = "Temperatura: " + (String)temperatura + " ºC";
//   meuBot.sendMessage(msg.sender.id, aviso);
//   
//   if(meuBot.testConnection()){
//     Serial.println("\n Conexão OK!");
//   }else {
//     Serial.println("\n Falha na conexão!");
//   }
//  
//   if((millis() - ultimoTempoBot) > timerDelay){
////    if(WiFi.status() == WL_CONNECTED){
//      if(meuBot.getNewMessage(msg)){
//        if(msg.text.equalsIgnoreCase("Temperatura")){
//          aviso = "Temperatura: " + (String)temperatura + " ºC";
//          meuBot.sendMessage(msg.sender.id, aviso);
//        }
//    
//        if(msg.text.equalsIgnoreCase("Umidade")){
//          aviso = "Umidade: " + (String)umidade + " %";
//          meuBot.sendMessage(msg.sender.id, aviso);
//        }
//    
//         if(msg.text.equalsIgnoreCase("Gas")){
//          aviso = "Gas: " + (String)gas + " %";
//          meuBot.sendMessage(msg.sender.id, aviso);
//        }
//      }
////    }
//    ultimoTempoBot = millis();
//   }
////  delay(500);
//  yield();
//  ESP.wdtFeed();
//}


void loop() {
 
  if((millis() - lastTime) > timerDelay) {

      if(WiFi.status() == WL_CONNECTED){


      HTTPClient http;
      WiFiClient cliente;

     
      String payload = "{}";
      String usuarioHttp = "esp8266";
      String senhaHttp = "python";
      String auth = base64::encode(usuarioHttp + ":" + senhaHttp);
        http.begin(cliente, serverName);
        http.setTimeout(60000); // em ms - milesegundos
        http.addHeader("Authorization", "Basic " + auth);

        Serial.println("http begin OK ConfiguracoesJSON");
      
        int httpResponseCode = http.GET();
  
        if(httpResponseCode > 0){
          Serial.print("HTTP Response Code: ");
          Serial.println(httpResponseCode);
          payload = http.getString();
          Serial.println(payload);
          deserializeJson(doc, payload);
    
          boolean alerta_email = doc["data"][0]["alerta_email"];
          const char* dataAtualizacao = doc["data"][0]["dataAtualizacao"];
          const char* dataCriacao = doc["data"][0]["dataCriacao"];
          int id = doc["data"][0]["id"];
          boolean resetar_configs_wifi = doc["data"][0]["resetar_configs_wifi"];
          const char* secret_key_thingspeak = doc["data"][0]["secret_key_thingspeak"];
          float tempo_execucao_geolocalizacao = doc["data"][0]["tempo_execucao_geolocalizacao"];
          float tempo_execucao_soneca = doc["data"][0]["tempo_execucao_soneca"];
          float tempo_execucao_telemetria = doc["data"][0]["tempo_execucao_telemetria"];
          float tempo_execucao_thingspeak = doc["data"][0]["tempo_execucao_thingspeak"];
          const char* url_ip_api = doc["data"][0]["url_ip_api"];
          const char* url_thingspeak = doc["data"][0]["url_thingspeak"];
          String token_telegram = doc["data"][0]["token_telegram"];
          String nome_usuario = doc["data"][0]["nome_usuario"];
          int usuario_id = doc["data"][0]["usuario_id"];
          float valor_gas_aviso = doc["data"][0]["valor_gas_aviso"]; 
          String RECIPIENT_EMAIL = doc["data"][0]["email"];
  
          Serial.println(alerta_email);
          Serial.print("JSON TELEMETRIA TEMPO => ");
          Serial.print(tempo_execucao_telemetria);
//          Serial.println(ESP.getFreeHeap());
          
  
          http.end(); // liberando recursos;

          float * chamaFuncao;
          float temperatura, umidade;
          chamaFuncao = lerSensorDhtTemperatura();
          temperatura = chamaFuncao[0];
          umidade = chamaFuncao[1];

          enviaThingSpeak(url_thingspeak, secret_key_thingspeak, temperatura, umidade, lerSensorMQ(), tempo_execucao_thingspeak);
          chamaTelemetria(temperatura, umidade, tempo_execucao_telemetria, nome_usuario, usuario_id);
          chamaGeo(url_ip_api, tempo_execucao_geolocalizacao, nome_usuario, usuario_id);
//          chamaBot(token_telegram, temperatura, umidade, 22.2);
          
          
//          enviaThingSpeakVersao2(url_thingspeak, secret_key_thingspeak, temperatura, umidade, rand() % 100, tempo_execucao_thingspeak);
//          ESP.wdtDisable();
//          ESP.wdtFeed();
//          yield();
          Serial.print("JSON TELEMETRIA TEMPO DEPOIS DO HTTP.END => ");
          Serial.print(tempo_execucao_telemetria);
         
        if(resetar_configs_wifi){
          wifiManager.resetSettings();
          ESP.restart();
        }
        Serial.println("LENDO SENSOR MQ");
        Serial.print(lerSensorMQ());
        if(alerta_email and lerSensorMQ() > valor_gas_aviso){ // aqui será a função da MQSensor
          Serial.println(nome_usuario);
          Serial.println(RECIPIENT_EMAIL);
          chamaBotTelegram(token_telegram, temperatura, umidade, lerSensorMQ(), nome_usuario);
          
          smtp.debug(1); // none debug or 0 | basic debug or 1
          
          smtp.callback(smtpCallback);  // setando a funcao de callback para pegar o resultado do envio
        
          ESP_Mail_Session session; // declarando sessao configuração data
        
          /* Setando a configuração de sessão */
          session.server.host_name = SMTP_HOST;
          session.server.port = SMTP_PORT;
          session.login.email = AUTOR_EMAIL;
          session.login.password = AUTOR_SENHA;
          session.login.user_domain = "meudominio.com";
        
          SMTP_Message message; // declarando a classe mensagem
        
          /* setando o cabecalho da mensagem */
          message.sender.name = "ESP";
          message.sender.email = AUTOR_EMAIL;
          message.subject = "ESP TESTE EMAIL";
          message.addRecipient(nome_usuario, RECIPIENT_EMAIL);
        
        
          /* Enviando HTML mensagem */
          String htmlMsg = "<div style=\"color:#2f4468;\"><h1>ATENÇÃO!!!</h1><p> Enviado da placa ESP8266: <br> Valor Gas Aviso atingido: "+ String(lerSensorMQ()) +" PPM favor abre as janelas e ventile o local antes de ligar qualquer equipamento eletrico</p></div>";
          message.html.content = htmlMsg.c_str();
          message.html.content = htmlMsg.c_str();
          message.text.charSet = "UTF-8";
          message.html.transfer_encoding = Content_Transfer_Encoding::enc_7bit;
        
        
        
         /** The message priority
           * esp_mail_smtp_priority_high or 1
           * esp_mail_smtp_priority_normal or 3
           * esp_mail_smtp_priority_low or 5
           * The default value is esp_mail_smtp_priority_low
          */
          
          message.priority = esp_mail_smtp_priority::esp_mail_smtp_priority_high;
        
          /* Conectando ao servidor com a configuração de sessão */
          if(!smtp.connect(&session))
            return;
        
          /* Iniciando o envio de email e fechamento da sessão */
          if(!MailClient.sendMail(&smtp, &message))
            Serial.println("Erro ao enviar email, " + smtp.errorReason());

            
        }

        Serial.println((tempo_execucao_thingspeak * 60000));    
         
  
        }else {
          Serial.print("Error code: ");
          Serial.println(httpResponseCode);
          Serial.printf("HTTP nao conectado!!! - %s\n", http.errorToString(httpResponseCode).c_str());
        }
  
    }

//          float * chamaFuncao;
//          float temperatura, umidade;
//          chamaFuncao = lerSensorDhtTemperatura();
//          temperatura = chamaFuncao[0];
//          umidade = chamaFuncao[1];
//          float tempo_execucao_telemetria = 1.00;
//          
//          chamaTelemetria(temperatura, umidade, tempo_execucao_telemetria, "admin", 1);

    lastTime = millis();
  }

}



void smtpCallback(SMTP_Status status){
  Serial.println(status.info()); // imprimindo o status atual

  /* imprimindo o resultado enviado */
  if(status.success()){
    Serial.println("-----------------");
    ESP_MAIL_PRINTF("Mensagem enviada com sucesso: %d\n", status.completedCount());
    ESP_MAIL_PRINTF("Mensagem enviada falha: %d\n", status.failedCount());
    Serial.println("-----------------");
    struct tm dt;

    for(size_t i = 0; i < smtp.sendingResult.size(); i++){
      /* pegando o resultado do item */
      SMTP_Result result = smtp.sendingResult.getItem(i);
      time_t ts = (time_t)result.timestamp;
      localtime_r(&ts, &dt);

      ESP_MAIL_PRINTF("Mensagem No: %d \n", i + 1);
      ESP_MAIL_PRINTF("Status: %s \n" , result.completed ? "success" : "failed");
      ESP_MAIL_PRINTF("Date/Time: %d/%d/%d/ %d:%d:%d\n", dt.tm_year + 1900, dt.tm_mon + 1, dt.tm_mday, dt.tm_hour, dt.tm_min, dt.tm_sec);
      ESP_MAIL_PRINTF("Recipient: %s\n", result.recipients.c_str());
      ESP_MAIL_PRINTF("Subject: %s\n", result.subject.c_str());
    }
    Serial.println("-----------------------\n");

    // precisa limpar o resultado do envio da memoria usada
    smtp.sendingResult.clear(); 
  }
}
