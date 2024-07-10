# Microservice v5 of the ShellOnYou app

## Content

- [Description](#description)
- [Content of the repo](#content-of-the-repo)
- [Building or getting the app](#building-or-getting-the-app)
- [Configuring](#configuring-the-app)
- [Launching](#launching-the-app)
- [Using](#Using-the-app)
- [Citing](#how-to-cite)
- [Contributing](#contribute)
- [License](#license)

## Description

This repo contains the microservice version (v5) of the ShellOnYou app described in [1]. 

## Goal
This app proposes exercises for students to practice the Unix CLI. 
The app is designed for instructors to deploy, and create exercise sessions for their students. 

---
### Key Features
The application offers a range of features to enhance the learning experience:

`Exercise on different themes`: Exercises can be made available on a range of 10 themes. 
`Exercise library`: The exercises can be modified / extended by instructors or also serve as models for proposing new ones. A Python library eases the development process.

`Associate skills to exercises`: A skill list is provided. Instructors can associate skills to each exercise and learners gain skills when they reach at least 50% score for an exercise.

`Different Difficulty Levels`: The students can rate the difficulty of each proposed exercise, giving feedback to instructors. 

`Instant Evaluations`: Learners receive immediate feedback when posting an answer archive with comments to understand where they succeeded and where they can improve.

`Thanking other users`: An icon allows learners to thank others, encouraging peer learning. 

Note that the database proposed here contains just one exercise. Instructors can contact us to have access to a private repo containing more exercises (not exposed to students ;-).


## Content of the repo

This web app is intended to run as a set of microservices each hosted in a docker container. Containers are orchestrated by *docker compose*, so you need *Docker* to be installed (v25 and v26 have been reported ok, but older version should also work). Alternatively, you could easily migrate to kubernetes or even manually start the app components one by one with appropriate changes in the code (port numbers, variables).

In this version, microservices communicate by `http` requests sent to the API gateway.

This repo is organized in several folders:
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

## Configuring the app

### Set up

- Go with the `cd` to the `soy-db` folder.
- Uncompress the content of the DB by typing: `tar xzf v5-soy-dv.tgz`. This should create a `v5-soy-db` folder. Check by `ls -l` that the permissions are `7xx` on this folder (i.e. the user has all permissions).
- Type `cd ..` to return to the root folder
- Modify the `variables.env` file according to your environment requirements.
- Complete the information in the `EMAIL` section of this file. This is needed for the account creation and change password functionalities. If you don't need them (eg if you're just interested in running load tests), ignore this section.
- Uncomment/comment the `DEBUG=*` line in this file to have less/more info as the app launches and runs.

### Replicating some services

The app comes in a configuration where each service is launched just once, but you can alter the replicas number of a service by updating the `replicas` lines of the corresponding service in the `docker-compose.yml` file and launching the app with this command:
`docker compose --compatibility up`

Note: when you do changes in the `docker-compose.yml` file you should stop the app before re-launching it:
    ```bash
    docker-compose down
    ```

Note: the *gateway* service cannot be replicated in the same way. You need to be put behind a reverse proxy in order to replicate it (the entrance port can only be mapped to one process). In [1] we resorted to an [HAproxy](https://www.haproxy.org/) service to do that. It's installation is beyond the scope of this README file but you can contact us in case of difficulties. 

## Launching the app

- While still being in the root folder of this repo, run this command in a terminal: 

    ```bash
    docker-compose up
    ```

Notes: 
- with older versions of *docker*, e.g. v20, you will need to use a command with a dash: `docker-compose up`
- use CTRL+C to stop the app and regain the control of the terminal
- adding the `-d` option leaves you with in control of the terminal, but logs are not displayed anymore


---
## Using the app

Once it is launched, you should wait several minutes before the frontend is ready to accept connections. You can access the app using the appropriate endpoints and ports specified in your customized `docker-compose.yml` and `variables.env` files. If you didn't change default ports, the front is accessed at `http://localhost:3001` and the backend at `http://localhost:5001`. The endpoints are listed in the `exercise-http/routes` and the `other-http/routes` folders.

### Log in / Sign Up
The application handles 3 roles: admin, instructor, student.
When you sign up, you're automatically a student.
- Students can register to exercise sessions, access exercises, solve them, thank other users for help.
- Instructors can edit exercices, assemble them into exercise sequences and schedule sequences in sessions by indicating dates. 
- The admin can see all users and change their role

The DB in its current state contains a large number of user accounts for load test purposes. We give some examples here so that you can log in with the front of the app to explore its functionalities:
- adminp@yopmail.com / anonymous
- teacher@yopmail.com / plageVB
- etud-ig3-0@yopmail.com / plageCT

### Exercises
Instructors can add exercises, group them into sessions that can be opened to their students.  See the *Help* pages once the app has been started.

In this version of the app (v5), a student solves an exercise by getting then uploading a .tar.gz archive: 

The student receives an exercise archive to explore and modify on a unix system together with instructions in the app. 
Once the student has made up an answer, packed it inside an answer archive, and submitted it to the app, it will be automatically analyzed (no IA behind the hood, but just plain old python script that checks the student’s answer point by point). The student then receives almost instant feedback and score. 
Each instructor has access to statistics on the students that subscribed to his/her exercise sessions. This feature allows the instructor to estimate their understanding, have feedback on the exercise’s difficulty and provide prompt assistance if needed.

--- 
## How to cite

[1] *Is it Worth Migrating a Monolith to Microservices? An Experience Report on Performance, Availability and Energy Usage*. V. Berry, A. Castelltort, B. Lange, J. Teriihoania, C. Tibermacine, C. Trubiani. Proc. of IEEE International Conference on Web Services (ICWS'24).

[2] *ShellOnYou: learning by doing Unix command line*. V. Berry, C. Castelltort, C. Pelissier, M. Rousseau, C. Tibermacine, Proc. of the 27th ann. conf. on Innovation and Technology in Computer Science Education (ITiCSE), Vol 1, pages 379-385, 2022, doi 10.1145/3502718.3524753

---

## Contribute

All contributions are welcome! If you would like to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a branch for your feature: `git checkout -b new-feature`
3. Make the necessary changes in your version of the code
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to your branch: `git push origin new-feature`
6. Submit a Pull Request


## License
## Copyright notice
``````
Shell On You, an educational web application to learn shell.
Copyright © 2022 POLYTECH MONTPELLIER.


This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.


This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
``````
## Modification
When you modified the code of a file, you may edit the copyright notice on top of it and make it a modification notice by adding a modification copyright notice.
``````
Shell On You, an educational web application to learn shell.
Copyright (C) <year> modified by <NAME> (<MAIL>)
Copyright © 2022 POLYTECH MONTPELLIER.


This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.


This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
```````





