"use strict";

// build/hello_world.mjs
var emscripten = (() => {
  var _scriptDir = import.meta.url;
  return function(emscripten2) {
    emscripten2 = emscripten2 || {};
    var Module = typeof emscripten2 != "undefined" ? emscripten2 : {};
    var readyPromiseResolve, readyPromiseReject;
    Module["ready"] = new Promise(function(resolve, reject) {
      readyPromiseResolve = resolve;
      readyPromiseReject = reject;
    });
    const document = { currentSript: "" };
    var moduleOverrides = Object.assign({}, Module);
    var arguments_ = [];
    var thisProgram = "./this.program";
    var quit_ = (status, toThrow) => {
      throw toThrow;
    };
    var ENVIRONMENT_IS_WEB = true;
    var ENVIRONMENT_IS_WORKER = false;
    var scriptDirectory = "";
    function locateFile(path) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory);
      }
      return scriptDirectory + path;
    }
    var read_, readAsync, readBinary, setWindowTitle;
    if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href;
      } else if (typeof document != "undefined" && document.currentScript) {
        scriptDirectory = document.currentScript.src;
      }
      if (_scriptDir) {
        scriptDirectory = _scriptDir;
      }
      if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
      } else {
        scriptDirectory = "";
      }
      {
        read_ = (url) => {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          xhr.send(null);
          return xhr.responseText;
        };
        if (ENVIRONMENT_IS_WORKER) {
          readBinary = (url) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.responseType = "arraybuffer";
            xhr.send(null);
            return new Uint8Array(xhr.response);
          };
        }
        readAsync = (url, onload, onerror) => {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = "arraybuffer";
          xhr.onload = () => {
            if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
              onload(xhr.response);
              return;
            }
            onerror();
          };
          xhr.onerror = onerror;
          xhr.send(null);
        };
      }
      setWindowTitle = (title) => document.title = title;
    } else {
    }
    var out = Module["print"] || console.log.bind(console);
    var err = Module["printErr"] || console.warn.bind(console);
    Object.assign(Module, moduleOverrides);
    moduleOverrides = null;
    if (Module["arguments"])
      arguments_ = Module["arguments"];
    if (Module["thisProgram"])
      thisProgram = Module["thisProgram"];
    if (Module["quit"])
      quit_ = Module["quit"];
    var tempRet0 = 0;
    var setTempRet0 = (value) => {
      tempRet0 = value;
    };
    var getTempRet0 = () => tempRet0;
    var wasmBinary;
    if (Module["wasmBinary"])
      wasmBinary = Module["wasmBinary"];
    var noExitRuntime = Module["noExitRuntime"] || true;
    if (typeof WebAssembly != "object") {
      abort("no native wasm support detected");
    }
    var wasmMemory;
    var ABORT = false;
    var EXITSTATUS;
    function getCFunc(ident) {
      var func = Module["_" + ident];
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
        if (returnType === "string") {
          return UTF8ToString(ret2);
        }
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
      function onDone(ret2) {
        if (stack !== 0)
          stackRestore(stack);
        return convertReturnValue(ret2);
      }
      ret = onDone(ret);
      return ret;
    }
    function cwrap(ident, returnType, argTypes, opts) {
      argTypes = argTypes || [];
      var numericArgs = argTypes.every(function(type) {
        return type === "number";
      });
      var numericRet = returnType !== "string";
      if (numericRet && numericArgs && !opts) {
        return getCFunc(ident);
      }
      return function() {
        return ccall(ident, returnType, argTypes, arguments, opts);
      };
    }
    var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : void 0;
    function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      while (heapOrArray[endPtr] && !(endPtr >= endIdx))
        ++endPtr;
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      } else {
        var str = "";
        while (idx < endPtr) {
          var u0 = heapOrArray[idx++];
          if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue;
          }
          var u1 = heapOrArray[idx++] & 63;
          if ((u0 & 224) == 192) {
            str += String.fromCharCode((u0 & 31) << 6 | u1);
            continue;
          }
          var u2 = heapOrArray[idx++] & 63;
          if ((u0 & 240) == 224) {
            u0 = (u0 & 15) << 12 | u1 << 6 | u2;
          } else {
            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
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
    function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
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
          heap[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx)
            break;
          heap[outIdx++] = 192 | u >> 6;
          heap[outIdx++] = 128 | u & 63;
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx)
            break;
          heap[outIdx++] = 224 | u >> 12;
          heap[outIdx++] = 128 | u >> 6 & 63;
          heap[outIdx++] = 128 | u & 63;
        } else {
          if (outIdx + 3 >= endIdx)
            break;
          heap[outIdx++] = 240 | u >> 18;
          heap[outIdx++] = 128 | u >> 12 & 63;
          heap[outIdx++] = 128 | u >> 6 & 63;
          heap[outIdx++] = 128 | u & 63;
        }
      }
      heap[outIdx] = 0;
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
    function allocateUTF8(str) {
      var size = lengthBytesUTF8(str) + 1;
      var ret = _malloc(size);
      if (ret)
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
    var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
    function updateGlobalBufferAndViews(buf) {
      buffer = buf;
      Module["HEAP8"] = HEAP8 = new Int8Array(buf);
      Module["HEAP16"] = HEAP16 = new Int16Array(buf);
      Module["HEAP32"] = HEAP32 = new Int32Array(buf);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
      Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
      Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
    }
    var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
    var wasmTable;
    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATMAIN__ = [];
    var __ATPOSTRUN__ = [];
    var runtimeInitialized = false;
    function keepRuntimeAlive() {
      return noExitRuntime;
    }
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
    function initRuntime() {
      runtimeInitialized = true;
      callRuntimeCallbacks(__ATINIT__);
    }
    function preMain() {
      callRuntimeCallbacks(__ATMAIN__);
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
    function addOnInit(cb) {
      __ATINIT__.unshift(cb);
    }
    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }
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
    function abort(what) {
      {
        if (Module["onAbort"]) {
          Module["onAbort"](what);
        }
      }
      what = "Aborted(" + what + ")";
      err(what);
      ABORT = true;
      EXITSTATUS = 1;
      what += ". Build with -sASSERTIONS for more info.";
      var e = new WebAssembly.RuntimeError(what);
      readyPromiseReject(e);
      throw e;
    }
    var dataURIPrefix = "data:application/octet-stream;base64,";
    function isDataURI(filename) {
      return filename.startsWith(dataURIPrefix);
    }
    var wasmBinaryFile;
    if (Module["locateFile"]) {
      wasmBinaryFile = "hello_world.wasm";
      if (!isDataURI(wasmBinaryFile)) {
        wasmBinaryFile = locateFile(wasmBinaryFile);
      }
    } else {
      wasmBinaryFile = new URL("hello_world.wasm", import.meta.url).toString();
    }
    function getBinary(file) {
      try {
        if (file == wasmBinaryFile && wasmBinary) {
          return new Uint8Array(wasmBinary);
        }
        if (readBinary) {
          return readBinary(file);
        } else {
          throw "both async and sync fetching of the wasm failed";
        }
      } catch (err2) {
        abort(err2);
      }
    }
    function getBinaryPromise() {
      if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
        if (typeof fetch == "function") {
          return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
            if (!response["ok"]) {
              throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
            }
            return response["arrayBuffer"]();
          }).catch(function() {
            return getBinary(wasmBinaryFile);
          });
        }
      }
      return Promise.resolve().then(function() {
        return getBinary(wasmBinaryFile);
      });
    }
    function createWasm() {
      var info = { "a": asmLibraryArg };
      function receiveInstance(instance, module2) {
        var exports2 = instance.exports;
        Module["asm"] = exports2;
        wasmMemory = Module["asm"]["E"];
        updateGlobalBufferAndViews(wasmMemory.buffer);
        wasmTable = Module["asm"]["I"];
        addOnInit(Module["asm"]["F"]);
        removeRunDependency("wasm-instantiate");
      }
      addRunDependency("wasm-instantiate");
      function receiveInstantiationResult(result) {
        receiveInstance(result["instance"]);
      }
      function instantiateArrayBuffer(receiver) {
        return getBinaryPromise().then(function(binary) {
          return WebAssembly.instantiate(binary, info);
        }).then(function(instance) {
          return instance;
        }).then(receiver, function(reason) {
          err("failed to asynchronously prepare wasm: " + reason);
          abort(reason);
        });
      }
      function instantiateAsync() {
        if (!wasmBinary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(wasmBinaryFile) && typeof fetch == "function") {
          return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
            var result = WebAssembly.instantiateStreaming(response, info);
            return result.then(receiveInstantiationResult, function(reason) {
              err("wasm streaming compile failed: " + reason);
              err("falling back to ArrayBuffer instantiation");
              return instantiateArrayBuffer(receiveInstantiationResult);
            });
          });
        } else {
          return instantiateArrayBuffer(receiveInstantiationResult);
        }
      }
      if (Module["instantiateWasm"]) {
        try {
          var exports = Module["instantiateWasm"](info, receiveInstance);
          return exports;
        } catch (e) {
          err("Module.instantiateWasm callback failed with error: " + e);
          return false;
        }
      }
      instantiateAsync().catch(readyPromiseReject);
      return {};
    }
    function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        var callback = callbacks.shift();
        if (typeof callback == "function") {
          callback(Module);
          continue;
        }
        var func = callback.func;
        if (typeof func == "number") {
          if (callback.arg === void 0) {
            getWasmTableEntry(func)();
          } else {
            getWasmTableEntry(func)(callback.arg);
          }
        } else {
          func(callback.arg === void 0 ? null : callback.arg);
        }
      }
    }
    function getWasmTableEntry(funcPtr) {
      return wasmTable.get(funcPtr);
    }
    function handleException(e) {
      if (e instanceof ExitStatus || e == "unwind") {
        return EXITSTATUS;
      }
      quit_(1, e);
    }
    var SYSCALLS = { varargs: void 0, get: function() {
      SYSCALLS.varargs += 4;
      var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
      return ret;
    }, getStr: function(ptr) {
      var ret = UTF8ToString(ptr);
      return ret;
    } };
    function ___syscall_dup3(fd, suggestFD, flags) {
    }
    function setErrNo(value) {
      HEAP32[___errno_location() >> 2] = value;
      return value;
    }
    function ___syscall_fcntl64(fd, cmd, varargs) {
      SYSCALLS.varargs = varargs;
      return 0;
    }
    function ___syscall_ioctl(fd, op, varargs) {
      SYSCALLS.varargs = varargs;
      return 0;
    }
    function ___syscall_lstat64(path, buf) {
    }
    function ___syscall_openat(dirfd, path, flags, varargs) {
      SYSCALLS.varargs = varargs;
    }
    function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
    }
    function ___syscall_rmdir(path) {
    }
    function ___syscall_unlinkat(dirfd, path, flags) {
    }
    function __emscripten_date_now() {
      return Date.now();
    }
    var nowIsMonotonic = true;
    function __emscripten_get_now_is_monotonic() {
      return nowIsMonotonic;
    }
    function __emscripten_throw_longjmp() {
      throw Infinity;
    }
    function __gmtime_js(time, tmPtr) {
      var date = new Date(HEAP32[time >> 2] * 1e3);
      HEAP32[tmPtr >> 2] = date.getUTCSeconds();
      HEAP32[tmPtr + 4 >> 2] = date.getUTCMinutes();
      HEAP32[tmPtr + 8 >> 2] = date.getUTCHours();
      HEAP32[tmPtr + 12 >> 2] = date.getUTCDate();
      HEAP32[tmPtr + 16 >> 2] = date.getUTCMonth();
      HEAP32[tmPtr + 20 >> 2] = date.getUTCFullYear() - 1900;
      HEAP32[tmPtr + 24 >> 2] = date.getUTCDay();
      var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
      var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
      HEAP32[tmPtr + 28 >> 2] = yday;
    }
    function __localtime_js(time, tmPtr) {
      var date = new Date(HEAP32[time >> 2] * 1e3);
      HEAP32[tmPtr >> 2] = date.getSeconds();
      HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
      HEAP32[tmPtr + 8 >> 2] = date.getHours();
      HEAP32[tmPtr + 12 >> 2] = date.getDate();
      HEAP32[tmPtr + 16 >> 2] = date.getMonth();
      HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
      HEAP32[tmPtr + 24 >> 2] = date.getDay();
      var start = new Date(date.getFullYear(), 0, 1);
      var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
      HEAP32[tmPtr + 28 >> 2] = yday;
      HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
      var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
      HEAP32[tmPtr + 32 >> 2] = dst;
    }
    function __mktime_js(tmPtr) {
      var date = new Date(HEAP32[tmPtr + 20 >> 2] + 1900, HEAP32[tmPtr + 16 >> 2], HEAP32[tmPtr + 12 >> 2], HEAP32[tmPtr + 8 >> 2], HEAP32[tmPtr + 4 >> 2], HEAP32[tmPtr >> 2], 0);
      var dst = HEAP32[tmPtr + 32 >> 2];
      var guessedOffset = date.getTimezoneOffset();
      var start = new Date(date.getFullYear(), 0, 1);
      var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dstOffset = Math.min(winterOffset, summerOffset);
      if (dst < 0) {
        HEAP32[tmPtr + 32 >> 2] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
      } else if (dst > 0 != (dstOffset == guessedOffset)) {
        var nonDstOffset = Math.max(winterOffset, summerOffset);
        var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
        date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
      }
      HEAP32[tmPtr + 24 >> 2] = date.getDay();
      var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
      HEAP32[tmPtr + 28 >> 2] = yday;
      HEAP32[tmPtr >> 2] = date.getSeconds();
      HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
      HEAP32[tmPtr + 8 >> 2] = date.getHours();
      HEAP32[tmPtr + 12 >> 2] = date.getDate();
      HEAP32[tmPtr + 16 >> 2] = date.getMonth();
      return date.getTime() / 1e3 | 0;
    }
    function _tzset_impl(timezone, daylight, tzname) {
      var currentYear = new Date().getFullYear();
      var winter = new Date(currentYear, 0, 1);
      var summer = new Date(currentYear, 6, 1);
      var winterOffset = winter.getTimezoneOffset();
      var summerOffset = summer.getTimezoneOffset();
      var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
      HEAP32[timezone >> 2] = stdTimezoneOffset * 60;
      HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
      function extractZone(date) {
        var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
        return match ? match[1] : "GMT";
      }
      var winterName = extractZone(winter);
      var summerName = extractZone(summer);
      var winterNamePtr = allocateUTF8(winterName);
      var summerNamePtr = allocateUTF8(summerName);
      if (summerOffset < winterOffset) {
        HEAPU32[tzname >> 2] = winterNamePtr;
        HEAPU32[tzname + 4 >> 2] = summerNamePtr;
      } else {
        HEAPU32[tzname >> 2] = summerNamePtr;
        HEAPU32[tzname + 4 >> 2] = winterNamePtr;
      }
    }
    function __tzset_js(timezone, daylight, tzname) {
      if (__tzset_js.called)
        return;
      __tzset_js.called = true;
      _tzset_impl(timezone, daylight, tzname);
    }
    function _abort() {
      abort("");
    }
    var _emscripten_get_now;
    _emscripten_get_now = () => performance.now();
    function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.copyWithin(dest, src, src + num);
    }
    function getHeapMax() {
      return 2147483648;
    }
    function emscripten_realloc_buffer(size) {
      try {
        wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1;
      } catch (e) {
      }
    }
    function _emscripten_resize_heap(requestedSize) {
      var oldSize = HEAPU8.length;
      requestedSize = requestedSize >>> 0;
      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        return false;
      }
      let alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
        var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
        var replacement = emscripten_realloc_buffer(newSize);
        if (replacement) {
          return true;
        }
      }
      return false;
    }
    var ENV = {};
    function getExecutableName() {
      return thisProgram || "./this.program";
    }
    function getEnvStrings() {
      if (!getEnvStrings.strings) {
        var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
        var env = { "USER": "web_user", "LOGNAME": "web_user", "PATH": "/", "PWD": "/", "HOME": "/home/web_user", "LANG": lang, "_": getExecutableName() };
        for (var x in ENV) {
          if (ENV[x] === void 0)
            delete env[x];
          else
            env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(x + "=" + env[x]);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    }
    function _environ_get(__environ, environ_buf) {
      var bufSize = 0;
      getEnvStrings().forEach(function(string, i) {
        var ptr = environ_buf + bufSize;
        HEAPU32[__environ + i * 4 >> 2] = ptr;
        writeAsciiToMemory(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    }
    function _environ_sizes_get(penviron_count, penviron_buf_size) {
      var strings = getEnvStrings();
      HEAPU32[penviron_count >> 2] = strings.length;
      var bufSize = 0;
      strings.forEach(function(string) {
        bufSize += string.length + 1;
      });
      HEAPU32[penviron_buf_size >> 2] = bufSize;
      return 0;
    }
    function _exit(status) {
      exit(status);
    }
    function _fd_close(fd) {
      return 52;
    }
    function _fd_read(fd, iov, iovcnt, pnum) {
      return 52;
    }
    function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
      return 70;
    }
    var printCharBuffers = [null, [], []];
    function printChar(stream, curr) {
      var buffer2 = printCharBuffers[stream];
      if (curr === 0 || curr === 10) {
        (stream === 1 ? out : err)(UTF8ArrayToString(buffer2, 0));
        buffer2.length = 0;
      } else {
        buffer2.push(curr);
      }
    }
    function _fd_write(fd, iov, iovcnt, pnum) {
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >> 2];
        var len = HEAPU32[iov + 4 >> 2];
        iov += 8;
        for (var j = 0; j < len; j++) {
          printChar(fd, HEAPU8[ptr + j]);
        }
        num += len;
      }
      HEAPU32[pnum >> 2] = num;
      return 0;
    }
    function _getTempRet0() {
      return getTempRet0();
    }
    function _setTempRet0(val) {
      setTempRet0(val);
    }
    function __isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    function __arraySum(array, index) {
      var sum = 0;
      for (var i = 0; i <= index; sum += array[i++]) {
      }
      return sum;
    }
    var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function __addDays(date, days) {
      var newDate = new Date(date.getTime());
      while (days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
        if (days > daysInCurrentMonth - newDate.getDate()) {
          days -= daysInCurrentMonth - newDate.getDate() + 1;
          newDate.setDate(1);
          if (currentMonth < 11) {
            newDate.setMonth(currentMonth + 1);
          } else {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear() + 1);
          }
        } else {
          newDate.setDate(newDate.getDate() + days);
          return newDate;
        }
      }
      return newDate;
    }
    function _strftime(s, maxsize, format, tm) {
      var tm_zone = HEAP32[tm + 40 >> 2];
      var date = { tm_sec: HEAP32[tm >> 2], tm_min: HEAP32[tm + 4 >> 2], tm_hour: HEAP32[tm + 8 >> 2], tm_mday: HEAP32[tm + 12 >> 2], tm_mon: HEAP32[tm + 16 >> 2], tm_year: HEAP32[tm + 20 >> 2], tm_wday: HEAP32[tm + 24 >> 2], tm_yday: HEAP32[tm + 28 >> 2], tm_isdst: HEAP32[tm + 32 >> 2], tm_gmtoff: HEAP32[tm + 36 >> 2], tm_zone: tm_zone ? UTF8ToString(tm_zone) : "" };
      var pattern = UTF8ToString(format);
      var EXPANSION_RULES_1 = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" };
      for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
      }
      var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      function leadingSomething(value, digits, character) {
        var str = typeof value == "number" ? value.toString() : value || "";
        while (str.length < digits) {
          str = character[0] + str;
        }
        return str;
      }
      function leadingNulls(value, digits) {
        return leadingSomething(value, digits, "0");
      }
      function compareByDay(date1, date2) {
        function sgn(value) {
          return value < 0 ? -1 : value > 0 ? 1 : 0;
        }
        var compare;
        if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
          if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
            compare = sgn(date1.getDate() - date2.getDate());
          }
        }
        return compare;
      }
      function getFirstWeekStartDate(janFourth) {
        switch (janFourth.getDay()) {
          case 0:
            return new Date(janFourth.getFullYear() - 1, 11, 29);
          case 1:
            return janFourth;
          case 2:
            return new Date(janFourth.getFullYear(), 0, 3);
          case 3:
            return new Date(janFourth.getFullYear(), 0, 2);
          case 4:
            return new Date(janFourth.getFullYear(), 0, 1);
          case 5:
            return new Date(janFourth.getFullYear() - 1, 11, 31);
          case 6:
            return new Date(janFourth.getFullYear() - 1, 11, 30);
        }
      }
      function getWeekBasedYear(date2) {
        var thisDate = __addDays(new Date(date2.tm_year + 1900, 0, 1), date2.tm_yday);
        var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
        var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
        var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
        var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
        if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
          if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
            return thisDate.getFullYear() + 1;
          } else {
            return thisDate.getFullYear();
          }
        } else {
          return thisDate.getFullYear() - 1;
        }
      }
      var EXPANSION_RULES_2 = { "%a": function(date2) {
        return WEEKDAYS[date2.tm_wday].substring(0, 3);
      }, "%A": function(date2) {
        return WEEKDAYS[date2.tm_wday];
      }, "%b": function(date2) {
        return MONTHS[date2.tm_mon].substring(0, 3);
      }, "%B": function(date2) {
        return MONTHS[date2.tm_mon];
      }, "%C": function(date2) {
        var year = date2.tm_year + 1900;
        return leadingNulls(year / 100 | 0, 2);
      }, "%d": function(date2) {
        return leadingNulls(date2.tm_mday, 2);
      }, "%e": function(date2) {
        return leadingSomething(date2.tm_mday, 2, " ");
      }, "%g": function(date2) {
        return getWeekBasedYear(date2).toString().substring(2);
      }, "%G": function(date2) {
        return getWeekBasedYear(date2);
      }, "%H": function(date2) {
        return leadingNulls(date2.tm_hour, 2);
      }, "%I": function(date2) {
        var twelveHour = date2.tm_hour;
        if (twelveHour == 0)
          twelveHour = 12;
        else if (twelveHour > 12)
          twelveHour -= 12;
        return leadingNulls(twelveHour, 2);
      }, "%j": function(date2) {
        return leadingNulls(date2.tm_mday + __arraySum(__isLeapYear(date2.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date2.tm_mon - 1), 3);
      }, "%m": function(date2) {
        return leadingNulls(date2.tm_mon + 1, 2);
      }, "%M": function(date2) {
        return leadingNulls(date2.tm_min, 2);
      }, "%n": function() {
        return "\n";
      }, "%p": function(date2) {
        if (date2.tm_hour >= 0 && date2.tm_hour < 12) {
          return "AM";
        } else {
          return "PM";
        }
      }, "%S": function(date2) {
        return leadingNulls(date2.tm_sec, 2);
      }, "%t": function() {
        return "	";
      }, "%u": function(date2) {
        return date2.tm_wday || 7;
      }, "%U": function(date2) {
        var days = date2.tm_yday + 7 - date2.tm_wday;
        return leadingNulls(Math.floor(days / 7), 2);
      }, "%V": function(date2) {
        var val = Math.floor((date2.tm_yday + 7 - (date2.tm_wday + 6) % 7) / 7);
        if ((date2.tm_wday + 371 - date2.tm_yday - 2) % 7 <= 2) {
          val++;
        }
        if (!val) {
          val = 52;
          var dec31 = (date2.tm_wday + 7 - date2.tm_yday - 1) % 7;
          if (dec31 == 4 || dec31 == 5 && __isLeapYear(date2.tm_year % 400 - 1)) {
            val++;
          }
        } else if (val == 53) {
          var jan1 = (date2.tm_wday + 371 - date2.tm_yday) % 7;
          if (jan1 != 4 && (jan1 != 3 || !__isLeapYear(date2.tm_year)))
            val = 1;
        }
        return leadingNulls(val, 2);
      }, "%w": function(date2) {
        return date2.tm_wday;
      }, "%W": function(date2) {
        var days = date2.tm_yday + 7 - (date2.tm_wday + 6) % 7;
        return leadingNulls(Math.floor(days / 7), 2);
      }, "%y": function(date2) {
        return (date2.tm_year + 1900).toString().substring(2);
      }, "%Y": function(date2) {
        return date2.tm_year + 1900;
      }, "%z": function(date2) {
        var off = date2.tm_gmtoff;
        var ahead = off >= 0;
        off = Math.abs(off) / 60;
        off = off / 60 * 100 + off % 60;
        return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
      }, "%Z": function(date2) {
        return date2.tm_zone;
      }, "%%": function() {
        return "%";
      } };
      pattern = pattern.replace(/%%/g, "\0\0");
      for (var rule in EXPANSION_RULES_2) {
        if (pattern.includes(rule)) {
          pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
        }
      }
      pattern = pattern.replace(/\0\0/g, "%");
      var bytes = intArrayFromString(pattern, false);
      if (bytes.length > maxsize) {
        return 0;
      }
      writeArrayToMemory(bytes, s);
      return bytes.length - 1;
    }
    function _system(command) {
      if (!command)
        return 0;
      setErrNo(52);
      return -1;
    }
    function intArrayFromString(stringy, dontAddNull, length) {
      var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
      var u8array = new Array(len);
      var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
      if (dontAddNull)
        u8array.length = numBytesWritten;
      return u8array;
    }
    var asmLibraryArg = { "w": ___syscall_dup3, "d": ___syscall_fcntl64, "z": ___syscall_ioctl, "r": ___syscall_lstat64, "g": ___syscall_openat, "s": ___syscall_renameat, "t": ___syscall_rmdir, "e": ___syscall_unlinkat, "a": __emscripten_date_now, "A": __emscripten_get_now_is_monotonic, "p": __emscripten_throw_longjmp, "B": __gmtime_js, "C": __localtime_js, "i": __mktime_js, "j": __tzset_js, "D": _abort, "k": _emscripten_memcpy_big, "q": _emscripten_resize_heap, "u": _environ_get, "v": _environ_sizes_get, "l": _exit, "c": _fd_close, "y": _fd_read, "o": _fd_seek, "f": _fd_write, "h": _getTempRet0, "x": invoke_vii, "b": _setTempRet0, "n": _strftime, "m": _system };
    var asm = createWasm();
    var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
      return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["F"]).apply(null, arguments);
    };
    var _hello_world = Module["_hello_world"] = function() {
      return (_hello_world = Module["_hello_world"] = Module["asm"]["G"]).apply(null, arguments);
    };
    var _main = Module["_main"] = function() {
      return (_main = Module["_main"] = Module["asm"]["H"]).apply(null, arguments);
    };
    var _malloc = Module["_malloc"] = function() {
      return (_malloc = Module["_malloc"] = Module["asm"]["J"]).apply(null, arguments);
    };
    var ___errno_location = Module["___errno_location"] = function() {
      return (___errno_location = Module["___errno_location"] = Module["asm"]["K"]).apply(null, arguments);
    };
    var _setThrew = Module["_setThrew"] = function() {
      return (_setThrew = Module["_setThrew"] = Module["asm"]["L"]).apply(null, arguments);
    };
    var stackSave = Module["stackSave"] = function() {
      return (stackSave = Module["stackSave"] = Module["asm"]["M"]).apply(null, arguments);
    };
    var stackRestore = Module["stackRestore"] = function() {
      return (stackRestore = Module["stackRestore"] = Module["asm"]["N"]).apply(null, arguments);
    };
    var stackAlloc = Module["stackAlloc"] = function() {
      return (stackAlloc = Module["stackAlloc"] = Module["asm"]["O"]).apply(null, arguments);
    };
    function invoke_vii(index, a1, a2) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0)
          throw e;
        _setThrew(1, 0);
      }
    }
    Module["cwrap"] = cwrap;
    var calledRun;
    function ExitStatus(status) {
      this.name = "ExitStatus";
      this.message = "Program terminated with exit(" + status + ")";
      this.status = status;
    }
    var calledMain = false;
    dependenciesFulfilled = function runCaller() {
      if (!calledRun)
        run();
      if (!calledRun)
        dependenciesFulfilled = runCaller;
    };
    function callMain(args) {
      var entryFunction = Module["_main"];
      var argc = 0;
      var argv = 0;
      try {
        var ret = entryFunction(argc, argv);
        exit(ret, true);
        return ret;
      } catch (e) {
        return handleException(e);
      } finally {
        calledMain = true;
      }
    }
    function run(args) {
      args = args || arguments_;
      if (runDependencies > 0) {
        return;
      }
      preRun();
      if (runDependencies > 0) {
        return;
      }
      function doRun() {
        if (calledRun)
          return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT)
          return;
        initRuntime();
        preMain();
        readyPromiseResolve(Module);
        if (Module["onRuntimeInitialized"])
          Module["onRuntimeInitialized"]();
        if (shouldRunNow)
          callMain(args);
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
      EXITSTATUS = status;
      procExit(status);
    }
    function procExit(code) {
      EXITSTATUS = code;
      if (!keepRuntimeAlive()) {
        if (Module["onExit"])
          Module["onExit"](code);
        ABORT = true;
      }
      quit_(code, new ExitStatus(code));
    }
    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function")
        Module["preInit"] = [Module["preInit"]];
      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()();
      }
    }
    var shouldRunNow = true;
    if (Module["noInitialRun"])
      shouldRunNow = false;
    run();
    return emscripten2.ready;
  };
})();
var hello_world_default = emscripten;

// index.mjs
import module from "./build/hello_world.wasm";
var wasmModule = new Promise((resolve, reject) => {
  hello_world_default({
    instantiateWasm(info, receiveInstance) {
      const instance = new WebAssembly.Instance(module, info);
      receiveInstance(instance);
      return instance.exports;
    },
    locateFile(path, scriptDirectory) {
      return path;
    }
  }).then((module2) => {
    resolve({
      helloWorld: module2.cwrap("hello_world", "string")
    });
  }).catch((err) => console.log(err));
});
var workers_template_lua_default = {
  async fetch(request, env) {
    const wasm = await wasmModule;
    return new Response(wasm.helloWorld());
  }
};
export {
  workers_template_lua_default as default
};
