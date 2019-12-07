#include "web.h"

ESP8266WebServer server(80);

void handleRoot() {
  digitalWrite(led, 0);
  String msg = "Hello from ASP";
  IndexHtml page = IndexHtml(msg);
  server.send(200, "text/html", page.render());
  delay(500);
  digitalWrite(led, 1);
}

void handleJS() {
  digitalWrite(led, 0);
  MainJs page = MainJs();
  server.send(200, "text/javascript", page.render());
  delay(500);
  digitalWrite(led, 1);
}

void handleNotFound() {
  digitalWrite(led, 0);
  String args = "";
  for (uint8_t i = 0; i < server.args(); i++) {
    args += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  String method = (server.method() == HTTP_GET) ? "GET" : "POST";
  String uri = server.uri();
  ErrorHtml page = ErrorHtml(args, method, uri);
  server.send(404, "text/html", page.render());
  delay(250);
  digitalWrite(led, 1);
  delay(250);
  digitalWrite(led, 0);
  delay(250);
  digitalWrite(led, 1);
}
