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

- [About VaHI](#about-vahi)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Technology stack](#technology-stack)
- [Deployment](#deployment)
  - [With NodeJS](#with-nodejs)
  - [With PM2](#with-pm2)
  - [With Docker](#with-docker)
- [Where to get help](#where-to-get-help)
- [API Routes](#api-routes)
  - [Authentication](#authentication)
    - [API Authentication](#api-authentication)
    - [POST /api/user-login](#post-apiuser-login)
    - [POST /api/admin-login](#post-apiadmin-login)
  - [Admins](#admins)
    - [POST /api/admins/add](#post-apiadminsadd)
    - [GET /api/admins/get/{email}](#get-apiadminsgetemail)
    - [DELETE /api/admins/delete/{email}](#delete-apiadminsdeleteemail)
    - [PUT /api/admins/activate](#put-apiadminsactivate)
    - [PUT /api/admins/deactivate](#put-apiadminsdeactivate)
    - [PUT /api/admins/notes](#put--apiadminsnotes)
    - [PUT /api/admins/role](#put-apiadminsrole)
    - [GET /api/admins](#get-apiadmins)
  - [Users](#users)
    - [POST /api/users/add](#post-apiusersadd)
    - [GET /api/users/get/{invite}](#get-apiusersgetinvite)
    - [DELETE /api/users/delete/{invite}](#delete-apiusersdeleteinvite)
    - [PUT /api/users/activate](#put-apiusersactivate)
    - [PUT /api/users/deactivate](#put-apiusersdeactivate)
    - [PUT /api/users/demo](#put-apiusersdemo)
    - [PUT /api/users/notes](#put-apiusersnotes)
    - [GET /api/users](#get-apiusers)
  - [Eyes](#eyes)
    - [POST /api/eyes/upload](#post-apieyesupload)
    - [GET /api/eyes/get/{id}](#get-apieyesgetid)
    - [DELETE /api/eyes/delete/{id}](#delete-apieyesdeleteid)
    - [PUT /api/eyes/activate](#put-apieyesactivate)
    - [PUT /api/eyes/deactivate](#put-apieyesdeactivate)
    - [PUT /api/eyes/calibrate](#put-apieyescalibrate)
    - [PUT /users/eyes/notes](#put-userseyesnotes)
    - [GET /api/eyes](#get-apieyes)
    - [GET /api/img/eyes/{id}](#get-apiimgeyesid)
  - [Grades](#grades)
    - [GET /api/grading/load](#get-apigradingload)
    - [POST /api/grading/save](#post-apigradingsave)
    - [GET /api/grades/get/{id}](#get-apigradesgetid)
    - [GET /api/grades](#get-apigrades)
- [Contribute](#)
- [License](#)


## Getting started

### Running the VaHI Docker image

The fastest way to try VaHI is to spin it up as a Docker container:

```bash
docker run -e VAHI_SECRET=insertRandomStringHere -p 3000:3000 vahicode/vahi
```

Now open your browser at [http://localhost:3000/start](http://localhost:3000/start)

> **Tip**: In this docker command, we set the `VAHI_SECRET` environment variable 
> and expose port 3000 so it becomes accessible

### Running VaHI from source code

To run VaHI from source code, you will need [NodeJS](https://nodejs.org/en/) on
your system.  

> I recommend using [nvm](https://github.com/nvm-sh/nvm) for installing NodeJS).

Then you can clone the repository and install dependencies:

```bash
git clone git@github.com:vahicode/vahi.git
cd vahi
npm install
```

Now copy the `example.env.local` file to `.env.local` and change the `VAHI_SECRET`
variable in it to some randome string only you know.

Now you can start VaHi in development mode by running:

```
npm run dev
```

Now open your browser at [http://localhost:3000/start](http://localhost:3000/start)

## Configuration

Check the configuration file `vahi.config.mjs` for ways to configure VaHI.

The only thing you **MUST** configure is setting the `VAHI_SECRET` environment
variable. Either in an `.env.local` file, or through other means.

## Technology stack

VaHI 2 is a [NextJS](https://nextjs.org/) app using 
a [SQLite database](https://www.sqlite.org/) through [
prisma](https://www.prisma.io/).

The VaHI container is built on top of [Alpine 
Linux](https://www.alpinelinux.org/) and used 
the [PM2](https://pm2.keymetrics.io/) process manager.

## Deployment

### With NodeJS

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

You may also want to volume-mount the `/vahi/db/vahi.db` file to keep your database
out of the docker image.

All of that in one command:

```bash
docker run \
  -e VAHI_SECRET=insertRandomStringHere \
  -p 3000:3000 vahicode/vahi \
  -v /path/to/your.db:/vahi/db/vahi.db \
  vahicode/vahi
```

## API Routes

VaHI v1 had a seperate frontend and backend REST API. In v2, I have merged both
into a single NextJS instace. In combination with switching from mongodb to 
sqlite, this makes it much easier to deploy.

As such, there is no dedicated REST API, but there are API routes in the 
application which might be useful for people trying to automate certain things.
For this reason, they are documented below.

### Authentication

Authentication on API routes is based on [JSON web tokens](https://jwt.io) (JWT).
This is the case for both regular users (with an invite code) as for 
administrators (with username and password).

Any of the login routes (for users or admins, see below) will return a JWT.
For subsequent API calles, pass it prefixed by `Bearer ` in the 
`Authorization` header, like this:

```
Authorization Bearer eyJhbGci...
```

#### POST /api/user-login

Allows users (people with an invite code) to login.
Returns a JWT token for subsequent calls to API routes.

> This API route requires no authentication

Request body example:

```json
{
  "invite": "demo"
}
```

Return body example:

```json
{
  "token": "eyJhbG[truncated...]",
  "user": {
    "id":"demo",
    "createdAt": "2022-04-24T15:21:08.302Z",
    "createdBy": "root@vahi.eu",
    "isDemoUser": true,
    "isActive": true,
    "lastLogin": "2022-04-24T20:02:20.872Z",
    "notes": "Demo user generated by the initial database seed script"
  }
}
```

#### POST /api/admin-login

Allows admins (people with a username and password) to login.
Returns a JWT token for subsequent calls to API routes.

> This API route requires no authentication

Request body example:

```json
{
  "username": "admin username here",
  "password": "admin password here"
}
```

Return body example:

```json
{
  "token": "eyJhbG[truncated...]",
  "admin": {
    "email": "root@vahi.eu",
    "createdAt": "2022-04-24T15:21:08.295Z",
    "createdBy": "root@vahi.eu",
    "notes": "Superadmin generated by the initial datbase seed script",
    "isActive": true,
    "lastLogin": "2022-04-24T15:28:29.829Z",
    "role": "superadmin"
  }
}
```

### Admins

An admin is a person who has access to the administrative pages.
Admins have a username and password, unlike regular users who only
have an invite code to authenticate.

> **Note**: The username of an admin is stored in a field named `email`.
> Strictly speaking, there is no need for this to be an actual email address
> (in other words, `joost` works just as well) since VaHI does not send out
> any emails.

#### POST /api/admins/add

Adds a new admin account.

Request body example:

```json
{
  "email": "intern@vahi.eu",
  "notes": "This is the intern admin account"
}
```

Return body example:

```json
{
  "email": "intern@vahi.eu",
  "createdAt": "2022-04-24T11:52:33.829Z",
  "createdBy": "root@vahi.eu",
  "notes": "This is the intern admin account",
  "password": "L;s1N#3TeS*0GuYPzW76hN@lCsmFV<g1N]6JUA)<bJ",
  "isActive": false,
  "role": "analyst",
  "lastLogin": null
}
```

#### GET /api/admins/get/{email}

Retrieves the record of the admin account of which the `email` was passed in the URL.

Return body example:

```
{
  "email": "root@vahi.eu",
  "createdAt": "2022-04-24T11:52:33.829Z",
  "createdBy": "root@vahi.eu",
  "isActive": true,
  "notes": "Superadmin generated by the initial datbase seed script",
  "role": "superadmin",
  "lastLogin ":"2022-04-24T15:55:51.368Z"
}
```

#### DELETE /api/admins/delete/{email}

Removes the record of the admin account of which the `email` was passed in the URL.

Return body example:

```json
{
  "removed": "joost@joost.at"
}
```

#### PUT /api/admins/activate

Activates (enables) one or more admin accounts.

Request body example:

```json
{
  "admins": [
    "joost@joost.at"
  ]
}
```

> **Tip**: You can supply multiple emails in the request body.

Return body example:

```json
{
  "status": "ok"
}
```

#### PUT /api/admins/deactivate

Deactivates (disables) one or more admin accounts.

Request body example:

```json
{
  "admins": [
    "joost@joost.at"
  ]
}
```

> **Tip**: You can supply multiple emails in the request body.

Return body example:

```json
{
  "status": "ok",
  "removed": [
    "joost@joost.at"
  ],
  "danger": false
}
```

The **danger** return parameter will be `true` only if you try to disable the
admin account that was used to authenticate the API call (in other words,
your own account).

In such a case the return body will look like this:

```json
{
  "status": "ok",
  "removed": [],
  "danger": true
}
```

#### PUT /api/admins/notes

Updates the **notes** of an admin account.

Request body example:

```json
{
  "admin": "root@vahi.eu",
  "notes": "These are the notes"
}
```

Return body example:

```json
{
  "email": "root@vahi.eu",
  "createdAt": "2022-04-24T11:52:33.829Z",
  "createdBy": "root@vahi.eu",
  "isActive": true,
  "notes": "These are the notes",
  "role": "superadmin",
  "lastLogin ":"2022-04-24T15:55:51.368Z"
}
```

#### PUT /api/admins/role

Updates the **role** of an admin account.

Request body example:

```json
{
  "admin": "joost@joost.at",
  "role": "admin"
}
```

Return body example:

```json
{
  "email": "joost@joost.at",
  "createdAt": "2022-04-24T11:52:33.829Z",
  "createdBy": "root@vahi.eu",
  "isActive": true,
  "notes": "Just some example notes",
  "role": "admin",
  "lastLogin ":"2022-04-24T15:55:51.368Z"
}
```

#### GET /api/admins

Returns a list of admin accounts. 

Return body example:

```json
[
  {
    "email": "root@vahi.eu",
    "createdAt": "2022-04-24T11:52:33.829Z",
    "createdBy": "root@vahi.eu",
    "notes": "Superadmin generated by the initial datbase seed script",
    "isActive": true,
    "lastLogin": "2022-04-24T15:55:51.368Z",
    "role": "superadmin"
  },
  { 
    "email": "test@vahi.eu",
    "createdAt": "2022-04-24T16:20:37.723Z",
    "createdBy": "root@vahi.eu",
    "notes": "tyest",
    "isActive": false,
    "lastLogin": null,
    "role": "analyst"
  }
]
```

### Users

A user is a person with an invite code who can grage eyes. 

> **Note**: Users that have `isDemoUser` set to
> `true` can grade eyes but their grades will not be stored in the database.

#### POST /api/users/add

Adds one or more new user account.

> **Note**: The amount of users you can created in a single request is capped at `100`

Request body example:

```json
{
  "count": 2,
  "notes": "This are the notes",
}
```

Return body example:

```json
[
  "F7N7yM8fVhravBTdKPzY8BCj9fwSWjNR",
  "5vJDpFFq42SyBZdca89xqyDPTN6eHjpX"
]
```

#### GET /api/users/get/{invite}

Retrieves the record of the user account of which the `id` (the invite code) was passed in the URL.

Return body example:

```
{
  "id": "PFSV6czxgXYzbakwdwtpj5spYLUkT25n",
  "createdAt": "2022-04-24T13:19:11.890Z",
  "createdBy": "root@vahi.eu",
  "isDemoUser": false,
  "isActive": true,
  "lastLogin": "2022-04-24T13:19:23.890Z",
  "notes": "Test joost"
}
```

#### DELETE /api/users/delete/{invite}

Removes the record of the user account of which the `id` (the invite code) was passed in the URL.

Return body example:

```json
{
  "removed": "PFSV6czxgXYzbakwdwtpj5spYLUkT25n"
}
```

#### PUT /api/users/activate

Activates (enables) one or more user accounts.

Request body example:

```json
{
  "users": [
    "58LayUh5ssakPPYTHMUC6hzvks6XEMqL"
  ]
}
```

> **Tip**: You can supply invite codes in the request body.

Return body example:

```json
{
  "status": "ok"
}
```

#### PUT /api/admins/deactivate

Deactivates (disables) one or more user accounts.

Request body example:

```json
{
  "users": [
    "58LayUh5ssakPPYTHMUC6hzvks6XEMqL"
  ]
}
```

> **Tip**: You can supply multiple emails in the request body.

Return body example:

```json
{
  "status": "ok"
}
```

#### PUT /api/users/demo

Updates the **isDemoUser** field of a user account.

> **Tip**: Demo users can grade eyes but their grades won't be stored

Request body example:

```json
{
  "user": "PFSV6czxgXYzbakwdwtpj5spYLUkT25n",
  "demo": true
}
```

Return body example:

```json
{
  "id": "PFSV6czxgXYzbakwdwtpj5spYLUkT25n",
  "createdAt": "2022-04-24T13:19:11.890Z",
  "createdBy": "root@vahi.eu",
  "isDemoUser": true,
  "isActive": true,
  "lastLogin": "2022-04-24T13:19:23.890Z",
  "notes": "These are the notes"
}
```

#### PUT /users/admins/notes

Updates the **notes** of a user account.

Request body example:

```json
{
  "admin": "58LayUh5ssakPPYTHMUC6hzvks6XEMqL",
  "notes": "These are the notes"
}
```

Return body example:

```json
{
  "id": "PFSV6czxgXYzbakwdwtpj5spYLUkT25n",
  "createdAt": "2022-04-24T13:19:11.890Z",
  "createdBy": "root@vahi.eu",
  "isDemoUser": false,
  "isActive": true,
  "lastLogin": "2022-04-24T13:19:23.890Z",
  "notes": "These are the notes"
}
```

#### GET /api/users

Returns a list of user accounts. 

Return body example:

```json
[
  {
    "id": "demo",
    "createdAt":
    "2022-04-24T11:52:33.851Z",
    "createdBy": "root@vahi.eu",
    "isDemoUser": true,
    "isActive": true,
    "lastLogin": "2022-04-24T16:01:24.070Z",
    "notes": "Demo user generated by teh initial database seed script",
    "graded": 0
  },
  {
    "id": "58LayUh5ssakPPYTHMUC6hzvks6XEMqL",
    "createdAt": "2022-04-27T18:21:58.421Z",
    "createdBy": "root@vahi.eu",
    "isDemoUser": true,
    "isActive": false,
    "lastLogin": null,
    "notes": "test",
    "graded":0
  }
]
```

### Eyes

An eye is what users grade. 

> **Note**: The pictures of eyes are stored in the database as a binary blob
> This makes backing up VaHI trivial as you only need copy a single file.

#### POST /api/eyes/upload

Adds a new eye record.

> **Note**: The upload should be of type `multipart/form-data`, in other words a 
traditional file upload.
> 
> The response body will be an array with the IDs of the created eye records.

Request body example:

```
-----------------------------333988702615980472783693361375
Content-Disposition: form-data; name="files"

{"color":null}
-----------------------------333988702615980472783693361375
Content-Disposition: form-data; name="files"; filename="eye.jpg"
Content-Type: image/jpeg

ÿØÿà
[truncated]
```

Return body example:

```json
[ 1 ]
```

#### GET /api/eyes/get/{id}

Retrieves the record of the eye of which the `id` was passed in the URL.

> **Note**: This will not return the (binary) image data. See [image 
URLs](fixme) for info on how to retrieve the image itself.

Return body example:

```
{
  "id": 1,
  "createdAt": "2022-04-24T12:00:17.731Z",
  "createdBy": "root@vahi.eu",
  "isActive": false,
  "notes": "eye1.jpg",
  "scale": 0,
  "x": 0,
  "y": 0,
  "mimetype": "image/jpeg",
  "width":1200,
  "height":921
}
```

#### DELETE /api/eyes/delete/{id}

Removes the record of the eye of which the `id` was passed in the URL.

Return body example:

```json
{
  "removed": 1
}
```

#### PUT /api/eyes/activate

Activates (enables) one or more (pictures of) eyes.

Request body example:

```json
{
  "eyes": [ 1 ]
}
```

> **Tip**: You can supply multiple eye IDs in the request body.

Return body example:

```json
{
  "status": "ok"
}
```

#### PUT /api/eyes/deactivate

Deactivates (disables) one or more (pictures of) eyes.

Request body example:

```json
{
  "eyes": [ 1 ]
}
```

> **Tip**: You can supply multiple emails in the request body.

Return body example:

```json
{
  "status": "ok"
}
```

#### PUT /api/eyes/calibrate

Updates the **calibration data** of an eye (picture) which controls the
position of the grid on the picture.

> **Tip**: The calibration data consists of:
>
> - `scale`: The scale of the grid
> - `x`: The anchor of the grid on the X-axis
> - `y`: The anchor of the grid on the Y-axis

Request body example:

```json
{
  "eye": 1,
  "scale": 0.73,
  "x": 144,
  "y": 2.75
}
```

Return body example:

```json
{
  "id": 1,
  "createdAt": "2022-04-24T12:00:17.731Z",
  "createdBy": "root@vahi.eu",
  "isActive": false,
  "notes": "eye1.jpg",
  "scale": 0.73,
  "x": 144,
  "y": 2.75,
  "mimetype": "image/jpeg",
  "width":1200,
  "height":921
}
```

#### PUT /users/eyes/notes

Updates the **notes** of an eye record.

Request body example:

```json
{
  "eye": 1,
  "notes": "These are the notes"
}
```

Return body example:

```json
{
  "id": 1,
  "createdAt": "2022-04-24T12:00:17.731Z",
  "createdBy": "root@vahi.eu",
  "isActive": false,
  "notes": "These are the notes",
  "scale": 0.73,
  "x": 144,
  "y": 2.75,
  "mimetype": "image/jpeg",
  "width":1200,
  "height":921
}
```

#### GET /api/eyes

Returns a list of eyes.

Return body example:

```json
[
  {
    "id": 1,
    "createdAt": "2022-04-24T12:00:17.731Z",
    "createdBy": "root@vahi.eu",
    "isActive": false,
    "notes": "These are the notes",
    "scale": 0.73,
    "x": 144,
    "y": 2.75,
    "mimetype": "image/jpeg",
    "width":1200,
    "height":921
  }
]
```

#### GET /api/img/eyes/{id}

Returns the picture of the eye of which the `id` was passed in the URL.

> **Tip**: This does not return JSON but the raw binary image data.
> In other words, you can use this as the `src` in an `img` tag.

### Grades

The grades are (a set of) scores assigned to an eye by a user.
Each eye has 13 zones, and for each zone we store a score beteen 0 and 3
for vascularity, haze, and integrity.

#### GET /api/grading/load

Loads the next eye to grade, as well as some data about the grading progress.

Return body example:

```json
{
  "stats": {
    "total": 5,
    "todo": 5,
    "done": 0
  },
  "eye": {
    "id": 1,
    "scale": 0.77,
    "x": 99,
    "y": 21.25,
    "width": 1200,
    "height": 921
  }
}
```

If the user has graded all eyes, the return will not include an eye record:

```json
{
  "stats": {
    "total": 5,
    "todo": 0,
    "done": 5
  },
  "eye": false
}
```

#### POST /api/grading/save

Stores a user's grading for a particular eye.

Request body example:

```json
{
  "eye": 5,
  "grades": {
    "vascularity": {
      "1": 1,
      "2": 1,
      "3": 0,
      "4": 1,
      "5": 2,
      "6": 1,
      "7": 2,
      "8": 3,
      "9": 2,
      "10": 2,
      "11": 1,
      "12": 0,
      "13": 0
    },
    "haze": {
      "1": 0,
      "2": 0,
      "3": 1,
      "4": 1,
      "5": 0,
      "6": 1,
      "7": 0,
      "8": 1,
      "9": 2,
      "10": 1,
      "11": 0,
      "12": 0,
      "13": 0
    },
    "integrity": {
      "1": 1,
      "2": 1,
      "3": 0,
      "4": 1,
      "5": 2,
      "6": 1,
      "7": 2,
      "8": 3,
      "9": 2,
      "10": 2,
      "11": 1,
      "12": 0,
      "13": 0
    }
  }
}
```

This API route will have the same return as `/api/grading/load`; In other words
the next eye to grade. Returning it here saves us an round-trip.

See above for an example.

If the user has graded all eyes, the return will not include an eye record:

```json
{
  "stats": {
    "total": 5,
    "todo": 4,
    "done": 1
  },
  "eye": {
    "id": 2,
    "scale": 0.77,
    "x": 99,
    "y": 21.25,
    "width": 1200,
    "height": 921
  }
}
```

#### GET /api/grades/get/{id}

Retrieves the record of grades of which the `id` was passed in the URL.

> **Note**: This will not return the (binary) image data. See [image 
URLs](fixme) for info on how to retrieve the image itself.

Return body example:

```
{
  "id":6,
  "createdAt":"2022-04-27T19:39:41.467Z",
  "eyeId":5,
  "userId":"58LayUh5ssakPPYTHMUC6hzvks6XEMqL",
  "v1":0,
  "v2":0,
  "v3":0,
  "v4":0,
  "v5":0,
  "v6":0,
  "v7":0,
  "v8":0,
  "v9":0,
  "v10":0,
  "v11":0,
  "v12":0,
  "v13":0,
  "h1":0,
  "h2":0,
  "h3":0,
  "h4":0,
  "h5":0,
  "h6":0,
  "h7":0,
  "h8":0,
  "h9":0,
  "h10":0,
  "h11":0,
  "h12":0,
  "h13":0,
  "i1":0,
  "i2":0,
  "i3":0,
  "i4":0,
  "i5":0,
  "i6":0,
  "i7":0,
  "i8":0,
  "i9":0,
  "i10":0,
  "i11":0,
  "i12":0,
  "i13":0,
  "user":{
    "id":"58LayUh5ssakPPYTHMUC6hzvks6XEMqL",
    "createdAt":"2022-04-27T18:21:58.421Z",
    "createdBy":"root@vahi.eu",
    "isDemoUser":false,
    "isActive":true,
    "lastLogin":"2022-04-27T19:39:37.429Z",
    "notes":"test"
  },
  "eye":{
    "id":5,
    "createdAt":"2022-04-24T12:00:22.239Z",
    "createdBy":"root@vahi.eu",
    "isActive":true,
    "notes":"eye1.jpg",
    "scale":0.73,
    "x":144,
    "y":2.75,
    "width":1200,
    "height":907,
    "mimetype":"image/jpeg"
  }
}
```

#### GET /api/grades

Retrieves the list of gradings.

Return body example:

```json
[
  {
    "id":1,
    "createdAt":"2022-04-24T13:19:36.515Z",
    "eyeId":5,
    "userId":"PFSV6czxgXYzbakwdwtpj5spYLUkT25n",
    "v1":1,
    "v2":0,
    "v3":0,
    "v4":0,
    "v5":0,
    "v6":0,
    "v7":0,
    "v8":1,
    "v9":1,
    "v10":0,
    "v11":0,
    "v12":0,
    "v13":0,
    "h1":0,
    "h2":0,
    "h3":0,
    "h4":0,
    "h5":0,
    "h6":0,
    "h7":0,
    "h8":1,
    "h9":2,
    "h10":0,
    "h11":0,
    "h12":0,
    "h13":2,
    "i1":1,
    "i2":2,
    "i3":0,
    "i4":0,
    "i5":0,
    "i6":0,
    "i7":0,
    "i8":1,
    "i9":1,
    "i10":1,
    "i11":0,
    "i12":0,
    "i13":0,
    "eye":5
  },
  {
    "id":2,
    "createdAt":"2022-04-24T13:19:46.824Z",
    "eyeId":4,
    "userId":"PFSV6czxgXYzbakwdwtpj5spYLUkT25n",
    "v1":1,
    "v2":0,
    "v3":0,
    "v4":0,
    "v5":0,
    "v6":0,
    "v7":1,
    "v8":2,
    "v9":2,
    "v10":0,
    "v11":0,
    "v12":1,
    "v13":3,
    "h1":0,
    "h2":0,
    "h3":0,
    "h4":0,
    "h5":0,
    "h6":0,
    "h7":0,
    "h8":1,
    "h9":2,
    "h10":1,
    "h11":0,
    "h12":0,
    "h13":1,
    "i1":2,
    "i2":2,
    "i3":0,
    "i4":0,
    "i5":0,
    "i6":0,
    "i7":0,
    "i8":1,
    "i9":2,
    "i10":1,
    "i11":0,
    "i12":0,
    "i13":0,
    "eye":4
  }
]
```

## License: MIT

© [Joost De Cock](https://github.com/joostdecock).

VaHI is licensed under the MIT license 
See [the license file](https://github.com/vahicode/vahi/blob/develop/LICENSE) for details.

