#include <stdio.h>
#include <emscripten.h>

char message[] = "MyFunction Called";

void _main(int argc, char ** argv) {
  printf("Hello World\n");
}

const char* EMSCRIPTEN_KEEPALIVE myFunction() {
  return &message[0];
}
