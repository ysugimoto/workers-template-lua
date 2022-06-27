import emscripten from "./build/wasm-module.mjs";
import module from "./build/wasm-module.wasm";

const wasmModule = new Promise((resolve, reject) => {
  emscripten({
    instantiateWasm(info, receiveInstance) {
      const instance = new WebAssembly.Instance(module, info);
      receiveInstance(instance);
      return instance.exports;
    },
    locateFile(path, scriptDirectory) {
      return path;
    },
  }).then(mod => {
    resolve({
      myFunction: mod.cwrap("myFunction", "string"),
    });
  }).catch(err => console.log(err));
});

export default {
  async fetch(request, env) {
    const wasm = await wasmModule;
    const d = wasm.myFunction();
    return new Response(d);
  }
}
