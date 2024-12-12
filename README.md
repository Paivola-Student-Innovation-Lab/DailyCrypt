# DailyCrypt

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![pipeline status](https://github.com/paivola-student-innovation-lab/dailycrypt/actions/workflows/docker.yml/badge.svg)](https://github.com/Paivola-Student-Innovation-Lab/DailyCrypt/actions/workflows/docker.yml)

DailyCrypt is safe and easy to use encryption webapp. DailyCrypt doesn't have a backend and it uses the AES encryption algorithm. The purpose of this open source project is to bring simple encryption available to everyone for free.

## Container installation

### First time setup

Make sure you have Docker installed

Pull the Docker container with `docker pull ghcr.io/paivola-student-innovation-lab/dailycrypt:latest`
If you're using an arm system, use the `arm` tag

### Running the container

To start the container, run `docker run -p <outer-port>:<inner-port> ghcr.io/paivola-student-innovation-lab/dailycrypt:<tag>` (remember to replace ports with your ports and tag with your tag)

Example run script: `docker run --name dailycrypt -p 3000:80 ghcr.io/paivola-student-innovation-lab/dailycrypt:latest`


### Using the app

Go to `https://localhost:<outer-port>` (replace outer-port with your outer port) and DailyCrypt should be running there.

## Installation from source

### First time setup

Install rustup from https://rustup.rs/

Restart console after installing rust

After restarting run

```console
make setup
```

### Running app

```console
make run
```

You can also optionally use the developer environment by using `make run-dev`

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

Licensed under GNU General Public License v3.0 or later

## Project status

This project is currently under development by PSIL
