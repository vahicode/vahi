# VaHI v2

## What am I looking at? :thinking:

This is **a work-in-progress** to build version 2 of VaHI

After the initial work in the spring of 2018, VaHI has been running for 4 years
now. There's new interest in the system, but four years is a lifetime in 
frontend development. So I felt it was best to build a new major version and 
port this to a more modern stack.

## About VaHI 

For more information on what VaHI does/is, please 
visit [vahi.eu](https://vahi.eu/).

## Get involved with VaHI v2 :rocket:

Check out [the v2 roadmap](https://github.com/vahicode/vahi/discussions/1) to 
see what I'm working on. I am open to ideas/suggestions for what you would like
to see in our mext major release.

## Technology stack 🤓

VaHI 2 is a [NextJS](https://nextjs.org/) app using 
a [SQLite database](https://www.sqlite.org/) through [
prisma](https://www.prisma.io/).

To run it, you will need [NodeJS](https://nodejs.org/en/) on your system 
(I recommend using [nvm](https://github.com/nvm-sh/nvm) for installing NodeJS).

## Getting started 🚀

> Version 2 of VaHI is **a work in progress**. In other words, if you're 
curious or are interested in contributing, feel free to kick the tires. But if 
you expect something that *just works* it's too early for that.

To get started, clone the repo:

```bash
git clone git@github.com:vahicode/vahi.git
```

Enter the repo, and install dependencies:

```bash
cd vahi
npm install
```

Copy the `example.env` file to `.env`.

Now you can initialize (create and seed) the database.
To do so, run the following command:

```bash
npm run initdb
```

If at any moment you want to remove the database, you can run this command:

```bash
npm run rmdb
```

After which you can initialize it again.

> Note that you can also just remove the database file (by default that file 
is `db/vahi.db`)

## Configuration 🔧

Check the configuration file `vahi.config.mjs` and the Prisma schema 
in `prisma/prisma.schema` for ways to configure VaHI.

## Deployment 🔧

### With NodeJS

You can deploy Vahi by building the project, and then running it:

```sh
yarn build
yarn start
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

Then rather than `yarn start` run:

```
pm2 start "yarn dev" --name vahi
```

Refer to [the PM2 documentation](https://pm2.keymetrics.io/) for more details.

### With Docker

#### Building the image

If you'd like to build your own image, you can do so with:

```sh
docker build .
```

#### Run the image

> FIXME: Todo

## Where to get help 🤯

If you want to report a problem, please [create an 
issue](https://github.com/vahicode/vahi/issues/new).

## API Routes

VaHI v1 had a seperate frontend and backend REST API. In v2, I have merged both
into a single NextJS instace. In combination with switching from mongodb to 
sqlite, this makes it much easier to deploy.

As such, there is no dedicated REST API, but there are API routes in the 
application which might be useful for people trying to automate certain things.
For this reason, they are documented below.

> ##### This API is not 'restful'
>
> Please note that these API routes are not strictly restful. By which I mean
> that they don't respect the proper methods to indicate the purpose/role of
> and API route. For example, the `DELETE` verb is not used to delete and so 
> on.
>
> Implementing different methods for the same API endpoint is not as trivial
> in NextJS as it is in a pure API framework like Express. For this reason,
> and to make it easier for aspiring contributors what API routes are 
> available, rather than having the same API route behave differently based
> on the method/verb, things are split up into different routers and we use
> GET/POST everywhere.

### API Authentication

Authentication on API routes is based on [JSON web tokens](https://jwt.io) (JWT).
This is the case for both regular users (with an invite code) as for 
administrators (with username and password).

Any of the login routes (for users or admins, see below) will return a JWT.
For subsequent API calles, pass it prefixed by `Bearer ` in the 
`Authorization` header, like this:

```
Authorization Bearer eyJhbGci...
```

### POST /api/user-login

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

### POST /api/admin-login

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

### POST /api/admins/add

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

### GET /api/admins/get/{email}

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

### DELETE /api/admins/delete/{email}

Removes the record of the admin account of which the `email` was passed in the URL.

Return body example:

```json
{
  "removed": "joost@joost.at"
}
```

### POST /api/admins/activate

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

### POST /api/admins/deactivate

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

### POST /api/admins/notes

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

### POST /api/admins/role

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

### GET /api/admins

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

### POST /api/users/add

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

### GET /api/users/get/{invite}

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

### DELETE /api/users/delete/{invite}

Removes the record of the user account of which the `id` (the invite code) was passed in the URL.

Return body example:

```json
{
  "removed": "PFSV6czxgXYzbakwdwtpj5spYLUkT25n"
}
```

### POST /api/users/activate

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

### POST /api/admins/deactivate

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

### POST /api/users/demo

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

### POST /users/admins/notes

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

### GET /api/users

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

### POST /api/eyes/upload

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

### GET /api/eyes/get/{id}

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

### DELETE /api/eyes/delete/{id}

Removes the record of the eye of which the `id` was passed in the URL.

Return body example:

```json
{
  "removed": 1
}
```

### POST /api/eyes/activate

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

### POST /api/eyes/deactivate

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

### POST /api/eyes/calibrate

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

### POST /users/eyes/notes

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

### GET /api/eyes

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

### GET /api/img/eyes/{id}

Returns the picture of the eye of which the `id` was passed in the URL.

> **Tip**: This does not return JSON but the raw binary image data.
> In other words, you can use this as the `src` in an `img` tag.






> FIXME: This documentation is under construction

## Contribute

Your pull request are welcome here. If you have any questions, please [create an issue](https://github.com/vahicode/website/issues/new).

## License: MIT 🤓

© [Joost De Cock](https://github.com/joostdecock).

VaHI is licensed under the MIT license 
See [the license file](https://github.com/vahicode/vahi/blob/develop/LICENSE) for details.

