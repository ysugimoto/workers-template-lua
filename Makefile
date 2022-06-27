.PHONY: build

build:
	docker run \
		--rm \
		-v ${PWD}:/src \
		emscripten/emsdk:3.1.1 \
		emcc -O2 \
		-s WASM=1 \
		-s EXPORTED_RUNTIME_METHODS='["cwrap", "setValue"]' \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s DYNAMIC_EXECUTION=0 \
		-s TEXTDECODER=1 \
		-s MODULARIZE=1 \
		-s ENVIRONMENT=web \
		-s EXPORT_ES6=1 \
		-s EXPORT_NAME=emscripten \
		-s FILESYSTEM=0 \
		-s SINGLE_FILE=0 \
		-s VERBOSE=0 \
		--pre-js "./pre.js" \
		-o ./build/wasm-module.mjs \
		./src/main.c
