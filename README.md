# Microservice v5 of the ShellOnYou app

## Introduction

This repo contains the microservice version 5 of the ShellOnYou app described in [1]. This app proposes exercises for students to practice the Unix CLI. Teachers can add exercises group them into sessions that can be opened to their students. 
See the *Help* pages once the app has been started.

Note that the database proposed here contains just one exercise. Instructors can contact us to have access to a private repo containing more exercises (not exposed to students ;-).

The app is intended to run as a set of docker containers orchestrated by *docker Swarm*, so you need docker installed (v25 and v26 have been tested but older version should also work). Alternatively, you could easily migrate to kubernetes or even manually start its component one by one with appropriate changes in the code (port numbers, variables).

## Content

This directory contains the code of the microservice version. It includes the following components:

- `exercise-http`: Code for the *exercise* microservice.

- `other-http`: Code for the *other* (aka *leftover*) microservice.

- `gateway`: Code for the *gateway* service.

- `soy-db`: *database* of the app.


## Building or getting the app

Once you have cloned the content of this repo, to get the app you either need to build it (recommended) or get it from Docker Hub:

### Building the app:

- `cd` to the root of this repo, i.e. that containing (`variables.env`).
- run the `./build.sh` command (this builds the docker images one after the other).

### Getting the app from DockerHub:

Alternatively, you can get the app by getting the docker images from Docker Hub:
- `cd` to the root folder of the repo (containing the `variables.env` file).
- run the `pull_from_dockerHub.sh` script  

In case of problem also refer to the following link [Docker Hub images](https://hub.docker.com/repository/docker/icws24submission/postgres_icws24/general)


## Setting up the app
- Go with the `cd` to the `soy-db` folder.

- Uncompress the content of the DB by typing: `tar xzf v5-soy-dv.tgz`. This should create a `v5-soy-db` folder. Check by `ls -l` that the permissions are `7xx` on this folder (i.e. the user has all permissions).

- Type `cd ..` to return to the root folder

- Modify the `variables.env` file according to your environment requirements.

- Complete the information in the `EMAIL` section of this file. This is needed for the account creation and change password functionalities. If you don't need them (eg if you're just interested in running load tests), ignore this section.

- Uncomment/comment the `DEBUG=*` line in this file to have less/more info as the app launches and runs.


## Launching the application

- While still being in the root folder of this repo, run this command: 

    ```bash
    docker-compose up
    ```

Note: with older versions of *docker*, e.g. v20, you could need to add a dash: `docker-compose up`

## Accessing the app

Once it is launched, you should wait several minutes before the frontend is ready to accept connections. You can access the app using the appropriate endpoints and ports specified in your customized `docker-compose.yml` and `variables.env` files. If you didn't change any port version, the front is accessed at `http://localhost:3001` and the backend at `http://localhost:5001`.
The endpoints are listed in the `exercise-http/routes` and the `other-http/routes` folders.

The DB in its current state contains a large number of user accounts for load test purposes. We give some examples here so that you can log in with the front of the app to explore its functionalities:
- adminp@yopmail.com / anonymous
- teacher@yopmail.com / plageVB
- etud-ig3-0@yopmail.com / plageCT

## Replicating some services

The app comes in a configuration where each service is launched just once, but you can alter the replicas number of a service by updating the `replicas` lines of the corresponding service in the `docker-compose.yml` file and launching the app with this command:
`docker compose --compatibility up`

Note: when you do changes in the `docker-compose.yml` file you should stop the app before re-launching it:
    ```bash
    docker-compose down
    ```

Note: the *gateway* service cannot be replicated in the same way. You need to be put behind a reverse proxy in order to replicate it (the entrance port can only be mapped to one process). In [1] we resorted to an [HAproxy](https://www.haproxy.org/) service to do that. It's installation is beyond the scope of this README file but you can contact us in case of difficulties. 

##### Docker Configuration (`docker-init/docker-compose.yml`)

   The `docker-compose.yml` file orchestrates the deployment of the microservices.

   Note that the presented configuration allows to replicate the *exercise* and *other* microservices, but to replicate the *gateway*, an additionnal *haproxy* service would be needed to ensure a single entry point in the backend and load balancing queries between the replicas of the gateway.

#### Notes

- Ensure that the `variables.env` file is properly configured with necessary environment variables before deploying the app.

- Make sure Docker and Docker Compose are properly installed and configured on your system before proceeding with deployment. This version was run and load tested under Docker version 20.10.23

--- 
## How to cite

[1] *Is it Worth Migrating a Monolith to Microservices? An Experience Report on Performance, Availability and Energy Usage*. V. Berry, A. Castelltort, B. Lange, J. Teriihoania, C. Tibermacine, C. Trubiani. Proc. of IEEE International Conference on Web Services (ICWS'24).

[2] *ShellOnYou: learning by doing Unix command line*. V. Berry, C. Castelltort, C. Pelissier, M. Rousseau, C. Tibermacine, Proc. of the 27th ann. conf. on Innovation and Technology in Computer Science Education (ITiCSE), Vol 1, pages 379-385, 2022, doi 10.1145/3502718.3524753

