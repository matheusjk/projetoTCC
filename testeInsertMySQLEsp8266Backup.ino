#include <ESP8266WiFi.h>           // Use this for WiFi instead of Ethernet.h
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <DHT.h>
#include <MySQL_Connection.h>
#include <MySQL_Cursor.h>
#include <ArduinoJson.h>


#define MQ_analog A0
#define MQ_dig D7
#define DHTPINO D5
#define DHTTYPE DHT11

int valor_analog;
int valor_dig;

bool enviou;
int cont = 0;

const char* ssid = "netvirtua1567 ap 101";
const char* senha = "1098550000";

String servidor= "http://ip-api.com/json/";

unsigned long ultimoTempoTelemetria = 0;
unsigned long tempoDelayTelemetria = 5000; // 5 segundos

unsigned long ultimoTempoGeo = 0;
unsigned long tempoDelayGeo= 5000; // 5 segundos


String serverName = "http://ip-api.com/json/";

// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastTime = 0;
// Timer set to 10 minutes (600000)
//unsigned long timerDelay = 600000;
// Set timer to 5 seconds (5000)
unsigned long timerDelay = 5000;

IPAddress ip(192, 168, 0, 22);
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress dns1(8, 8, 8, 8);  //181, 213, 132, 2  8, 8, 8, 8


IPAddress server_addr(192, 168, 0, 8); // IP DO SERVIDOR MYSQL
char user[] = "tcc2";
char password[] = "123@mudar";


WiFiClient client;
MySQL_Connection conn((Client *)&client);
MySQL_Cursor* cursor;
DHT dht(DHTPINO, DHTTYPE);

char INSERT_SQL[] = "INSERT INTO tcc.telemetria(json) VALUES('%s')";
char query[1024];

char INSERT_SQL_MODULO[] = "INSERT INTO tcc.modulos(json) VALUES('%s')";
char query_insert_modulo[1024];

char INSERT_SQL_GEOLOCALIZACAO[] = "INSERT INTO tcc.geolocalizacao(json) VALUES('%s')";
char query_insert_geolocalizacao[1024];

char QUERY_POP[] = "SELECT tempo_execucao_telemetria, tempo_execucao_geolocalizacao, tempo_execucao_soneca FROM tcc.configuracao;";
char query_select[1024];

char JSON[1024];
DynamicJsonDocument doc(1024);

void setup()
{
  Serial.begin(115200);
  pinMode(MQ_analog, INPUT);
  pinMode(MQ_dig, INPUT);
  dht.begin();
  
  // Begin WiFi section
  Serial.printf("\nConnecting to %s", ssid);
  WiFi.begin(ssid, senha);
  WiFi.disconnect();
  WiFi.hostname("esp8266");
  WiFi.config(ip, gateway, subnet, dns1);
  WiFi.begin(ssid, senha);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
//  valor_analog = analogRead(MQ_analog);
  // print out info about the connection:
  Serial.println("\nConnected to network");
  Serial.print("My IP address is: ");
  Serial.println(WiFi.localIP());

  Serial.print("Connecting to SQL...  ");
  if (conn.connect(server_addr, 3306, user, password))
    Serial.println("OK.");
  else
    Serial.println("FAILED.");
  
  // create MySQL cursor object
  cursor = new MySQL_Cursor(&conn);
  
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

float lerSensorDhtTemperatura(){
    float temperatura = dht.readTemperature();
    
    if(isnan(temperatura)){  // verifica se uma das variaveis sao numericos is not number
      Serial.print("Falha ao ler temperatura e umidade no sensor DHT11");
      return NULL;
    }else {
      Serial.print("TEMP: ");
      Serial.println(temperatura);
  }
  return temperatura;
}

float lerSensorDhtUmidade(){
  float umidade = dht.readHumidity();
 
 if(isnan(umidade)){  // verifica se uma das variaveis sao numericos is not number
      Serial.print("Falha ao ler temperatura e umidade no sensor DHT11");
      return NULL;
    }else {
      Serial.print("UMIDADE: ");
      Serial.println(umidade);
    }
 return umidade;
}

void selecionaConfiguracao(){
//   if (conn.connected())
//        sprintf(JSON, "{\"SENSORG\": %d,\"SENSORT\": 48}", valor_analog);
//        Serial.print(JSON);
       
}

void pegaTempoGeoInsertGeo(){
  if((millis() - ultimoTempoGeo) > tempoDelayGeo){
    ultimoTempoGeo = millis();
    if(WiFi.status() == WL_CONNECTED){
     Serial.println(lerSensorMQ());
     Serial.println(lerSensorDhtTemperatura());
     Serial.println(lerSensorDhtUmidade());
     bool enviou;
     HTTPClient http;

     http.begin(client, servidor);

     int httpResponseCode = http.GET();

     if(httpResponseCode > 0){
      Serial.print("HTTP Response Code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      Serial.println(payload);
//      requestGet(pay);
//      doc["geo"] = payload; 
      if (conn.connected()){
//        sprintf(JSON, "{\"SENSORG\": %d PPM,\"SENSORT\": %f *C, \"SENSORU\": %f %%}", lerSensorMQ(), lerSensorDhtTemperatura(), lerSensorDhtUmidade());
//        sprintf(JSON, "{\"geolocalizacao\": %s }", doc);
//        Serial.print("CHIP ID ESP");
//        Serial.print(ESP.getChipId());
        Serial.println();
//        Serial.print(JSON);
//        char tamanhoBuffer[100], *result;
//        tamanhoBuffer = http.getString();
//        result = fgets(tamanhoBuffer, 100, http.getString());
//        deserializeJson(doc, payload);
//        const char *sensor = doc["region"];

//        sprintf(query_insert_geolocalizacao, INSERT_SQL_GEOLOCALIZACAO, payload);
//        Serial.println(query_insert_geolocalizacao);
//        cursor->execute(query_insert_geolocalizacao);

          /*==================================================*/
        sprintf(query_select, QUERY_POP, 9000000);
        Serial.println(query_select);
        cursor->execute(query_select);

        // loop de repeticao das colunas e printando o resultado
        column_names *coluna = cursor->get_columns();
        for(int f = 0; f < coluna->num_fields; f++){
          Serial.print(coluna->fields[f]->name);
          if(f< coluna->num_fields - 1){
            Serial.print(',');
          }
        }
        Serial.println();
        // lendo as linhas e printando o resultado
        row_values *linha = NULL;

        do{
          linha = cursor->get_next_row();
          if(linha != NULL){
            for(int f = 0; f < coluna->num_fields; f++){
              Serial.print(linha->values[f]);
//              tempoDelay = atoi(linha->values[0]) * 60000;
              tempoDelayGeo= atof(linha->values[1]) * 60000;
//              tempoDelay = tempoDelay * 1000;
              Serial.println();
              Serial.print("Atualizacao de tempo Delay");
              Serial.print(tempoDelayGeo);
              Serial.println();
              Serial.print(atoi(linha->values[0])); // atoi converte String para inteiro
              if(f < coluna->num_fields - 1){
                Serial.print(',');
              }
            }
            Serial.println();
          }
        }while(linha != NULL);
      }
     }
    }
  }
}

void loop()
{

//  if ((millis() - lastTime) > timerDelay) {
//    //Check WiFi connection status
//    if(WiFi.status()== WL_CONNECTED){
//      WiFiClient client;
//      HTTPClient http;
//      
//      // Your Domain name with URL path or IP address with path
//      http.begin(client, serverName.c_str());
//      
//      // Send HTTP GET request
//      int httpResponseCode = http.GET();
//      
//      if (httpResponseCode>0) {
//        Serial.print("HTTP Response code: ");
//        Serial.println(httpResponseCode);
//        String payload = http.getString();
//        Serial.println(payload);
//      }
//      else {
//        Serial.print("Error code: ");
//        Serial.println(httpResponseCode);
//      }
//      // Free resources
//      http.end();
//    }
//    else {
//      Serial.println("WiFi Disconnected");
//    }
//    lastTime = millis();
//  }
//  pegaTempoGeoInsertGeo();

if((millis() - ultimoTempoGeo) > tempoDelayGeo){
    if(WiFi.status() == WL_CONNECTED){
     Serial.println(lerSensorMQ());
     Serial.println(lerSensorDhtTemperatura());
     Serial.println(lerSensorDhtUmidade());
    
//     WiFiClient client;
     HTTPClient http;
//     Serial.println(servidor);
//     WiFiClient cliente;
     http.begin(servidor.c_str()); //+ url

     int httpResponseCode = http.GET();
      
     if(httpResponseCode > 0){
      Serial.print("HTTP Response Code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      Serial.println(payload);
      enviou = true;
      cont = cont + 1;
   
      if (conn.connected())
//        sprintf(JSON, "{\"SENSORG\": %d PPM,\"SENSORT\": %f *C, \"SENSORU\": %f %%}", lerSensorMQ(), lerSensorDhtTemperatura(), lerSensorDhtUmidade());
//        sprintf(JSON, "{\"geolocalizacao\": %s }", doc);
//        Serial.print("CHIP ID ESP");
//        Serial.print(ESP.getChipId());
//        Serial.println();
//        Serial.print(JSON);
        if(enviou == true and cont == 1){
          Serial.print(cont);
          enviou = false;
          sprintf(query_insert_geolocalizacao, INSERT_SQL_GEOLOCALIZACAO, payload.c_str());
          Serial.println(query_insert_geolocalizacao);
          cursor->execute(query_insert_geolocalizacao);
          
          deserializeJson(doc, payload);
          const char* ip_externo = doc["query"];
          const char* region = doc["region"];
          const char* city = doc["city"];
//          const char* ip = WiFi.localIP(); //WiFi.localIP().c_str()
          Serial.println(WiFi.localIP());
          Serial.println(WiFi.softAPmacAddress().c_str());
          Serial.println(ip_externo);
          Serial.println(region);
          Serial.println(city);
          //https://forum.arduino.cc/t/how-to-manipulate-ipaddress-variables-convert-to-string/222693/9
          // old school
          sprintf(JSON, "{\"MAC\": \"%s\" ,\"IP_INTERNO\": \"%s\" , \"query\": \"%s\", \"region\": \"%s\", \"city\": \"%s\"}", WiFi.softAPmacAddress().c_str(), WiFi.localIP().toString().c_str(), ip_externo, region, city);
          Serial.print(JSON);
          sprintf(query_insert_modulo, INSERT_SQL_MODULO, JSON);
          Serial.println(query_insert_modulo);
          cursor->execute(query_insert_modulo);
          
//          Serial.println(doc["regionName"]);
//          Serial.println(payload.indexOf("query"));
//          Serial.println(payload[260]);
//          sprintf(query_insert_modulo, INSERT_SQL_MODULO, payload.indexOf("query"));
//          Serial.println(query_insert_modulo);
//          cursor->execute(query_insert_modulo);
        }else{
          Serial.println("HTTP JSON GEO JA FOI INSERIDO");
        }

     }else{
      Serial.println("Codigo de Erro: ");
      Serial.println(httpResponseCode);
     }
     http.end(); // liberando os recursos
     
//    }else{
//      Serial.println("Desconectando do WiFi");
//   }

    /* ======================= FIM DA REQUISICAO HTTP ========================= */
          /*==================================================*/
        sprintf(query_select, QUERY_POP, 9000000);
        Serial.println(query_select);
        cursor->execute(query_select);

        // loop de repeticao das colunas e printando o resultado
        column_names *coluna = cursor->get_columns();
        for(int f = 0; f < coluna->num_fields; f++){
          Serial.print(coluna->fields[f]->name);
          if(f< coluna->num_fields - 1){
            Serial.print(',');
          }
        }
        Serial.println();
        // lendo as linhas e printando o resultado
        row_values *linha = NULL;

        do{
          linha = cursor->get_next_row();
          if(linha != NULL){
            for(int f = 0; f < coluna->num_fields; f++){
              Serial.print(linha->values[f]);
//              tempoDelay = atoi(linha->values[0]) * 60000;
              tempoDelayGeo = atof(linha->values[1]) * 60000;
//              tempoDelay = tempoDelay * 1000;
              Serial.println();
              Serial.print("Atualizacao de tempo Delay");
              Serial.print(tempoDelayGeo);
              Serial.println();
              Serial.print(atof(linha->values[1])); // atoi converte String para inteiro
              if(f < coluna->num_fields - 1){
                Serial.print(',');
              }
            }
            Serial.println();
          }
        }while(linha != NULL);
      
    
  }
   ultimoTempoGeo = millis();
}

  /* =================================================================== */
  
  if((millis() - ultimoTempoTelemetria) > tempoDelayTelemetria){
    ultimoTempoTelemetria = millis();
    if(WiFi.status() == WL_CONNECTED){
     Serial.println(lerSensorMQ());
     Serial.println(lerSensorDhtTemperatura());
     Serial.println(lerSensorDhtUmidade());
     float num;
     
    
//     sprintf(num, "%f, %f, %f", selecionaConfiguracao());
     
//      doc["valor_analogico_gas"] = valor_analog;
//      doc["teste_sensor_2"] = 456;
//      serializeJson(doc, Serial);
//      String data = serializeJson(doc, Serial);
      
      if (conn.connected())
//        sprintf(JSON, "{\"SENSORG\": %d PPM,\"SENSORT\": %f *C, \"SENSORU\": %f %%}", lerSensorMQ(), lerSensorDhtTemperatura(), lerSensorDhtUmidade());
        sprintf(JSON, "{\"SENSORG\": %d, \"SENSORT\": %.2f, \"SENSORU\": %.2f }", lerSensorMQ(), lerSensorDhtTemperatura(), lerSensorDhtUmidade());
//        Serial.print("CHIP ID ESP");
//        Serial.print(ESP.getChipId());
        Serial.println();
        Serial.print(JSON);
        sprintf(query, INSERT_SQL, JSON);
        Serial.println(query);
        cursor->execute(query);
        
        /*==================================================*/
        sprintf(query_select, QUERY_POP, 9000000);
        Serial.println(query_select);
        cursor->execute(query_select);

        // loop de repeticao das colunas e printando o resultado
        column_names *coluna = cursor->get_columns();
        for(int f = 0; f < coluna->num_fields; f++){
          Serial.print(coluna->fields[f]->name);
          if(f< coluna->num_fields - 1){
            Serial.print(',');
          }
        }
        Serial.println();
        // lendo as linhas e printando o resultado
        row_values *linha = NULL;

        do{
          linha = cursor->get_next_row();
          if(linha != NULL){
            for(int f = 0; f < coluna->num_fields; f++){
              Serial.print(linha->values[f]);
//              tempoDelay = atoi(linha->values[0]) * 60000;
              tempoDelayTelemetria = atof(linha->values[0]) * 60000;
//              tempoDelay = tempoDelay * 1000;
              Serial.println();
              Serial.print("Atualizacao de tempo Delay");
              Serial.print(tempoDelayTelemetria);
              Serial.println();
              Serial.print(atoi(linha->values[0])); // atoi converte String para inteiro
              if(f < coluna->num_fields - 1){
                Serial.print(',');
              }
            }
            Serial.println();
          }
        }while(linha != NULL);
        
//        delete cursor;
//        conn.close();
      

   }
 }
}
  
