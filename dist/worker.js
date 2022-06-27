"use strict";

// dist/worker.mjs
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toBinary = /* @__PURE__ */ (() => {
  var table = new Uint8Array(128);
  for (var i = 0; i < 64; i++)
    table[i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i * 4 - 205] = i;
  return (base64) => {
    var n = base64.length, bytes = new Uint8Array((n - (base64[n - 1] == "=") - (base64[n - 2] == "=")) * 3 / 4 | 0);
    for (var i2 = 0, j = 0; i2 < n; ) {
      var c0 = table[base64.charCodeAt(i2++)], c1 = table[base64.charCodeAt(i2++)];
      var c2 = table[base64.charCodeAt(i2++)], c3 = table[base64.charCodeAt(i2++)];
      bytes[j++] = c0 << 2 | c1 >> 4;
      bytes[j++] = c1 << 4 | c2 >> 2;
      bytes[j++] = c2 << 6 | c3;
    }
    return bytes;
  };
})();
var require_module = __commonJS({
  "build/module.js"(exports, module) {
    "use strict";
    var emscripten2 = function() {
      var _scriptDir = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : void 0;
      return function(emscripten3) {
        emscripten3 = emscripten3 || {};
        var Module = typeof emscripten3 !== "undefined" ? emscripten3 : {};
        const document2 = { currentSript: "" };
        var moduleOverrides = {};
        var key;
        for (key in Module) {
          if (Module.hasOwnProperty(key)) {
            moduleOverrides[key] = Module[key];
          }
        }
        Module["arguments"] = [];
        Module["thisProgram"] = "./this.program";
        Module["quit"] = function(status, toThrow) {
          throw toThrow;
        };
        Module["preRun"] = [];
        Module["postRun"] = [];
        var ENVIRONMENT_IS_WEB = true;
        var ENVIRONMENT_IS_WORKER = false;
        var scriptDirectory = "";
        function locateFile(path) {
          if (Module["locateFile"]) {
            return Module["locateFile"](path, scriptDirectory);
          } else {
            return scriptDirectory + path;
          }
        }
        if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = self.location.href;
          } else if (document2.currentScript) {
            scriptDirectory = document2.currentScript.src;
          }
          if (_scriptDir) {
            scriptDirectory = _scriptDir;
          }
          if (scriptDirectory.indexOf("blob:") !== 0) {
            scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1);
          } else {
            scriptDirectory = "";
          }
          Module["read"] = function shell_read(url) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.send(null);
            return xhr.responseText;
          };
          if (ENVIRONMENT_IS_WORKER) {
            Module["readBinary"] = function readBinary(url) {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              xhr.responseType = "arraybuffer";
              xhr.send(null);
              return new Uint8Array(xhr.response);
            };
          }
          Module["readAsync"] = function readAsync(url, onload, onerror) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onload = function xhr_onload() {
              if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                onload(xhr.response);
                return;
              }
              onerror();
            };
            xhr.onerror = onerror;
            xhr.send(null);
          };
          Module["setWindowTitle"] = function(title) {
            document2.title = title;
          };
        } else {
        }
        var out = Module["print"] || (typeof console !== "undefined" ? console.log.bind(console) : typeof print !== "undefined" ? print : null);
        var err = Module["printErr"] || (typeof printErr !== "undefined" ? printErr : typeof console !== "undefined" && console.warn.bind(console) || out);
        for (key in moduleOverrides) {
          if (moduleOverrides.hasOwnProperty(key)) {
            Module[key] = moduleOverrides[key];
          }
        }
        moduleOverrides = void 0;
        var STACK_ALIGN = 16;
        function dynamicAlloc(size) {
          var ret = HEAP32[DYNAMICTOP_PTR >> 2];
          var end = ret + size + 15 & -16;
          if (end <= _emscripten_get_heap_size()) {
            HEAP32[DYNAMICTOP_PTR >> 2] = end;
          } else {
            var success = _emscripten_resize_heap(end);
            if (!success)
              return 0;
          }
          return ret;
        }
        function getNativeTypeSize(type) {
          switch (type) {
            case "i1":
            case "i8":
              return 1;
            case "i16":
              return 2;
            case "i32":
              return 4;
            case "i64":
              return 8;
            case "float":
              return 4;
            case "double":
              return 8;
            default: {
              if (type[type.length - 1] === "*") {
                return 4;
              } else if (type[0] === "i") {
                var bits = parseInt(type.substr(1));
                assert(bits % 8 === 0, "getNativeTypeSize invalid bits " + bits + ", type " + type);
                return bits / 8;
              } else {
                return 0;
              }
            }
          }
        }
        function warnOnce(text) {
          if (!warnOnce.shown)
            warnOnce.shown = {};
          if (!warnOnce.shown[text]) {
            warnOnce.shown[text] = 1;
            err(text);
          }
        }
        var asm2wasmImports = { "f64-rem": function(x, y) {
          return x % y;
        }, "debugger": function() {
          debugger;
        } };
        var jsCallStartIndex = 1;
        var functionPointers = new Array(0);
        function convertJsFunctionToWasm(func, sig) {
          var typeSection = [1, 0, 1, 96];
          var sigRet = sig.slice(0, 1);
          var sigParam = sig.slice(1);
          var typeCodes = { "i": 127, "j": 126, "f": 125, "d": 124 };
          typeSection.push(sigParam.length);
          for (var i = 0; i < sigParam.length; ++i) {
            typeSection.push(typeCodes[sigParam[i]]);
          }
          if (sigRet == "v") {
            typeSection.push(0);
          } else {
            typeSection = typeSection.concat([1, typeCodes[sigRet]]);
          }
          typeSection[1] = typeSection.length - 2;
          var bytes = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0].concat(typeSection, [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0]));
          var module2 = new WebAssembly.Module(bytes);
          var instance = new WebAssembly.Instance(module2, { e: { f: func } });
          var wrappedFunc = instance.exports.f;
          return wrappedFunc;
        }
        var funcWrappers = {};
        function dynCall(sig, ptr, args) {
          if (args && args.length) {
            return Module["dynCall_" + sig].apply(null, [ptr].concat(args));
          } else {
            return Module["dynCall_" + sig].call(null, ptr);
          }
        }
        var tempRet0 = 0;
        var setTempRet0 = function(value) {
          tempRet0 = value;
        };
        var getTempRet0 = function() {
          return tempRet0;
        };
        if (typeof WebAssembly !== "object") {
          err("no native wasm support detected");
        }
        var wasmMemory;
        var wasmTable;
        var ABORT = false;
        var EXITSTATUS = 0;
        function assert(condition, text) {
          if (!condition) {
            abort("Assertion failed: " + text);
          }
        }
        function getCFunc(ident) {
          var func = Module["_" + ident];
          assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
          return func;
        }
        function ccall(ident, returnType, argTypes, args, opts) {
          var toC = { "string": function(str) {
            var ret2 = 0;
            if (str !== null && str !== void 0 && str !== 0) {
              var len = (str.length << 2) + 1;
              ret2 = stackAlloc(len);
              stringToUTF8(str, ret2, len);
            }
            return ret2;
          }, "array": function(arr) {
            var ret2 = stackAlloc(arr.length);
            writeArrayToMemory(arr, ret2);
            return ret2;
          } };
          function convertReturnValue(ret2) {
            if (returnType === "string")
              return UTF8ToString(ret2);
            if (returnType === "boolean")
              return Boolean(ret2);
            return ret2;
          }
          var func = getCFunc(ident);
          var cArgs = [];
          var stack = 0;
          if (args) {
            for (var i = 0; i < args.length; i++) {
              var converter = toC[argTypes[i]];
              if (converter) {
                if (stack === 0)
                  stack = stackSave();
                cArgs[i] = converter(args[i]);
              } else {
                cArgs[i] = args[i];
              }
            }
          }
          var ret = func.apply(null, cArgs);
          ret = convertReturnValue(ret);
          if (stack !== 0)
            stackRestore(stack);
          return ret;
        }
        function setValue(ptr, value, type, noSafe) {
          type = type || "i8";
          if (type.charAt(type.length - 1) === "*")
            type = "i32";
          switch (type) {
            case "i1":
              HEAP8[ptr >> 0] = value;
              break;
            case "i8":
              HEAP8[ptr >> 0] = value;
              break;
            case "i16":
              HEAP16[ptr >> 1] = value;
              break;
            case "i32":
              HEAP32[ptr >> 2] = value;
              break;
            case "i64":
              tempI64 = [value >>> 0, (tempDouble = value, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
              break;
            case "float":
              HEAPF32[ptr >> 2] = value;
              break;
            case "double":
              HEAPF64[ptr >> 3] = value;
              break;
            default:
              abort("invalid type for setValue: " + type);
          }
        }
        var ALLOC_NONE = 3;
        var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : void 0;
        function UTF8ArrayToString(u8Array, idx, maxBytesToRead) {
          var endIdx = idx + maxBytesToRead;
          var endPtr = idx;
          while (u8Array[endPtr] && !(endPtr >= endIdx))
            ++endPtr;
          if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
            return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
          } else {
            var str = "";
            while (idx < endPtr) {
              var u0 = u8Array[idx++];
              if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue;
              }
              var u1 = u8Array[idx++] & 63;
              if ((u0 & 224) == 192) {
                str += String.fromCharCode((u0 & 31) << 6 | u1);
                continue;
              }
              var u2 = u8Array[idx++] & 63;
              if ((u0 & 240) == 224) {
                u0 = (u0 & 15) << 12 | u1 << 6 | u2;
              } else {
                u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u8Array[idx++] & 63;
              }
              if (u0 < 65536) {
                str += String.fromCharCode(u0);
              } else {
                var ch = u0 - 65536;
                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
              }
            }
          }
          return str;
        }
        function UTF8ToString(ptr, maxBytesToRead) {
          return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
        }
        function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
          if (!(maxBytesToWrite > 0))
            return 0;
          var startIdx = outIdx;
          var endIdx = outIdx + maxBytesToWrite - 1;
          for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343) {
              var u1 = str.charCodeAt(++i);
              u = 65536 + ((u & 1023) << 10) | u1 & 1023;
            }
            if (u <= 127) {
              if (outIdx >= endIdx)
                break;
              outU8Array[outIdx++] = u;
            } else if (u <= 2047) {
              if (outIdx + 1 >= endIdx)
                break;
              outU8Array[outIdx++] = 192 | u >> 6;
              outU8Array[outIdx++] = 128 | u & 63;
            } else if (u <= 65535) {
              if (outIdx + 2 >= endIdx)
                break;
              outU8Array[outIdx++] = 224 | u >> 12;
              outU8Array[outIdx++] = 128 | u >> 6 & 63;
              outU8Array[outIdx++] = 128 | u & 63;
            } else {
              if (outIdx + 3 >= endIdx)
                break;
              outU8Array[outIdx++] = 240 | u >> 18;
              outU8Array[outIdx++] = 128 | u >> 12 & 63;
              outU8Array[outIdx++] = 128 | u >> 6 & 63;
              outU8Array[outIdx++] = 128 | u & 63;
            }
          }
          outU8Array[outIdx] = 0;
          return outIdx - startIdx;
        }
        function stringToUTF8(str, outPtr, maxBytesToWrite) {
          return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        }
        function lengthBytesUTF8(str) {
          var len = 0;
          for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343)
              u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
            if (u <= 127)
              ++len;
            else if (u <= 2047)
              len += 2;
            else if (u <= 65535)
              len += 3;
            else
              len += 4;
          }
          return len;
        }
        var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : void 0;
        function allocateUTF8OnStack(str) {
          var size = lengthBytesUTF8(str) + 1;
          var ret = stackAlloc(size);
          stringToUTF8Array(str, HEAP8, ret, size);
          return ret;
        }
        function writeArrayToMemory(array, buffer2) {
          HEAP8.set(array, buffer2);
        }
        function writeAsciiToMemory(str, buffer2, dontAddNull) {
          for (var i = 0; i < str.length; ++i) {
            HEAP8[buffer2++ >> 0] = str.charCodeAt(i);
          }
          if (!dontAddNull)
            HEAP8[buffer2 >> 0] = 0;
        }
        function demangle(func) {
          return func;
        }
        function demangleAll(text) {
          var regex = /__Z[\w\d_]+/g;
          return text.replace(regex, function(x) {
            var y = demangle(x);
            return x === y ? x : y + " [" + x + "]";
          });
        }
        function jsStackTrace() {
          var err2 = new Error();
          if (!err2.stack) {
            try {
              throw new Error(0);
            } catch (e) {
              err2 = e;
            }
            if (!err2.stack) {
              return "(no stack trace available)";
            }
          }
          return err2.stack.toString();
        }
        var WASM_PAGE_SIZE = 65536;
        function alignUp(x, multiple) {
          if (x % multiple > 0) {
            x += multiple - x % multiple;
          }
          return x;
        }
        var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
        function updateGlobalBufferViews() {
          Module["HEAP8"] = HEAP8 = new Int8Array(buffer);
          Module["HEAP16"] = HEAP16 = new Int16Array(buffer);
          Module["HEAP32"] = HEAP32 = new Int32Array(buffer);
          Module["HEAPU8"] = HEAPU8 = new Uint8Array(buffer);
          Module["HEAPU16"] = HEAPU16 = new Uint16Array(buffer);
          Module["HEAPU32"] = HEAPU32 = new Uint32Array(buffer);
          Module["HEAPF32"] = HEAPF32 = new Float32Array(buffer);
          Module["HEAPF64"] = HEAPF64 = new Float64Array(buffer);
        }
        var STACK_BASE = 4e3, DYNAMIC_BASE = 5246880, DYNAMICTOP_PTR = 3968;
        var TOTAL_STACK = 5242880;
        var INITIAL_TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 16777216;
        if (INITIAL_TOTAL_MEMORY < TOTAL_STACK)
          err("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + INITIAL_TOTAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")");
        if (Module["buffer"]) {
          buffer = Module["buffer"];
        } else {
          if (typeof WebAssembly === "object" && typeof WebAssembly.Memory === "function") {
            wasmMemory = new WebAssembly.Memory({ "initial": INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE });
            buffer = wasmMemory.buffer;
          } else {
            buffer = new ArrayBuffer(INITIAL_TOTAL_MEMORY);
          }
        }
        updateGlobalBufferViews();
        HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
        function callRuntimeCallbacks(callbacks) {
          while (callbacks.length > 0) {
            var callback = callbacks.shift();
            if (typeof callback == "function") {
              callback();
              continue;
            }
            var func = callback.func;
            if (typeof func === "number") {
              if (callback.arg === void 0) {
                Module["dynCall_v"](func);
              } else {
                Module["dynCall_vi"](func, callback.arg);
              }
            } else {
              func(callback.arg === void 0 ? null : callback.arg);
            }
          }
        }
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        var runtimeExited = false;
        function preRun() {
          if (Module["preRun"]) {
            if (typeof Module["preRun"] == "function")
              Module["preRun"] = [Module["preRun"]];
            while (Module["preRun"].length) {
              addOnPreRun(Module["preRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function ensureInitRuntime() {
          if (runtimeInitialized)
            return;
          runtimeInitialized = true;
          callRuntimeCallbacks(__ATINIT__);
        }
        function preMain() {
          callRuntimeCallbacks(__ATMAIN__);
        }
        function exitRuntime() {
          runtimeExited = true;
        }
        function postRun() {
          if (Module["postRun"]) {
            if (typeof Module["postRun"] == "function")
              Module["postRun"] = [Module["postRun"]];
            while (Module["postRun"].length) {
              addOnPostRun(Module["postRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
          __ATPRERUN__.unshift(cb);
        }
        function addOnPostRun(cb) {
          __ATPOSTRUN__.unshift(cb);
        }
        var Math_abs = Math.abs;
        var Math_ceil = Math.ceil;
        var Math_floor = Math.floor;
        var Math_min = Math.min;
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        function addRunDependency(id) {
          runDependencies++;
          if (Module["monitorRunDependencies"]) {
            Module["monitorRunDependencies"](runDependencies);
          }
        }
        function removeRunDependency(id) {
          runDependencies--;
          if (Module["monitorRunDependencies"]) {
            Module["monitorRunDependencies"](runDependencies);
          }
          if (runDependencies == 0) {
            if (runDependencyWatcher !== null) {
              clearInterval(runDependencyWatcher);
              runDependencyWatcher = null;
            }
            if (dependenciesFulfilled) {
              var callback = dependenciesFulfilled;
              dependenciesFulfilled = null;
              callback();
            }
          }
        }
        Module["preloadedImages"] = {};
        Module["preloadedAudios"] = {};
        var dataURIPrefix = "data:application/octet-stream;base64,";
        function isDataURI(filename) {
          return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0;
        }
        var wasmBinaryFile = "module.wasm";
        if (!isDataURI(wasmBinaryFile)) {
          wasmBinaryFile = locateFile(wasmBinaryFile);
        }
        function getBinary() {
          try {
            if (Module["wasmBinary"]) {
              return new Uint8Array(Module["wasmBinary"]);
            }
            if (Module["readBinary"]) {
              return Module["readBinary"](wasmBinaryFile);
            } else {
              throw "both async and sync fetching of the wasm failed";
            }
          } catch (err2) {
            abort(err2);
          }
        }
        function getBinaryPromise() {
          if (!Module["wasmBinary"] && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function") {
            return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
              if (!response["ok"]) {
                throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
              }
              return response["arrayBuffer"]();
            }).catch(function() {
              return getBinary();
            });
          }
          return new Promise(function(resolve, reject) {
            resolve(getBinary());
          });
        }
        function createWasm(env) {
          var info = { "env": env, "global": { "NaN": NaN, Infinity: Infinity }, "global.Math": Math, "asm2wasm": asm2wasmImports };
          function receiveInstance(instance, module2) {
            var exports2 = instance.exports;
            Module["asm"] = exports2;
            removeRunDependency("wasm-instantiate");
          }
          addRunDependency("wasm-instantiate");
          if (Module["instantiateWasm"]) {
            try {
              return Module["instantiateWasm"](info, receiveInstance);
            } catch (e) {
              err("Module.instantiateWasm callback failed with error: " + e);
              return false;
            }
          }
          function receiveInstantiatedSource(output) {
            receiveInstance(output["instance"]);
          }
          function instantiateArrayBuffer(receiver) {
            getBinaryPromise().then(function(binary) {
              return WebAssembly.instantiate(binary, info);
            }).then(receiver, function(reason) {
              err("failed to asynchronously prepare wasm: " + reason);
              abort(reason);
            });
          }
          if (!Module["wasmBinary"] && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
            WebAssembly.instantiateStreaming(fetch(wasmBinaryFile, { credentials: "same-origin" }), info).then(receiveInstantiatedSource, function(reason) {
              err("wasm streaming compile failed: " + reason);
              err("falling back to ArrayBuffer instantiation");
              instantiateArrayBuffer(receiveInstantiatedSource);
            });
          } else {
            instantiateArrayBuffer(receiveInstantiatedSource);
          }
          return {};
        }
        Module["asm"] = function(global, env, providedBuffer) {
          env["memory"] = wasmMemory;
          env["table"] = wasmTable = new WebAssembly.Table({ "initial": 8, "maximum": 8, "element": "anyfunc" });
          env["__memory_base"] = 1024;
          env["__table_base"] = 0;
          var exports2 = createWasm(env);
          return exports2;
        };
        var tempDoublePtr = 3984;
        var PATH = { splitPath: function(filename) {
          var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
          return splitPathRe.exec(filename).slice(1);
        }, normalizeArray: function(parts, allowAboveRoot) {
          var up = 0;
          for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === ".") {
              parts.splice(i, 1);
            } else if (last === "..") {
              parts.splice(i, 1);
              up++;
            } else if (up) {
              parts.splice(i, 1);
              up--;
            }
          }
          if (allowAboveRoot) {
            for (; up; up--) {
              parts.unshift("..");
            }
          }
          return parts;
        }, normalize: function(path) {
          var isAbsolute = path.charAt(0) === "/", trailingSlash = path.substr(-1) === "/";
          path = PATH.normalizeArray(path.split("/").filter(function(p) {
            return !!p;
          }), !isAbsolute).join("/");
          if (!path && !isAbsolute) {
            path = ".";
          }
          if (path && trailingSlash) {
            path += "/";
          }
          return (isAbsolute ? "/" : "") + path;
        }, dirname: function(path) {
          var result = PATH.splitPath(path), root = result[0], dir = result[1];
          if (!root && !dir) {
            return ".";
          }
          if (dir) {
            dir = dir.substr(0, dir.length - 1);
          }
          return root + dir;
        }, basename: function(path) {
          if (path === "/")
            return "/";
          var lastSlash = path.lastIndexOf("/");
          if (lastSlash === -1)
            return path;
          return path.substr(lastSlash + 1);
        }, extname: function(path) {
          return PATH.splitPath(path)[3];
        }, join: function() {
          var paths = Array.prototype.slice.call(arguments, 0);
          return PATH.normalize(paths.join("/"));
        }, join2: function(l, r) {
          return PATH.normalize(l + "/" + r);
        } };
        var SYSCALLS = { buffers: [null, [], []], printChar: function(stream, curr) {
          var buffer2 = SYSCALLS.buffers[stream];
          if (curr === 0 || curr === 10) {
            (stream === 1 ? out : err)(UTF8ArrayToString(buffer2, 0));
            buffer2.length = 0;
          } else {
            buffer2.push(curr);
          }
        }, varargs: 0, get: function(varargs) {
          SYSCALLS.varargs += 4;
          var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
          return ret;
        }, getStr: function() {
          var ret = UTF8ToString(SYSCALLS.get());
          return ret;
        }, get64: function() {
          var low = SYSCALLS.get(), high = SYSCALLS.get();
          return low;
        }, getZero: function() {
          SYSCALLS.get();
        } };
        function ___syscall140(which, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(), offset_high = SYSCALLS.get(), offset_low = SYSCALLS.get(), result = SYSCALLS.get(), whence = SYSCALLS.get();
            return 0;
          } catch (e) {
            if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
              abort(e);
            return -e.errno;
          }
        }
        function flush_NO_FILESYSTEM() {
          var fflush = Module["_fflush"];
          if (fflush)
            fflush(0);
          var buffers = SYSCALLS.buffers;
          if (buffers[1].length)
            SYSCALLS.printChar(1, 10);
          if (buffers[2].length)
            SYSCALLS.printChar(2, 10);
        }
        function ___syscall146(which, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.get(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
            var ret = 0;
            for (var i = 0; i < iovcnt; i++) {
              var ptr = HEAP32[iov + i * 8 >> 2];
              var len = HEAP32[iov + (i * 8 + 4) >> 2];
              for (var j = 0; j < len; j++) {
                SYSCALLS.printChar(stream, HEAPU8[ptr + j]);
              }
              ret += len;
            }
            return ret;
          } catch (e) {
            if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
              abort(e);
            return -e.errno;
          }
        }
        function ___syscall54(which, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            return 0;
          } catch (e) {
            if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
              abort(e);
            return -e.errno;
          }
        }
        function ___syscall6(which, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD();
            return 0;
          } catch (e) {
            if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
              abort(e);
            return -e.errno;
          }
        }
        function _emscripten_get_heap_size() {
          return HEAP8.length;
        }
        function abortOnCannotGrowMemory(requestedSize) {
          abort("OOM");
        }
        function emscripten_realloc_buffer(size) {
          var PAGE_MULTIPLE = 65536;
          size = alignUp(size, PAGE_MULTIPLE);
          var oldSize = buffer.byteLength;
          try {
            var result = wasmMemory.grow((size - oldSize) / 65536);
            if (result !== (-1 | 0)) {
              buffer = wasmMemory.buffer;
              return true;
            } else {
              return false;
            }
          } catch (e) {
            return false;
          }
        }
        function _emscripten_resize_heap(requestedSize) {
          var oldSize = _emscripten_get_heap_size();
          var PAGE_MULTIPLE = 65536;
          var LIMIT = 2147483648 - PAGE_MULTIPLE;
          if (requestedSize > LIMIT) {
            return false;
          }
          var MIN_TOTAL_MEMORY = 16777216;
          var newSize = Math.max(oldSize, MIN_TOTAL_MEMORY);
          while (newSize < requestedSize) {
            if (newSize <= 536870912) {
              newSize = alignUp(2 * newSize, PAGE_MULTIPLE);
            } else {
              newSize = Math.min(alignUp((3 * newSize + 2147483648) / 4, PAGE_MULTIPLE), LIMIT);
            }
          }
          if (!emscripten_realloc_buffer(newSize)) {
            return false;
          }
          updateGlobalBufferViews();
          return true;
        }
        function _emscripten_memcpy_big(dest, src, num) {
          HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
        }
        function ___setErrNo(value) {
          if (Module["___errno_location"])
            HEAP32[Module["___errno_location"]() >> 2] = value;
          return value;
        }
        var ASSERTIONS = false;
        var asmGlobalArg = {};
        var asmLibraryArg = { "abort": abort, "setTempRet0": setTempRet0, "getTempRet0": getTempRet0, "___setErrNo": ___setErrNo, "___syscall140": ___syscall140, "___syscall146": ___syscall146, "___syscall54": ___syscall54, "___syscall6": ___syscall6, "_emscripten_get_heap_size": _emscripten_get_heap_size, "_emscripten_memcpy_big": _emscripten_memcpy_big, "_emscripten_resize_heap": _emscripten_resize_heap, "abortOnCannotGrowMemory": abortOnCannotGrowMemory, "emscripten_realloc_buffer": emscripten_realloc_buffer, "flush_NO_FILESYSTEM": flush_NO_FILESYSTEM, "tempDoublePtr": tempDoublePtr, "DYNAMICTOP_PTR": DYNAMICTOP_PTR };
        var asm = Module["asm"](asmGlobalArg, asmLibraryArg, buffer);
        Module["asm"] = asm;
        var ___errno_location = Module["___errno_location"] = function() {
          return Module["asm"]["___errno_location"].apply(null, arguments);
        };
        var _emscripten_replace_memory = Module["_emscripten_replace_memory"] = function() {
          return Module["asm"]["_emscripten_replace_memory"].apply(null, arguments);
        };
        var _free = Module["_free"] = function() {
          return Module["asm"]["_free"].apply(null, arguments);
        };
        var _main = Module["_main"] = function() {
          return Module["asm"]["_main"].apply(null, arguments);
        };
        var _malloc = Module["_malloc"] = function() {
          return Module["asm"]["_malloc"].apply(null, arguments);
        };
        var _memcpy = Module["_memcpy"] = function() {
          return Module["asm"]["_memcpy"].apply(null, arguments);
        };
        var _memset = Module["_memset"] = function() {
          return Module["asm"]["_memset"].apply(null, arguments);
        };
        var _myFunction = Module["_myFunction"] = function() {
          return Module["asm"]["_myFunction"].apply(null, arguments);
        };
        var _sbrk = Module["_sbrk"] = function() {
          return Module["asm"]["_sbrk"].apply(null, arguments);
        };
        var establishStackSpace = Module["establishStackSpace"] = function() {
          return Module["asm"]["establishStackSpace"].apply(null, arguments);
        };
        var stackAlloc = Module["stackAlloc"] = function() {
          return Module["asm"]["stackAlloc"].apply(null, arguments);
        };
        var stackRestore = Module["stackRestore"] = function() {
          return Module["asm"]["stackRestore"].apply(null, arguments);
        };
        var stackSave = Module["stackSave"] = function() {
          return Module["asm"]["stackSave"].apply(null, arguments);
        };
        var dynCall_ii = Module["dynCall_ii"] = function() {
          return Module["asm"]["dynCall_ii"].apply(null, arguments);
        };
        var dynCall_iiii = Module["dynCall_iiii"] = function() {
          return Module["asm"]["dynCall_iiii"].apply(null, arguments);
        };
        var dynCall_jiji = Module["dynCall_jiji"] = function() {
          return Module["asm"]["dynCall_jiji"].apply(null, arguments);
        };
        Module["asm"] = asm;
        Module["setValue"] = setValue;
        Module["then"] = function(func) {
          if (Module["calledRun"]) {
            func(Module);
          } else {
            var old = Module["onRuntimeInitialized"];
            Module["onRuntimeInitialized"] = function() {
              if (old)
                old();
              func(Module);
            };
          }
          return Module;
        };
        function ExitStatus(status) {
          this.name = "ExitStatus";
          this.message = "Program terminated with exit(" + status + ")";
          this.status = status;
        }
        ExitStatus.prototype = new Error();
        ExitStatus.prototype.constructor = ExitStatus;
        var calledMain = false;
        dependenciesFulfilled = function runCaller() {
          if (!Module["calledRun"])
            run();
          if (!Module["calledRun"])
            dependenciesFulfilled = runCaller;
        };
        Module["callMain"] = function callMain(args) {
          args = args || [];
          ensureInitRuntime();
          var argc = args.length + 1;
          var argv = stackAlloc((argc + 1) * 4);
          HEAP32[argv >> 2] = allocateUTF8OnStack(Module["thisProgram"]);
          for (var i = 1; i < argc; i++) {
            HEAP32[(argv >> 2) + i] = allocateUTF8OnStack(args[i - 1]);
          }
          HEAP32[(argv >> 2) + argc] = 0;
          try {
            var ret = Module["_main"](argc, argv, 0);
            exit(ret, true);
          } catch (e) {
            if (e instanceof ExitStatus) {
              return;
            } else if (e == "SimulateInfiniteLoop") {
              Module["noExitRuntime"] = true;
              return;
            } else {
              var toLog = e;
              if (e && typeof e === "object" && e.stack) {
                toLog = [e, e.stack];
              }
              err("exception thrown: " + toLog);
              Module["quit"](1, e);
            }
          } finally {
            calledMain = true;
          }
        };
        function run(args) {
          args = args || Module["arguments"];
          if (runDependencies > 0) {
            return;
          }
          preRun();
          if (runDependencies > 0)
            return;
          if (Module["calledRun"])
            return;
          function doRun() {
            if (Module["calledRun"])
              return;
            Module["calledRun"] = true;
            if (ABORT)
              return;
            ensureInitRuntime();
            preMain();
            if (Module["onRuntimeInitialized"])
              Module["onRuntimeInitialized"]();
            if (Module["_main"] && shouldRunNow)
              Module["callMain"](args);
            postRun();
          }
          if (Module["setStatus"]) {
            Module["setStatus"]("Running...");
            setTimeout(function() {
              setTimeout(function() {
                Module["setStatus"]("");
              }, 1);
              doRun();
            }, 1);
          } else {
            doRun();
          }
        }
        Module["run"] = run;
        function exit(status, implicit) {
          if (implicit && Module["noExitRuntime"] && status === 0) {
            return;
          }
          if (Module["noExitRuntime"]) {
          } else {
            ABORT = true;
            EXITSTATUS = status;
            exitRuntime();
            if (Module["onExit"])
              Module["onExit"](status);
          }
          Module["quit"](status, new ExitStatus(status));
        }
        function abort(what) {
          if (Module["onAbort"]) {
            Module["onAbort"](what);
          }
          if (what !== void 0) {
            out(what);
            err(what);
            what = JSON.stringify(what);
          } else {
            what = "";
          }
          ABORT = true;
          EXITSTATUS = 1;
          throw "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
        }
        Module["abort"] = abort;
        if (Module["preInit"]) {
          if (typeof Module["preInit"] == "function")
            Module["preInit"] = [Module["preInit"]];
          while (Module["preInit"].length > 0) {
            Module["preInit"].pop()();
          }
        }
        var shouldRunNow = true;
        if (Module["noInitialRun"]) {
          shouldRunNow = false;
        }
        Module["noExitRuntime"] = true;
        run();
        return emscripten3;
      };
    }();
    if (typeof exports === "object" && typeof module === "object")
      module.exports = emscripten2;
    else if (typeof define === "function" && define["amd"])
      define([], function() {
        return emscripten2;
      });
    else if (typeof exports === "object")
      exports["emscripten"] = emscripten2;
  }
});
var module_default = __toBinary("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cjYCBAVB2BFBADYCAEHkEUEANgIAIAEgAkEDcjYCBCABIAJqQQRqIgAgACgCAEEBcjYCAAsgCiQCIAFBCGoPC0HcESgCACICIABLBEBB3BEgAiAAayICNgIAQegRIABB6BEoAgAiAWoiAzYCACADIAJBAXI2AgQgASAAQQNyNgIEIAokAiABQQhqDwsgCiEBIABBL2oiBEGoFSgCAAR/QbAVKAIABUGwFUGAIDYCAEGsFUGAIDYCAEG0FUF/NgIAQbgVQX82AgBBvBVBADYCAEGMFUEANgIAQagVIAFBcHFB2KrVqgVzNgIAQYAgCyIBaiIGQQAgAWsiCHEiBSAATQRAIAokAkEADwtBiBUoAgAiAQRAIAVBgBUoAgAiA2oiByADTSAHIAFLcgRAIAokAkEADwsLIABBMGohBwJAAkBBjBUoAgBBBHEEQEEAIQIFAkACQAJAQegRKAIAIgFFDQBBkBUhAwNAAkAgAygCACIJIAFNBEAgCSADKAIEaiABSw0BCyADKAIIIgMNAQwCCwsgCCAGIAJrcSICQf////8HSQRAIAIQIiIBIAMoAgAgAygCBGpGBEAgAUF/Rw0GBQwDCwVBACECCwwCC0EAECIiAUF/RgR/QQAFQYAVKAIAIgYgBSABQawVKAIAIgJBf2oiA2pBACACa3EgAWtBACABIANxG2oiAmohAyACQf////8HSSACIABLcQR/QYgVKAIAIggEQCADIAZNIAMgCEtyBEBBACECDAULCyABIAIQIiIDRg0FIAMhAQwCBUEACwshAgwBCyABQX9HIAJB/////wdJcSAHIAJLcUUEQCABQX9GBEBBACECDAIFDAQLAAtBsBUoAgAiAyAEIAJrakEAIANrcSIDQf////8HTw0CQQAgAmshBCADECJBf0YEfyAEECIaQQAFIAIgA2ohAgwDCyECC0GMFUGMFSgCAEEEcjYCAAsgBUH/////B0kEQCAFECIhAUEAECIiAyABayIEIABBKGpLIQUgBCACIAUbIQIgBUEBcyABQX9GciABQX9HIANBf0dxIAEgA0lxQQFzckUNAQsMAQtBgBUgAkGAFSgCAGoiAzYCACADQYQVKAIASwRAQYQVIAM2AgALQegRKAIAIgUEQAJAQZAVIQMCQAJAA0AgASADKAIAIgQgAygCBCIGakYNASADKAIIIgMNAAsM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BCMCQSBqJAIgBEEIaiIDIABBPGooAgA2AgAgA0EEaiABQiCIPgIAIANBCGogAT4CACADQQxqIAQiADYCACADQRBqIAI2AgBBjAEgAxACEBdBAEgEfiAAQn83AwBCfwUgACkDAAshASAEJAIgAQsbACAAQYBgSwR/QcAVQQAgAGs2AgBBfwUgAAsLBQBBwBULdgEDfyMCIQQjAkEgaiQCIAQiA0EQaiEFIABBJGpBAjYCACAAKAIAQcAAcUUEQCADIABBPGooAgA2AgAgA0EEakGTqAE2AgAgA0EIaiAFNgIAQTYgAxAEBEAgAEHLAGpBfzoAAAsLIAAgASACEBUhACAEJAIgAAuBAgEEfwJAAkAgAkEQaiIEKAIAIgMNACACEBsEf0EABSAEKAIAIQMMAQshAgwBCyADIAJBFGoiBSgCACIEayABSQRAIAJBJGooAgAhAyACIAAgASADQQNxQQJqEQAAIQIMAQsgAUUgAkHLAGosAABBAEhyBH9BAAUCfyABIQMDQCAAIANBf2oiBmosAABBCkcEQCAGBEAgBiEDDAIFQQAMAwsACwsgAkEkaigCACEEIAIgACADIARBA3FBAmoRAAAiAiADSQ0CIAAgA2ohACABIANrIQEgBSgCACEEIAMLCyECIAQgACABECAaIAUgASAFKAIAajYCACABIAJqIQILIAILfgECfyAAQcoAaiICLAAAIQEgAiABIAFB/wFqcjoAACAAKAIAIgFBCHEEfyAAIAFBIHI2AgBBfwUgAEEIakEANgIAIABBBGpBADYCACAAQRxqIABBLGooAgAiATYCACAAQRRqIAE2AgAgAEEQaiABIABBMGooAgBqNgIAQQALC4sBAQN/AkACQCAAIgJBA3FFDQAgACEBAkADQCABLAAARQ0BIAFBAWoiASIAQQNxDQALIAEhAAwBCwwBCwNAIABBBGohASAAKAIAIgNB//37d2ogA0GAgYKEeHFBgIGChHhzcUUEQCABIQAMAQsLIANB/wFxBEADQCAAQQFqIgAsAAANAAsLCyAAIAJrCyABAX8gASEDIAIoAkwaIAAgAyACEBoiACABIAAgA0cbC58BAQV/IwIhAyMCQRBqJAIgAyIEQQo6AAACQAJAIABBEGoiAigCACIBDQAgABAbBH9BfwUgAigCACEBDAELIQEMAQsgAEEUaiICKAIAIgUgAUkEQEEKIgEgACwAS0cEQCACIAVBAWo2AgAgBUEKOgAADAILCyAAIARBASAAKAIkQQNxQQJqEQAAQQFGBH8gBC0AAAVBfwshAQsgAyQCIAELdgECf0GQCSgCACIBKAJMQX9KBH9BAQVBAAsaIAAQHCICIAAgAiABEB1HQR90QR91QQBIBH9BfwUCfyABLABLQQpHBEAgAUEUaiICKAIAIgAgASgCEEkEQCACIABBAWo2AgAgAEEKOgAAQQAMAgsLIAEQHgsLGgvGAwEDfyACQYDAAE4EQCAAIAEgAhAHGiAADwsgACEEIAAgAmohAyAAQQNxIAFBA3FGBEADQCAAQQNxBEAgAkUEQCAEDwsgACABLAAAOgAAIABBAWohACABQQFqIQEgAkEBayECDAELCyADQXxxIgJBQGohBQNAIAAgBUwEQCAAIAEoAgA2AgAgACABKAIENgIEIAAgASgCCDYCCCAAIAEoAgw2AgwgACABKAIQNgIQIAAgASgCFDYCFCAAIAEoAhg2AhggACABKAIcNgIcIAAgASgCIDYCICAAIAEoAiQ2AiQgACABKAIoNgIoIAAgASgCLDYCLCAAIAEoAjA2AjAgACABKAI0NgI0IAAgASgCODYCOCAAIAEoAjw2AjwgAEFAayEAIAFBQGshAQwBCwsDQCAAIAJIBEAgACABKAIANgIAIABBBGohACABQQRqIQEMAQsLBSADQQRrIQIDQCAAIAJIBEAgACABLAAAOgAAIAAgASwAAToAASAAIAEsAAI6AAIgACABLAADOgADIABBBGohACABQQRqIQEMAQsLCwNAIAAgA0gEQCAAIAEsAAA6AAAgAEEBaiEAIAFBAWohAQwBCwsgBAuYAgEEfyAAIAJqIQQgAUH/AXEhASACQcMATgRAA0AgAEEDcQRAIAAgAToAACAAQQFqIQAMAQsLIAFBCHQgAXIgAUEQdHIgAUEYdHIhAyAEQXxxIgVBQGohBgNAIAAgBkwEQCAAIAM2AgAgACADNgIEIAAgAzYCCCAAIAM2AgwgACADNgIQIAAgAzYCFCAAIAM2AhggACADNgIcIAAgAzYCICAAIAM2AiQgACADNgIoIAAgAzYCLCAAIAM2AjAgACADNgI0IAAgAzYCOCAAIAM2AjwgAEFAayEADAELCwNAIAAgBUgEQCAAIAM2AgAgAEEEaiEADAELCwsDQCAAIARIBEAgACABOgAAIABBAWohAAwBCwsgBCACawtSAQN/EAYhAyAAIwEoAgAiAmoiASACSCAAQQBKcSABQQBIcgRAIAEQCRpBDBABQX8PCyABIANKBEAgARAIRQRAQQwQAUF/DwsLIwEgATYCACACCwwAIAEgAEEBcREBAAsTACABIAIgAyAAQQNxQQJqEQAACwgAQQAQAEEACwgAQQEQAEEACwgAQQIQAEIACygBAX4gASACrSADrUIghoQgBCAAQQFxQQZqEQIAIgVCIIinEAogBacLC1sGAEGACAsBBQBBjAgLAQEAQaQICw4BAAAAAQAAAMgEAAAABABBvAgLAQEAQcsICwUK/////wBBkQkLIAQAAEhlbGxvIFdvcmxkAE15RnVuY3Rpb24gQ2FsbGVk");
var module_default2 = (imports) => WebAssembly.instantiate(module_default, imports).then((result) => result.instance.exports);
var import_module3 = __toESM(require_module(), 1);
var emscripten_module = new Promise((resolve, reject) => {
  (0, import_module3.default)({
    instantiateWasm(info, receive) {
      let instance = new WebAssembly.Instance(module_default2, info);
      receive(instance);
      return instance.exports;
    }
  });
});
var workers_template_lua_default = {
  async fetch(request, env) {
    const m = await emscripten_module;
    return new Response("OK");
  }
};
"use strict";
export {
  workers_template_lua_default as default
};
//# sourceMappingURL=worker.js.map
