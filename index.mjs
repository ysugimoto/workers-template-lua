import wasm from "./build/module.wasm";
import emscripten from "./build/module.js";

let emscripten_module = new Promise((resolve, reject) => {
  emscripten({
    instantiateWasm(info, receive) {
      const instance = new WebAssembly.Instance(wasm, info);
      receive(instance);
      return instance.exports;
    },
    locateFile(path, scriptDirectory) {
      return path;
    },
  }).then(module => {
    resolve(module);
  });
})

export default {
  async fetch(request, env) {
    const m = await emscripten_module;
    return new Response("OK");
  }
}
