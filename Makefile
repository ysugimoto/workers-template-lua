.PHONY: build clean

build:
	mkdir build || true
	docker run --rm -v ${PWD}/src:/src ysugimoto/webassembly-lua emcc-lua
	cp src/hello_world.{mjs,wasm} ./build/
