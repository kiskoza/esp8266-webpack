#ifndef TEMPLATE_PAGE_H
#define TEMPLATE_PAGE_H

class TemplatePage {
protected:
  String filename;
  String empty;

  TemplatePage(String _filename) : filename(_filename), empty("") {}
public:
  virtual String& params(const String& param) = 0;

  String render() {
    if(!SPIFFS.exists(this->filename)) {
      return "File not found";
    }

    File file = SPIFFS.open(this->filename, "r");
    if (!file) {
      return "Unable to open file";
    }

    String retval = "";
    String keyBuffer = "";
    int val;
    char ch;

    while ((val = file.read()) != -1) {
      ch = char(val);

      if(ch == '%') {
        keyBuffer = "";
        bool found = false;
        while (!found && (val = file.read()) != -1) {
          ch = char(val);
          if (ch == '%') {
            found = true;
          } else {
            keyBuffer += ch;
          }
        }

        if (val == -1 && !found) {
          return "Cannot process template";
        }

        retval += this->params(keyBuffer);
      } else {
        retval += ch;
      }
    }

    return retval;
  }
};

#endif
