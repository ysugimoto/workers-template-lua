#include <stdio.h>
#include <emscripten.h>

int main(int argc, char ** argv) {
  printf("Hello World\n");
}

void EMSCRIPTEN_KEEPALIVE myFunction() {
  printf("MyFunction Called\n");
}
