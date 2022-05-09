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

# VaHI Docker Image

The VaHI docker image is published 
at [vahicode/vahi](https://hub.docker.com/r/vahicode/vahi) on the Docker 
registry.

## Quick start

**Step 1: Spin up the container:**

```bash
docker run -d \
    --name vahi \
    --restart unless-stopped \
    -p 5000:3000 \
    -v /your/local/folder:/vahi/db \
    --env VAHI_SECRET="someRandomStringHere" \
    vahicode/vahi:2.0.0-rc.3
```

**Step 2: Create the database**

```bash
docker exec -it vahi yarn newdb
```

**Step 3: Visit the start page**

Go to http://localhost:3000/start

## Exposed ports

VaHI will run a NextJS instance that listens on port 3000.
To make the container accessible, you will need to expose this port:

```bash
docker run \
  -p 3000:3000 \
  vahicode/vahi
```

## Mount the db folder

You will probably want to keep your database file out of the container.
For this, mount a local folder as the `/vahi/db` folder inside the container:

```bash
docker run \
  -p 3000:3000 vahicode/vahi \
  -v /your/local/folder:/vahi/db \
  vahicode/vahi
```

## Set the VAHI_SECRET environment variable

You also need to set the `VAHI_SECRET` environment variable to some random string.
This will be used to sign the JSON Web Tokens (JWT) so not setting it is a security
risk.

```bash
docker run \
  -e VAHI_SECRET=insertRandomStringHere \
  -p 3000:3000 vahicode/vahi \
  -v /your/local/folder:/vahi/db \
  vahicode/vahi
```

## Using an existing database

The container (by default --- see below for details on how to override it) will
look for a database file in `/vahi/db/vahi.db`.

If you already have a database you'd like to use, name it `vahi.db` and copy it 
into the folder you're mounting under `/vahi/db`.

## Using a new database

To start with a new database, it needs to be created. 

First start the VaHI container, and then run the following command to create a 
new database:

```bash
docker run -it vahi npm run newdb
```

Alternatively, you can download [this empty database 
file](https://github.com/vahicode/vahi/blob/develop/prisma/schema.db) and copy it in place.

## Overriding the config file

To further tweak VaHI, grab [the default 
configuration](https://github.com/vahicode/vahi/blob/develop/vahi.config.mjs) and
volume-mount it into the container. This way you can tweak all configuration values
without having to rebuild a different container image:

```bash
docker run \
  -e VAHI_SECRET=insertRandomStringHere \
  -p 3000:3000 vahicode/vahi \
  -v /your/local/folder/db:/vahi/db \
  -v /your/local/folder/my.config.mjs:/vahi/vahi.config.mjs \
  vahicode/vahi
```

## Remove the database

If at any moment you'd like to remove the database, you can do so by simply
removing the file. Alternatively, you can run the following command on a
running VaHI container:

```bash
docker run -it vahi npm run rmdb
```

