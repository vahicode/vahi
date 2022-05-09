> This is **a work-in-progress** to build version 2 of VaHI
>
> Check out [the v2 roadmap](https://github.com/vahicode/vahi/discussions/1) to 
> see what I'm working on. I am open to ideas/suggestions for what you would like
> to see in our mext major release.

# VaHI - A standardized grading system for limbal stem cell deficiency

[VaHI](https://vahi.eu/) is a standardized grading system 
for limbal stem cell deficiency.

Limbal stem cell deficiency (LSCD) results from a range of pathologies such as
chemical burns and aniridia. While the repertoire of treatment techniques
expands and the number of limbal cell therapies grows, there is still a lack of
objective outcome measures in grading this pathology. The different assessment
techniques and subjective parameters challenge the grading of LSCD severity and
impede objective comparison of treatment outcomes.

VaHI stands for Vascularisation, Haze and Integrity; 3 key clinical signs of 
LSCD. Grading different clinical signs related to LSCD allows a simple way of
documenting the severity of the condition and in evaluating outcomes after
treatment.

The VaHI software provides a new, improved and easy grading system for
assessing and grading LSCD eyes. Feel welcome to discover this tool and join us
for some simple and straightforward grading.

For more information on what VaHI does/is, please 
visit [vahi.eu](https://vahi.eu/).

## Table of contents

- [Getting started](#getting-started)
- [Technology stack](#technology-stack)
- [Configuration](#configuration)
- [Deployment](#deployment)
  - [With NodeJS](#pure-nodejs)
  - [With PM2](#with-pm2)
  - [With Docker](#with-docker)
- [Where to get help](#where-to-get-help)
- [Contribute](#)
- [License](#)


## Getting started

**Running the VaHI Docker image**

The fastest way to try VaHI is to [spin it up as a Docker 
container](https://github.com/vahicode/vahi/blob/develop/DOCKER.md).

**Running VaHI from source code**

To run VaHI from source code, you will need [NodeJS](https://nodejs.org/en/) on
your system.  

> I recommend using [nvm](https://github.com/nvm-sh/nvm) for installing NodeJS).

Then you can clone the repository and install dependencies:

```bash
git clone git@github.com:vahicode/vahi.git
cd vahi
npm install
```

Now you can start VaHi in development mode by running:

```
npm run dev
```

Now open your browser at [http://localhost:3000/start](http://localhost:3000/start)

## Technology stack

VaHI 2 is a [NextJS](https://nextjs.org/) app using 
a [SQLite database](https://www.sqlite.org/) through [
prisma](https://www.prisma.io/).

The VaHI container is built on top of **Debian Buster** and uses
the [PM2](https://pm2.keymetrics.io/) process manager.

## Configuration

VaHI requires two things to function:

- A `VAHI_SECRET` environment variable
- A database

### Setting `VAHI_SECRET` environment variable

You should set the `VAHI_SECRET` environment variable to some random string.
It will be used to sign the JSON Web Tokens (JWT) so if you don't set it things
will still work, but it will undermine the security of the VaHI authentication.

Passing an environment variable to NodeJS can be done in a variety of ways.  
For convenience, I've included an `example.env.local` file that you can copy 
to `.env.local` and edit. All variables you set in this file will automatically
be picked up.

> If you're running VaHI with Docker, please refer 
> to [DOCKER.md](https://github.com/vahicode/vahi/blob/develop/DOCKER.md) for
> details on how to set environment variables

### Creating the database

VaHI uses sqlite3 for its database, so a database file needs to be created.

If you're happy to start with a new (empty) database, you can create it with 
this command:

```bash
npm run initdb
```

If you have an existing database you'd like to use, copy the file to 
`db/vahi.db` (assuming you did not change the location of the database in the
configuration file --- see below).

> If you're running VaHI with Docker, please refer 
> to [DOCKER.md](https://github.com/vahicode/vahi/blob/develop/DOCKER.md) for
> details on how to create/manage the VaHI database.

## Deployment

### Pure NodeJS

You can deploy Vahi by building the project, and then running it:

```sh
npm run build
npm run start
```

This will spin up the NextJS instance, listening on port 3000.

> You will probably want to put this behind a reverse proxy (like Nginx) 
> to terminate the SSL connection and forward to port 3000.

### With PM2

You can improve on running the bare NodeJS version by running it 
inside [PM2](https://pm2.keymetrics.io/) which is a process manager
for NodeJS.

To do so, install PM2 globally:

```sh
npm install pm2 -g
```

Then rather than `npm run start` run:

```
pm2 start "npm run start" --name vahi
```

Refer to [the PM2 documentation](https://pm2.keymetrics.io/) for more details.

### With Docker

We publish [a VaHI container on the Docker 
registry](https://hub.docker.com/r/vahicode/vahi). To run it, expose port 3000
and set the `VAHI_SECRET` environment variable.

You may also want to volume-mount the `/vahi/db` folder to keep your database
out of the docker image.

All of that in one command:

```bash
docker run \
  -e VAHI_SECRET=insertRandomStringHere \
  -p 3000:3000 vahicode/vahi \
  -v /your/local/folder:/vahi/db \
  vahicode/vahi
```

> If you're running VaHI with Docker, please refer 
> to [DOCKER.md](https://github.com/vahicode/vahi/blob/develop/DOCKER.md) for
> details on all aspects of running VaHI in Docker.

## Where to get help

VaHI is open source so if you run into any issues, feel free to dive in and 
peek under the hood.

If you get stuck, you can [create an 
issue](https://github.com/vahicode/vahi/issues/new). 

## Contribute

If you'd like to see something added, feel free to submit a pull request and I'll
try to have a look at it.

## License: MIT

© [Joost De Cock](https://github.com/joostdecock).

VaHI is licensed under the MIT license 
See [the license file](https://github.com/vahicode/vahi/blob/develop/LICENSE) for details.

