import emscripten from "./build/hello_world.mjs";
import module from "./build/hello_world.wasm";

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
  }).then(module => {
    resolve({
      helloWorld: module.cwrap("hello_world", "string"),
    });
  }).catch(err => console.log(err));
});

export default {
  async fetch(request, env) {
    const wasm = await wasmModule;
    return new Response(wasm.helloWorld());
  }
}
