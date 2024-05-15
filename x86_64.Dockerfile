FROM rust:1.77-slim-buster

WORKDIR /app

COPY .cargo/ .cargo/

RUN rustup target add wasm32-unknown-unknown
RUN cargo install -f wasm-bindgen-cli
RUN cargo install wasm-pack

COPY rustend/ rustend/

RUN cd rustend && wasm-pack build --target web --out-dir pkg

FROM node:22-alpine3.18

WORKDIR /app/client

COPY --from=0 /app/rustend/pkg/ ../rustend/pkg/

COPY client/package.json .
COPY client/package-lock.json .

RUN npm install

COPY client/ .

RUN npm run build:react

FROM nginx:latest

COPY --from=1 /app/client/dist/ /usr/share/nginx/html
