#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
//#include <WiFiClient.h>
#include <ArduinoJson.h>

//#include <WiFiManager.h>
#include <DHT.h>
#include <ESP_Mail_Client.h>


#define SMTP_HOST "smtp.live.com"
#define SMTP_PORT 587

/* CREDENCIAIS EMAIL */
#define AUTOR_EMAIL "email"
#define AUTOR_SENHA "senha"

#define RECIPIENT_EMAIL "matheusrodriguesh1@gmail.com"

/* Sessao SMTP objeto usado para o envio do email */
SMTPSession smtp;


#define MQ_analog A0
#define MQ_dig D7
#define DHTPINO D5
#define DHTTYPE DHT11

DHT dht(DHTPINO, DHTTYPE);


#define ssid "netvirtua1567 ap 101"
#define senha "1098550000"

String serverName = "http://192.168.0.14:59000/config/listarConfigJsonEsp/1";

bool enviou;
int cont = 0;

unsigned long ultimoTempoTelemetria = 0, ultimoTempoThingSpeak = 0, ultimoTempoGeo = 0;

unsigned long lastTime = 0;

unsigned long timerDelay = 5000; // de 5 em 5 segundos


//WiFiManager wifiManager;
DynamicJsonDocument doc(1024);
char json[] = "";


void setup() {
  Serial.begin(115200);
  
  dht.begin();

//  wifiManager.autoConnect("ESP8266", "123@mudar");


   WiFi.begin(ssid, senha);
    

  Serial.println("Conectando...");
  while(WiFi.status() != WL_CONNECTED){
    delay(1000);
    Serial.print(".");
  }
  
  Serial.println("Conectando...");
 
  Serial.println("");
  Serial.print("Conectado a rede WiFi com o IP: ");
  Serial.println(WiFi.localIP());
  
  Serial.println("Tempo configurado de 5 em 5 segundos");
  
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


void enviaThingSpeak(String urlThingSpeak, String secretKeyThingSpeak, float temp, float umidadeLocal, float gasLocal){
  HTTPClient httpThingSpeak;
  WiFiClient clienteThingSpeak;
  
  Serial.println("VINDO DA FUNCAO THINGSPEAK ");
  Serial.println(urlThingSpeak);
  httpThingSpeak.begin(clienteThingSpeak, urlThingSpeak);

  httpThingSpeak.addHeader("Content-Type", "application/json");
  String httpRequestData = "{\"api_key\":\"" + secretKeyThingSpeak + "\",\"field1\":\"" + temp + "\",\"field2\":\"" + umidadeLocal + "\", \"field3\":\"" + gasLocal + "\" }" ;
  int httpResponseCode = httpThingSpeak.POST(httpRequestData);

  Serial.print("HTTP Response Code: ");
  Serial.print(httpResponseCode);

  httpThingSpeak.end();
//  ESP.wdtFeed();

}


void chamaTelemetria(float temperatura, float umidade, float tempo_execucao_telemetria, const char* nome_usuario, int usuario_id){
        Serial.print("TEMPO TELEMETRIA => ");
        Serial.print(tempo_execucao_telemetria);
        if((millis() - ultimoTempoTelemetria) > (tempo_execucao_telemetria * 60000)){
      
           ultimoTempoTelemetria = millis();

           WiFiClient clienteTel;
           HTTPClient httpTel;

           String payload = "{}";
           
           
           String serverTelemetria = "http://192.168.0.14:59000/telemetria/registrarTelemetriaEsp";
            
              httpTel.begin(clienteTel, serverTelemetria);
              Serial.println("http begin OK Telemetria");
           
           
             httpTel.addHeader("Content-Type", "application/json");
  
//             sprintf(json, "{\"SENSORG\": \"%d\", \"SENSORT\": \"%.2f\", \"SENSORU\": \"%.2f\", \"NOME\": \"%s\", \"IDUSUARIO\": \"%d\" }", rand() % 100, temperatura, umidade, nome_usuario, usuario_id);  // "'{\"SENSORG\": %d, \"SENSORT\": %.2f, \"SENSORU\": %.2f, \"NOME\": \"%s\", \"IDUSUARIO\": %d }'", rand() % 100, temperatura, umidade, nome_usuario, usuario_id
//             Serial.println();
//             Serial.println(json);
  
             DynamicJsonDocument objeto(2048);
             objeto["SENSORG"] = rand() % 100;
             objeto["SENSORT"] = String(temperatura, 1);
             objeto["SENSORU"] = String(umidade, 1);
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

       String urlGeo = "http://192.168.0.14:59000/geo/registrarGeo";
       
        
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

//             httpTel.end(); // liberando recursos;
            
//          if(enviou == true and cont == 1){
//            Serial.print(cont);
//            enviou = false;
//   
//              Serial.println("MAC JA GRAVADO");
//              deserializeJson(doc, payload);
//              const char* ip_externo = doc["query"];
//              const char* region = doc["region"];
//              const char* city = doc["city"];
//  
//              Serial.println(WiFi.localIP());
//              Serial.println(WiFi.softAPmacAddress().c_str());
//              Serial.println(ip_externo);
//              Serial.println(region);
//              Serial.println(city);
//              //https://forum.arduino.cc/t/how-to-manipulate-ipaddress-variables-convert-to-string/222693/9
//              // old school
//              sprintf(json, "{\"MAC\": \"%s\" ,\"IP_INTERNO\": \"%s\" , \"query\": \"%s\", \"region\": \"%s\", \"city\": \"%s\", \"NOME\": \"%s\", \"IDUSUARIO\": \"%d\"}", WiFi.softAPmacAddress().c_str(), WiFi.localIP().toString().c_str(), ip_externo, region, city, nome.c_str(), usuarioId);
//              Serial.print(json);
//              sprintf(query_insert_modulo, INSERT_SQL_MODULO, json);
//              Serial.println(query_insert_modulo);
//              cur_mem->execute(query_insert_modulo);
//  
//          }else{
//            Serial.println("HTTP JSON GEO JA FOI INSERIDO");
//          }

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


void loop() {
  
  if((millis() - lastTime) > timerDelay) {

      if(WiFi.status() == WL_CONNECTED){
//        boolean alerta_email = NULL;
//        const char* dataAtualizacao = NULL;
//        const char* dataCriacao = NULL;
//        int id = NULL;
//        boolean resetar_configs_wifi = NULL;
//        const char* secret_key_thingspeak = NULL;
//        float tempo_execucao_geolocalizacao = NULL;
//        float tempo_execucao_soneca = NULL;
//        float tempo_execucao_telemetria = NULL;
//        float tempo_execucao_thingspeak = NULL;
//        const char* url_ip_api = NULL;
//        const char* url_thingspeak = NULL;
//        const char* nome_usuario = NULL;
//        int usuario_id = NULL;
//        float valor_gas_aviso = NULL; 


      HTTPClient http;
      WiFiClient cliente;

      String payload = "{}";

        http.begin(cliente, serverName);

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
          const char* nome_usuario = doc["data"][0]["nome_usuario"];
          int usuario_id = doc["data"][0]["usuario_id"];
          float valor_gas_aviso = doc["data"][0]["valor_gas_aviso"]; 

  
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

          chamaTelemetria(temperatura, umidade, tempo_execucao_telemetria, nome_usuario, usuario_id);
          chamaGeo(url_ip_api, tempo_execucao_geolocalizacao, nome_usuario, usuario_id);

//          ESP.wdtDisable();
//          ESP.wdtFeed();
//          yield();
          Serial.print("JSON TELEMETRIA TEMPO DEPOIS DO HTTP.END => ");
          Serial.print(tempo_execucao_telemetria);
         
//        if(resetar_configs_wifi){
//          wifiManager.resetSettings();
//          ESP.restart();
//        }

//        Serial.println((tempo_execucao_thingspeak * 60000));
//        if((millis() - ultimoTempoThingSpeak) > (tempo_execucao_thingspeak * 60000)){
//          if(WiFi.status() == WL_CONNECTED){
//             enviaThingSpeak(url_thingspeak, secret_key_thingspeak, temperatura, umidade, rand() % 100); // lerSensorMQ()  
//          }
//          ultimoTempoThingSpeak = millis();
//          
//        }

        
         
  
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
