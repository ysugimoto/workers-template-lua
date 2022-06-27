.PHONY: build

build:
	docker run \
		--rm \
		-v ${PWD}:/src \
		trzeci/emscripten:sdk-tag-1.38.32-64bit \
		emcc -O2 \
		-s WASM=1 \
		-s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap", "setValue"]' \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s DYNAMIC_EXECUTION=0 \
		-s TEXTDECODER=1 \
		-s MODULARIZE=1 \
		-s ENVIRONMENT='web' \
		-s EXPORT_NAME="emscripten" \
		--pre-js "./pre.js" \
		-o ./build/module.js ./src/main.c
	cp ./build/module.wasm ./dist/module.wasm
