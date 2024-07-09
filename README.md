# Microservice v5 of the ShellOnYou app

## Introduction

This repo contains the microservice version 5 of the ShellOnYou app described in [1]. This app proposes exercises for students to practice the Unix CLI. Teachers can add exercises group them into sessions that can be opened to their students. 
See the *Help* pages once the app has been started.

Note that the database proposed here contains just one exercise. Instructors can contact us to have access to a private repo containing more exercises (not exposed to students ;-).

The app is intended to run as a set of docker containers orchestrated by *docker Swarm*, so you need docker installed (v25 and v26 have been tested but older version should also work). Alternatively, you could easily migrate to kubernetes or even manually start its component one by one with appropriate changes in the code (port numbers, variables).


## Building or getting the app

Once you have cloned the content of this repo, to get the app you either need to build it (recommended) or get it from Docker Hub:

### Building the app:

- `cd` to the root of this repo, i.e. that containing (`variables.env`).
- run the `./build.sh` command (this builds the docker images one after the other).

Note that the database image build in this way is programmed to use the database content stored in the the `v5-soy-db` folder. An advantage is that changes in the DB are persisted from one run to the other. A drawback is that this could cause you problems in case the permissions are not set correctly on this folder (it should be something like `7xx`, eg 700 is working fine on our machines).

### Getting the app from DockerHub:

Alternatively, you can get the app by getting the docker images from Docker Hub:
- `cd` to the root folder of the repo (containing the `variables.env` file).
- run the `pull_from_dockerHub.sh` script  
- you need to change the `docker-compose.yml` to accomodate that in the DockerHub version, the DB is stored inside the container: comment these lines (add a `#` sign in front): 
    - volumes:
    - ./v5-soy-db:/var/lib/postgresql/data

## Launching the application

- Complete the information in the `EMAIL` section of this file. This is needed for the account creation and change password functionalities. If you don't need them (eg if you're just interested in running load tests), ignore this section.

- You could (un)comment the `DEBUG=*` line in this file to have more/less info as the app launches and runs

- `cd` to the root folder of this repo

- run this command: `docker compose up` to launch the app (note: with older versionsof *docker*, e.g. v20, you could need to add a dash: `docker-compose up`)


## Replicating some services

The app comes in a configuration where each service is launched just once, but you can alter the replicas number of a service by uncommenting the `replicas` line in the corresponding service in the `docker-compose.yml` file and launching the app with this command:
`docker compose --compatibility up`

The only exception concerns the *gateway* service that needs to be put behind a reverse proxy in order to be replicated (the entrance port can only be mapped. In [1] we resorted to [HAproxy](https://www.haproxy.org/) to do that. It's installation is beyond the scope of this README file but you can contact us in case of difficulties. 

*/

## Notes on the content of this repo:

The repo is organized in several directories, presenting the content of the app tested in the microservice versions. 

The files presented here allow readers of the paper to access implementation details of the app. In case someone aims at actually launching the app, we provide anonymzed container images on Docker Hub. These are available at  https://hub.docker.com/u/icws24submission the instructions for running the app being indicated in the description of the two postgres containers (one for the monolith + one for the microservice version).

Information about the load tests is also included in the present repo.

Bellow we detail the content of each directory provided in this repo.

### MicroServiceVersion

This directory contains the code of the microservice version. It includes the following components:

- `docker-init`: This directory contains Docker configuration files for building and deploying this version.

- `exercise-http`: Code for the *exercise* microservice.

- `other-http`: Code for the *other* (aka *leftover*) microservice.

- `gateway`: Code for the *gateway* sercvice.

##### Docker Configuration (`docker-init/docker-compose.yml`)

   The `docker-compose.yml` file in the `docker-init` directory orchestrates the deployment of the microservices.

   Note that the presented configuration allows to replicate the *exercise* and *other* microservices, but to replicate the *gateway*, an additionnal *haproxy* service would be needed to ensure a single entry point in the backend and load balancing queries between the replicas of the gateway.

##### Usage

To deploy the microservice version using Docker, follow these steps:

1. Navigate to the `docker-init` directory.

2. Ensure you have Docker installed on your system.

3. Modify the `variables.env` file according to your environment requirements.

4. Run the following command to deploy the microservices:

    ```bash
    docker-compose up -d
    ```

    This command will fetch the containers from the Docker Hub, then start them as defined in the `docker-compose.yml` file.

5. Access the app using the appropriate endpoint and port specified in your customized `docker-compose.yml` file.

#### Notes

- Ensure that the `variables.env` file is properly configured with necessary environment variables before deploying the app.

- Make sure Docker and Docker Compose are properly installed and configured on your system before proceeding with deployment. This version was run and load tested under Docker version 20.10.23


### MonolithVersion

The monolithic version of the app can be found inside the `MonolithVersion` directory, which contains two subdirectories:

- `back`: Contains the code for the bakend of the monolithic version of the app.

- `docker_init`: Contains Docker configuration files for deploying the monolithic application.

##### Docker Configuration (`docker_init/docker-compose.yml`)

The `docker-compose.yml` file in the `docker_init` directory orchestrates the deployment of the monolithic application. 

### Load_Tests_Ms_Version

A load test project specifically designed to launch and analyze Gatling load tests *for the microservice version* of the application.

Inside the `Load_Tests_Ms_Version` directory, you'll find the following structure:

- `gatling`: scripts and configuration files to add to Galting for load testing this app.
  - `README.md`: an explanation of the different steps to follow to launch the tests
  - `bin`: our scripts for setting up the app and launch Galting tests on it.
  - `user-files`: files necessary for Gatling to generate and send requests to the app. The proposed scenario follows that described in the paper.

Load testing *the monolith version* requires you to simplify our .sh scripts located in the `bin` directory.

### Load_Tests_Results

This directory contains a result file aggregating load tests for variious versions of both the microservice and monolith version. 

### Downloading Files

To download all the files above, you can use the `archive.zip` file. This will allow you to download all the declared folders.

### Docker Images

For your convenience, the deployment instructions for these versions are also provided within their respective Docker images on DockerHub. Please refer to the following links:

- Microservice Version: [Docker Hub Link](https://hub.docker.com/repository/docker/icws24submission/postgres_icws24/general)

- Monolith Version: [Docker Hub Link](https://hub.docker.com/repository/docker/icws24submission/postgres_monolith/general)

Please note that upon accessing these links, you should follow the instructions provided within the repository overview shown on Docker Hub. The overview contains detailed guidance on deploying the application versions.

This will allow you to quickly set up the different versions of the application without the need to build the images locally.

--- 
## How to cite

[1] *Is it Worth Migrating a Monolith to Microservices? An Experience Report on Performance, Availability and Energy Usage*. V. Berry, A. Castelltort, B. Lange, J. Teriihoania, C. Tibermacine, C. Trubiani. Proc. of IEEE International Conference on Web Services (ICWS'24).

[2] *ShellOnYou: learning by doing Unix command line*. V. Berry, C. Castelltort, C. Pelissier, M. Rousseau, C. Tibermacine, Proc. of the 27th ann. conf. on Innovation and Technology in Computer Science Education (ITiCSE), Vol 1, pages 379-385, 2022, doi 10.1145/3502718.3524753

