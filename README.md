# DailyCrypt

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![pipeline status](https://github.com/paivola-student-innovation-lab/dailycrypt/actions/workflows/docker.yml/badge.svg)](https://github.com/Paivola-Student-Innovation-Lab/DailyCrypt/actions/workflows/docker.yml)

DailyCrypt is safe and easy to use encryption webapp. DailyCrypt doesn't have a backend and it uses the AES encryption algorithm. The purpose of this open source project is to bring simple encryption available to everyone for free.

## Container installation

### First time setup

Make sure you have Docker installed

Pull the Docker container with `docker pull ghcr.io/paivola-student-innovation-lab/dailycrypt`

### Running the container

To start the container, run `docker run -p 80:80 ghcr.io/paivola-student-innovation-lab/dailycrypt`

You can use the `latest` tag to automatically install and use the latest version of the DailyCrypt container:
`docker run -p 80:80 ghcr.io/paivola-student-innovation-lab/dailycrypt:latest`

### Using the app

Go to https://localhost and DailyCrypt should be running there.

## Installation from source

### First time setup

Install rustup from https://rustup.rs/ or with `snap install rustup`

Restart console after installing rust

```console
rustup update stable
rustup target add wasm32-unknown-unknown
cargo install -f wasm-bindgen-cli
cargo install wasm-pack
```

#### Add wasm-pack to path

Run the following in your home directory (you can get there by running cd)

```console
nano .bashrc
```

Enter the following at the bottom of the .bashrc file, save and restart terminal

```json
export PATH="$PATH:$HOME/.cargo/bin"
```

### Running app

#### Install packages

Run the following in the project directory

```console
cd client/
npm install
```

#### Build

Run the following in the project directory

```console
cd client/
npm run build
```

#### Run

```console
npm preview
```

You can also optionally use the developer environment by using `npm run dev`

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

Licensed under GNU General Public License v3.0 or later

## Project status

This project is currently under development by PSIL
