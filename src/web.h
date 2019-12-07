#ifndef WEB_H
#define WEB_H

#include <ESP8266WebServer.h>
#include <FS.h>

#include "../lib/template_page.h"
#include "../dist/html.h"

extern ESP8266WebServer server;
extern const int led;

void handleRoot();
void handleJS();
void handleNotFound();

#endif
