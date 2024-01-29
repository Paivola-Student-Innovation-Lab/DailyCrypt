# Dailycrypt

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![pipeline status](https://gitlab.psil.fi/encryptausnettisivu/encryptausnettisivu/badges/dev/pipeline.svg)](https://gitlab.psil.fi/encryptausnettisivu/encryptausnettisivu/commits/dev)

Dailycrypt is safe and easy to use encryption webapp. Dailycrypt doesn't have a backend and it uses the AES encryption algorithm. The purpose of this open source project is to bring simple encryption available to everyone for free.

## Installation

### First time setup

Install rustup from https://rustup.rs/ or with snap install rustup

Restart console after installing rust

```console
rustup update stable
rustup target add wasm32-unknown-unknown
cargo install -f wasm-bindgen-cli
cargo install wasm-pack
```

### Running app

#### Install packages
###### Run the following in the project directory

```console
cd client/
npm install
```

#### Add wasm-pack to path
###### Run the following in your home directory (you can get there by running cd)
```console
nano .bashrc
```

###### Enter the following at the bottom of the .bashrc file, save and restart terminal
```json
export PATH="$PATH:$HOME/.cargo/bin"
```

#### Build
###### Run the following in the project directory
```console
cd client/
npm run build
```

#### Run

```console
npm start
```

###### You can also optionally build and run at the same time by running npm run dev

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

Licensed under GNU General Public License v3.0 or later

## Project status

This project is currently under development by PSIL
