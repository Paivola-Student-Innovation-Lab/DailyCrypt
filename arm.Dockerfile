FROM --platform=linux/arm64 arm64v8/rust:1.77-slim-buster as rust

RUN apt-get update && apt-get install -y \
    cmake \
    ninja-build \
    python3 \
    clang

RUN git clone https://github.com/WebAssembly/binaryen.git /binaryen \
    && cd /binaryen \
    && cmake . -GNinja \
    && ninja \
    && cp bin/wasm-opt /usr/local/bin/

WORKDIR /app

COPY .cargo/ .cargo/

RUN rustup target add wasm32-unknown-unknown
RUN cargo install -f wasm-bindgen-cli
RUN cargo install wasm-pack

COPY rustend/ rustend/

RUN cd rustend && wasm-pack build --target web --out-dir pkg

FROM --platform=linux/arm64 arm64v8/node:22-alpine3.18 as node

WORKDIR /app/client

COPY --from=rust /app/rustend/pkg/ ../rustend/pkg/

COPY client/package.json .
COPY client/package-lock.json .

RUN npm install

COPY client/ .

RUN npm run build:react

FROM --platform=linux/arm64 arm64v8/nginx:latest as nginx

COPY --from=node /app/client/dist/ /usr/share/nginx/html
