# workers-template-lua

Run your Lua code in Cloudflare Workers!

## Requirements

- `docker` - To compile wasm from lua script

This project uses `docker` in order to build wasm in separated environment.
Make sure you can install Docker.

For building wasm from Lua code, we're using original image which is developed other repository.

- [ysugimoto/webassembly-lua](https://github.com/ysugimoto/webassembly-lua)
- [Docker Hub](https://hub.docker.com/repository/docker/ysugimoto/webassembly-lua)

To modify Lua code, see above repository's instruction.

## Usage

```
Note:
This project uses wrangler v2 so install and build locally.
If you use @cloudflare/wrangler, please take care of conflict of global installation.
```

```shell
# Checkout project
git clone https://github.com/ysugimoto/workers-template-lua.git
cd workers-template-lua

# Install dependencies
yarn install

# Run local worker
# Note this project uses local installed wrangler(v2) command
yarn wranger dev
```

Then you can see the worker works on http://localhost:8787

## License

MIT

## Author

ysugimoto

