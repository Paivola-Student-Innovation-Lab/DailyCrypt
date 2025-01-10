FROM --platform=linux/aarch64 arm64v8/rust:1.78-slim-buster as rust

WORKDIR /app

COPY .cargo/ .cargo/

RUN rustup target add wasm32-unknown-unknown
RUN cargo install -f wasm-bindgen-cli
RUN cargo install wasm-pack

COPY rustend/ rustend/

#RUN echo "[package.metadata.wasm-pack.profile.release]\nwasm-opt = false" >> rustend/Cargo.toml

RUN cd rustend && wasm-pack build --target web --out-dir pkg

FROM --platform=linux/aarch64 arm64v8/node:22-alpine3.18 as node

WORKDIR /app/client

COPY --from=rust /app/rustend/pkg/ ../rustend/pkg/

COPY client/package.json .
COPY client/package-lock.json .

RUN npm install

COPY client/ .

RUN npm run build:react

FROM --platform=linux/aarch64 arm64v8/nginx:latest as nginx

COPY --from=node /app/client/dist/ /usr/share/nginx/html
