default:
	echo "read README.md"
setup:
	rustup update stable
	rustup target add wasm32-unknown-unknown
	cargo install -f wasm-bindgen-cli
	cargo install wasm-pack
run:
	export PATH="$PATH:$HOME/.cargo/bin"
	cd client; npm install
	cd client; npm run build
run-dev:
	export PATH="$PATH:$HOME/.cargo/bin"
	cd client; npm install
	cd client; npm run dev
