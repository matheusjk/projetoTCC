#include <ESP8266WiFi.h>           // Use this for WiFi instead of Ethernet.h
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <WiFiManager.h>
#include <DHT.h>
#include <MySQL_Connection.h>
#include <MySQL_Cursor.h>
#include <ESP_Mail_Client.h>
//#include <Arduino.h>
//#define ARDUINOJSON_USE_DOUBLE 0
#include <ArduinoJson.h>
//#include <LittleFS.h>


#define SMTP_HOST "smtp.live.com"
#define SMTP_PORT 587

/* CREDENCIAIS EMAIL */
#define AUTOR_EMAIL "matheusrodriguesh@hotmail.com"
#define AUTOR_SENHA "password_email"

#define RECIPIENT_EMAIL "matheusrodriguesh1@gmail.com"

/* Sessao SMTP objeto usado para o envio do email */
SMTPSession smtp;

/* funcao callback para pegar o status de envio do email */
void smtpCallback(SMTP_Status status);


//#define MQ_analog A0
//#define MQ_dig D7
#define DHTPINO D5
#define DHTTYPE DHT11

int valor_analog;
int valor_dig;

bool enviou;
int cont = 0;

// Na ausencia da WiFiManager usar isso aqui
//const char* ssid = "netvirtua1567 ap 101";
//const char* senha = "password_wifi";

//String apiKey = "key";

//String servidorThingSpeak = "http://api.thingspeak.com/update";

//String servidor= "http://ip-api.com/json/";

unsigned long ultimoTempoTelemetria = 0, ultimoTempoThingSpeak = 0;
//unsigned long tempoDelayTelemetria = 5000; // 5 segundos

unsigned long ultimoTempoGeo = 0;
//unsigned long tempoDelayGeo= 5000; // 5 segundos

//unsigned long idUsuario = 0;
//String nome;

// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastTime = 0;
// Timer set to 10 minutes (600000)
//unsigned long timerDelay = 600000;
// Set timer to 5 seconds (5000)
unsigned long timerDelay = 30000; //120000   de 2 em 2 minutos

IPAddress ip(192, 168, 0, 23);
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress dns1(8, 8, 8, 8);  //181, 213, 132, 2  8, 8, 8, 8


IPAddress server_addr(192, 168, 0, 13); // IP DO SERVIDOR MYSQL
char user[] = "tcc4";
char password[] = "password_banco_dados";

WiFiManager wifiManager;
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

char QUERY_POP[] = "SELECT config.tempo_execucao_telemetria AS t1, config.tempo_execucao_geolocalizacao AS t2, config.tempo_execucao_soneca AS t3, config.tempo_execucao_thingspeak AS t4, config.secret_key_thingspeak AS chave, config.url_ip_api AS urlIpApi, config.url_thingspeak AS urlTs,  config.resetar_configs_wifi AS cWiFi, config.alerta_email AS email, config.valor_gas_aviso AS gas, config.usuario_id AS confIdUser, user.id, user.nome FROM tcc.configuracao as config inner join tcc.usuarios as user ON config.usuario_id = user.id where config.id = 2;";  // "SELECT  config.tempo_execucao_soneca, config.tempo_execucao_thingspeak, config.usuario_id, user.id, user.nome FROM tcc.configuracao as config inner join tcc.usuarios as user ON config.usuario_id = user.id where config.id = 1;";  //"SELECT config.tempo_execucao_telemetria, config.tempo_execucao_geolocalizacao, config.tempo_execucao_soneca, config.usuario_id, user.id, user.nome FROM tcc.configuracao as config inner join tcc.usuarios as user ON tcc.config.usuario_id = tcc.user.id;"; // "SELECT tempo_execucao_telemetria, tempo_execucao_geolocalizacao, tempo_execucao_soneca,  FROM tcc.configuracao;";
//char query_select[2048];

char JSON[1024];
DynamicJsonDocument doc(1024);

void setup()
{
  Serial.begin(115200);
//  pinMode(MQ_analog, INPUT);
//  pinMode(MQ_dig, INPUT);
  dht.begin();
//  client.setTimeout(40); 
//  wifiManager.setAPStaticIPConfig(ip, gateway, subnet); // configurando com IP estatico 
  wifiManager.autoConnect("ESP8266", "123@mudar");

//   Begin WiFi section
//  Serial.printf("\nConnecting to %s", ssid);
//  WiFi.begin(ssid, senha);
//  WiFi.disconnect();
  WiFi.hostname("esp8266");
  WiFi.config(ip, gateway, subnet, dns1);
//  WiFi.begin(ssid, senha);
//  while (WiFi.status() != WL_CONNECTED) {
//    delay(500);
//    Serial.print(".");
//  }
  
//  valor_analog = analogRead(MQ_analog);
  // print out info about the connection:
  Serial.println("\nConnected to network");
  Serial.print("My IP address is: ");
  Serial.println(WiFi.localIP());

//  servidorOTA.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
//    request->send(200, "text/plain", "Oi! Eu sou o ESP8266 externo");
//  });
//
//  AsyncElegantOTA.begin(&servidorOTA); // iniciando o ElegantOTA
//  servidorOTA.begin();
//  Serial.println("HTTP servidor iniciado");

  Serial.print("Connecting to SQL...  ");
  if (conn.connect(server_addr, 3306, user, password))
    Serial.println("OK.");
  else
    Serial.println("FAILED.");


  
//   create MySQL cursor object
//  cursor = new MySQL_Cursor(&conn);
  
}

//int montaDocConfirmaMac(){
//  if(!LittleFS.begin()){
//   Serial.println("Ocorreu um erro enquanto montava o LittleFS");
//   return -1;
//  }
//  
//  File file = LittleFS.open("/gravaMac.txt", "r+");
//  if(!file){
//    Serial.print("Falhou na leitura");
//    return -1;
//  }
//
//  
//  while(file.available()){
//    Serial.write(file.read());
//  }
//
//  if(file.size() > 10){
//    Serial.println("TEM CONTEUDO...");
//    file.close();
//    return 1;
//  }else {
//  
//    if(file.print(WiFi.softAPmacAddress().c_str())){
//      Serial.print("MAC foi gravado com LittleFS");
//    }else {
//      Serial.print("MAC nao foi gravado");
//    }
//  }
//  file.close();
////  return 0;
//}

//int lerSensorMQ(){
//      valor_analog = analogRead(MQ_analog);
//      valor_dig = digitalRead(MQ_dig);
//      
//      Serial.print(valor_analog);
//      Serial.print(valor_dig);
//
//      if(valor_dig == 0){
//        Serial.println("GAS DETECTADO !!!");
//      }else {
//        Serial.println("GAS AUSENTE !!!");
//      }
//      return valor_analog;
//}

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

//float lerSensorDhtUmidade(){
//  float umidade = dht.readHumidity();
// 
// if(isnan(umidade)){  // verifica se uma das variaveis sao numericos is not number
//      Serial.print("Falha ao ler temperatura e umidade no sensor DHT11");
//      return NULL;
//    }else {
//      Serial.print("UMIDADE: ");
//      Serial.println(umidade);
//    }
// return umidade;
//}


String * retornaQuery(){
        static String resultado[14];
        //   create MySQL cursor object
        MySQL_Cursor *cursor = new MySQL_Cursor(&conn);
//        sprintf(query_select, QUERY_POP, 9000000);
//        Serial.println(query_select);
//        cursor->execute(query_select);

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
              //tempoDelayTelemetria = atof(linha->values[0]) * 60000;
              resultado[0] = linha->values[0];
              resultado[1] = linha->values[1];
              resultado[2] = linha->values[2];
              resultado[3] = linha->values[3];
              resultado[4] = linha->values[4];
              resultado[5] = linha->values[5];
              resultado[6] = linha->values[6];
              resultado[7] = linha->values[7];
              resultado[8] = linha->values[8];
              resultado[9] = linha->values[9];
              resultado[10] = linha->values[10];
              resultado[11] = linha->values[11];
              resultado[12] = linha->values[12];
//              tempoDelay = tempoDelay * 1000;
          /* ==================================================================== */
//              Serial.println();
//              Serial.print("Atualizacao de tempo Delay");
//              Serial.print(resultado);
//              Serial.println();
//              Serial.print(atoi(linha->values[0])); // atoi converte String para inteiro
//              Serial.println("NOME: ");
//              Serial.print(linha->values[5]);
         /* ==================================================================== */
              if(f < coluna->num_fields - 1){
                Serial.print(',');
              }
            }
            Serial.println();
          }
        }while(linha != NULL);
//        deserializeJson(doc, resultado[0]);
//    delete cursor;
//    delete query_select;
//    conn.close();
    return resultado;
}

void enviaThingSpeak(String urlThingSpeak, String secretKeyThingSpeak, float temp, float umidadeLocal, float gasLocal){
  HTTPClient http;
  Serial.println("VINDO DA FUNCAO THINGSPEAK ");
  Serial.println(urlThingSpeak);
  http.begin(urlThingSpeak);

  http.addHeader("Content-Type", "application/json");
  String httpRequestData = "{\"api_key\":\"" + secretKeyThingSpeak + "\",\"field1\":\"" + temp + "\",\"field2\":\"" + umidadeLocal + "\", \"field3\":\"" + gasLocal + "\" }" ;
  int httpResponseCode = http.POST(httpRequestData);

  Serial.print("HTTP Response Code: ");
  Serial.print(httpResponseCode);

  http.end();
//  return 1;
}


/* pegando o status do envio do email na funcao Callback */
void smtpCallback(SMTP_Status status){
  /* Exibindo o status atual */
  Serial.println(status.info());

  /* Exibindo o resultado do envio */
  if(status.success()){
    Serial.println("--------------------");
    ESP_MAIL_PRINTF("Mensagem de sucesso no envio: %d \n", status.completedCount());
    ESP_MAIL_PRINTF("Mensagem de error no envio: %d \n", status.failedCount());
    Serial.println("---------------- \n");
    struct tm dt;

    for(size_t i = 0; i < smtp.sendingResult.size(); i++){
      /* Pegando os itens do resultado */
      SMTP_Result resultado = smtp.sendingResult.getItem(i);
      time_t ts = (time_t)resultado.timestamp;
      localtime_r(&ts, &dt);

      ESP_MAIL_PRINTF("Mensagem Numero: %d \n", i+1);
      Serial.print(resultado.completed ? "success" : "failed");
      ESP_MAIL_PRINTF("Date/Time: %d/%d/%d %d:%d:%d \n", dt.tm_year + 1900, dt.tm_mon + 1, dt.tm_mday, dt.tm_hour, dt.tm_min, dt.tm_sec);
      ESP_MAIL_PRINTF("Recipient: %s \n", resultado.recipients);
      ESP_MAIL_PRINTF("Sujeito: %s \n", resultado.subject);
      
//    }
    Serial.println("--------------- \n");
  }
}
}


void loop()
{

//client.setTimeout(40);
if((millis() - lastTime) > timerDelay){
  if(WiFi.status() == WL_CONNECTED){
     String  nome, secretKeyThingSpeak;
     unsigned long  usuarioId, id, gasAviso;
     String urlThingSpeak, urlIpApi;
     float tempoExecucaoTelemetria, tempoExecucaoGeolocalizacao, tempoExecucaoSoneca, tempoExecucaoThingSpeak;
     bool resetarConfigWiFi, alertaEmail;

     float * chamaFuncao;
     float temperatura, umidade;
     chamaFuncao = lerSensorDhtTemperatura();
     temperatura = chamaFuncao[0];
     umidade = chamaFuncao[1];
    
    MySQL_Cursor *cursor = new MySQL_Cursor(&conn);
//        sprintf(query_select, QUERY_POP, 9000000);
        Serial.println(QUERY_POP);
        cursor->execute(QUERY_POP);

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
              //tempoDelayTelemetria = atof(linha->values[0]) * 60000;
              tempoExecucaoTelemetria = atof(linha->values[0]) * 60000;
              tempoExecucaoGeolocalizacao = atof(linha->values[1]) * 60000;
              tempoExecucaoSoneca = atof(linha->values[2]) * 60000;
              tempoExecucaoThingSpeak = atof(linha->values[3]) * 60000;
              secretKeyThingSpeak = linha->values[4];
              urlIpApi = linha->values[5];
              urlThingSpeak = linha->values[6];
              resetarConfigWiFi = atoi(linha->values[7]);
              alertaEmail = atoi(linha->values[8]);
              gasAviso = atoi(linha->values[9]);
              usuarioId = atoi(linha->values[10]);
              id = atoi(linha->values[11]);
              nome = linha->values[12];
//              tempoDelay = tempoDelay * 1000;
          /* ==================================================================== */
//              Serial.println();
//              Serial.print("Atualizacao de tempo Delay");
//              Serial.print(resultado);
//              Serial.println();
//              Serial.print(atoi(linha->values[0])); // atoi converte String para inteiro
//              Serial.println("NOME: ");
//              Serial.print(linha->values[5]);
         /* ==================================================================== */
              if(f < coluna->num_fields - 1){
                Serial.print(',');
              }
            }
            Serial.println();
          }
        }while(linha != NULL);
//        delete cursor;
//        deserializeJson(doc, resultado[0]);
   
//    delete query_select;
//    conn.close();
//    return resultado;
  
//   String * chamaQuery = retornaQuery();
  
  if(conn.connected()){
  
   
  //  Serial.println(chamaQuery[0].c_str());
  //  free(chamaQuery);
  //  delay(5000);
//    tempoExecucaoTelemetria = atof(chamaQuery[0].c_str()) * 60000;
//    tempoExecucaoGeolocalizacao = atof(chamaQuery[1].c_str()) * 60000;
//    tempoExecucaoSoneca = atof(chamaQuery[2].c_str()) * 60000;
//    tempoExecucaoThingSpeak = atof(chamaQuery[3].c_str()) * 60000;
//  
//    urlIpApi = chamaQuery[4].c_str();
//    urlThingSpeak = chamaQuery[5].c_str();
//    secretKeyThingSpeak = chamaQuery[6].c_str();
//    resetarConfigWiFi = atoi(chamaQuery[7].c_str());
//    alertaEmail = atoi(chamaQuery[8].c_str());
//    gasAviso = atof(chamaQuery[9].c_str());
//    usuarioId = atoi(chamaQuery[10].c_str());
//    id = atoi(chamaQuery[11].c_str());
//    nome = chamaQuery[12].c_str();
     
  //  char json[] = "{\"tempo_executa_geolocalizacao\": \"30\", \"tempo_executa_telemetria\": \"5\", \"tempo_executa_soneca\": \"30\", \"tempo_executa_thingspeak\": \"30\", \"url_thingspeak\": \"http://api.thingspeak.com/update\", \"url_ip_api\": \"http://ip-api.com/jso,/?fields=61439\", \"secret_key_thingspeak\": \"I⸮72SM7NOTEJ4OPKW\", \"resetar_configs_wifi\": \"0\", \"alerta_,mail\": \"1\", \"valor_gas_aviso\": \"725\"}";
  //  char json[] = retornaQuery();
  //  Serial.println("=======================");
  //  Serial.print(retornaQuery());
  //  Serial.println("=======================");
  //  Serial.println("teste json esp: ");
  //  Serial.print(retornaQuery());
  //  Serial.println();
  //  Serial.print("TELEMETRIA JSON: ");
  //  Serial.print(doc["tempo_executa_telemetria"]);
  //  chamaQuery = ;
  //  DeserializationError error = deserializeJson(doc, chamaQuery);
  //  if(error){
  //    Serial.print(F("DeserializacaoJSON() falhou"));
  //    Serial.print(error.f_str());
  //    return;
  //  }
  //  Serial.println(); 
  //  Serial.print("TELEMETRIA JSON: ");
    
    Serial.println();
    Serial.println("=========================================");
    Serial.println();
    Serial.println("RESULTADO DO SELECT BASE: ");
    Serial.println(tempoExecucaoTelemetria);
    Serial.println(tempoExecucaoGeolocalizacao);
    Serial.println(tempoExecucaoSoneca);
    Serial.println(tempoExecucaoThingSpeak);
    Serial.println(usuarioId);
    Serial.println(id);
    Serial.println(nome);
    Serial.println(urlThingSpeak);
    Serial.println(urlIpApi);
    Serial.println(secretKeyThingSpeak);
    Serial.println(resetarConfigWiFi);
    Serial.println(alertaEmail);
    Serial.println(gasAviso);
    Serial.println();
    Serial.println("=========================================");
    Serial.println();

    if(resetarConfigWiFi){
      wifiManager.resetSettings();
      ESP.restart();
    }
  
    if(alertaEmail and rand()%100 >= gasAviso){ //lerSensorMQ()){
     
     /** Habilitando o debug via porta Serial
     * None debug or 0
     * basic debug or 1
     */
     smtp.debug(1);
  
     /* Configurando a funcao callback para ppegar o envio do resultado */
     smtp.callback(smtpCallback);
     
     /* Declarando a sessao configuracao dos dados */
     ESP_Mail_Session session;
  
     /* Setando as configuracoes de sessao */
     session.server.host_name = SMTP_HOST;
     session.server.port = SMTP_PORT;
     session.login.email = AUTOR_EMAIL;
     session.login.password = AUTOR_SENHA;
     session.login.user_domain = "";
  
      /* Declarando a classe mensagem */
      SMTP_Message message;
  
      /* Setando o headers da mensagem */
      message.sender.name = "ESP";
      message.sender.email = AUTOR_EMAIL;
      message.subject = "ESP Teste Email";
      message.addRecipient("Matheus", RECIPIENT_EMAIL);
      //lerSensorMQ()
      /* Send HTML Message */
      String htmlMsg = "<div style=\"color:#2f4468;\"><h1>Ola Mundo!!!</h1><p>Enviado da placa ESP8266</p></div>";
      htmlMsg += "<p> Valor Gas Alerta: " + String(rand()%100) + " PPM </p>";
      message.html.content = htmlMsg.c_str();
      message.html.content = htmlMsg.c_str();
      message.html.charSet = "UTF-8";
      message.html.transfer_encoding = Content_Transfer_Encoding::enc_7bit;
  
  
      /* Envio de Mensagem por texto puro */
  //    String textMsg = "Ola envio automatico do sistema de monitoramento de Gas e Qualidade do Ar - ESP8266 ";
  //    textMsg += " \n Valor da Telemetria Gas: %2f", lerSensorMQ();  
  //    message.text.content = textMsg.c_str();
  //    message.text.charSet = "UTF-8";
  //    message.text.transfer_encoding = Content_Transfer_Encoding::enc_7bit;
  //
  //    message.priority = esp_mail_smtp_priority::esp_mail_smtp_priority_low;
  //    message.response.notify = esp_mail_smtp_notify_success | esp_mail_smtp_notify_failure | esp_mail_smtp_notify_delay;
  
      /* Configurando cabecalho de mensagem customizada */
  //    message.addHeader("Message-ID: <>");
      
      /* Conectando ao servidor com as configuracoes de sessao */
      if(!smtp.connect(&session))
        return;
  
      /* Iniciando o envio do Email e fechando a sessao */
      if(!MailClient.sendMail(&smtp, &message))
        Serial.println("Error ao enviar o email, "  + smtp.errorReason());
       
    }
  }else{
    Serial.println("ERRO MYSQL CONEXAO");
  }


if((millis() - ultimoTempoThingSpeak) > tempoExecucaoThingSpeak){
  if(WiFi.status() == WL_CONNECTED){
     enviaThingSpeak(urlThingSpeak, secretKeyThingSpeak, temperatura, umidade, rand()%100);  
  }
  ultimoTempoThingSpeak = millis();
}


if((millis() - ultimoTempoGeo) > tempoExecucaoGeolocalizacao){
    if(WiFi.status() == WL_CONNECTED){
//     Serial.println(lerSensorMQ());

     
//     Serial.println(lerSensorDhtTemperatura());
//     Serial.println(lerSensorDhtUmidade());
    
//     WiFiClient client;
     HTTPClient http;
//     Serial.println(servidor);
//     WiFiClient cliente;
     http.begin(urlIpApi.c_str()); //+ url

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
          deserializeJson(doc, payload);
          const char* statusJ = doc["status"];
          const char* pais = doc["country"];
          const char* codigoPais = doc["countryCode"];
          const char* regiao = doc["region"];
          const char* regiaoNome = doc["regionName"];
          const char* cidade = doc["city"];
          const char* cep = doc["zip"];
          String lat = doc["lat"];
          String lon = doc["lon"];
          const char* timezone = doc["timezone"];
          const char* isp = doc["isp"];
          const char * org = doc["org"];
          const char* asn = doc["as"];
          const char* ipExterno = doc["query"];
          
//          const char* nome = nome;
//          long idUserJ = usuarioId;

          sprintf(JSON, "{\"status\": \"%s\" ,\"country\": \"%s\" , \"countryCode\": \"%s\", \"region\": \"%s\", \"regionName\": \"%s\", \"city\": \"%s\", \"zip\": \"%s\",  \"lat\": %s, \"lon\": %s, \"timezone\": \"%s\",  \"isp\": \"%s\", \"org\": \"%s\", \"as\": \"%s\", \"query\": \"%s\", \"NOME\": \"%s\", \"IDUSUARIO\": \"%d\"}", statusJ, pais, codigoPais, regiao, regiaoNome, cidade, cep, lat.c_str(), lon.c_str(), timezone, isp, org, asn, ipExterno, nome.c_str(), usuarioId);
//          const char* 
          Serial.println("==============================");
          Serial.println(cidade);
          Serial.println(ipExterno);
          Serial.println("==============================");
          
          sprintf(query_insert_geolocalizacao, INSERT_SQL_GEOLOCALIZACAO, JSON);
          Serial.println(query_insert_geolocalizacao);
          cursor->execute(query_insert_geolocalizacao);
        if(enviou == true and cont == 1){
          Serial.print(cont);
          enviou = false;
        
//          if(montaDocConfirmaMac() == 1){
            Serial.println("MAC JA GRAVADO");
//          }else{
            deserializeJson(doc, payload);
            const char* ip_externo = doc["query"];
            const char* region = doc["region"];
            const char* city = doc["city"];
//            const char* ip = WiFi.localIP(); //WiFi.localIP().c_str()
            Serial.println(WiFi.localIP());
            Serial.println(WiFi.softAPmacAddress().c_str());
            Serial.println(ip_externo);
            Serial.println(region);
            Serial.println(city);
            //https://forum.arduino.cc/t/how-to-manipulate-ipaddress-variables-convert-to-string/222693/9
            // old school
            sprintf(JSON, "{\"MAC\": \"%s\" ,\"IP_INTERNO\": \"%s\" , \"query\": \"%s\", \"region\": \"%s\", \"city\": \"%s\", \"NOME\": \"%s\", \"IDUSUARIO\": \"%d\"}", WiFi.softAPmacAddress().c_str(), WiFi.localIP().toString().c_str(), ip_externo, region, city, nome.c_str(), usuarioId);
            Serial.print(JSON);
            sprintf(query_insert_modulo, INSERT_SQL_MODULO, JSON);
            Serial.println(query_insert_modulo);
            cursor->execute(query_insert_modulo);
//          }
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
          
        
    
  }
   ultimoTempoGeo = millis();
}

  /* =================================================================== */
  
  if((millis() - ultimoTempoTelemetria) > tempoExecucaoTelemetria){
    
    ultimoTempoTelemetria = millis();


    if(WiFi.status() == WL_CONNECTED){
//      Serial.println(lerSensorMQ());
//     Serial.println(lerSensorDhtTemperatura());
//     Serial.println(lerSensorDhtUmidade());
//     float num;
     
    
//     sprintf(num, "%f, %f, %f", selecionaConfiguracao());
     
//      doc["valor_analogico_gas"] = valor_analog;
//      doc["teste_sensor_2"] = 456;
//      serializeJson(doc, Serial);
//      String data = serializeJson(doc, Serial);
      
      if (conn.connected())
//        sprintf(JSON, "{\"SENSORG\": %d PPM,\"SENSORT\": %f *C, \"SENSORU\": %f %%}", lerSensorMQ(), lerSensorDhtTemperatura(), lerSensorDhtUmidade());
//        Serial.println(retornaQuery());
//        nome = retornaQuery();
      /* ==================================================================================================================================================== */
       
 
      /* ==================================================================================================================================================== */


        sprintf(JSON, "{\"SENSORG\": %d, \"SENSORT\": %.2f, \"SENSORU\": %.2f, \"NOME\": \"%s\", \"IDUSUARIO\": %d }", rand()%100, temperatura, umidade, nome.c_str(), usuarioId);
//        Serial.print("CHIP ID ESP");
//        Serial.print(ESP.getChipId());
        Serial.println();
        Serial.print(JSON);
        sprintf(query, INSERT_SQL, JSON);
        Serial.println(query);
        cursor->execute(query);
        
        /*==================================================*/
        
        
//        delete cursor;
//        conn.close();
      

   }
 }
 lastTime = millis();
 delete cursor;
 }
}

}
