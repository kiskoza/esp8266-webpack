#include <ESP8266WiFi.h>
#include <WiFiClient.h>

#include "../dist/secrets.h"
#include "web.h"

const char* ssid = STASSID;
const char* password = STAPSK;

const int led = D4;

void setup(void) {
  pinMode(led, OUTPUT);
  digitalWrite(led, 0);
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  SPIFFS.begin();

  server.on("/", handleRoot);
  server.on("/main.js", handleJS);

  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");
}

void loop(void) {
  server.handleClient();
}
