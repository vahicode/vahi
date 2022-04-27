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

> FIXME: This documentation is under construction

## Contribute

Your pull request are welcome here. If you have any questions, please [create an issue](https://github.com/vahicode/website/issues/new).

## License: MIT 🤓

© [Joost De Cock](https://github.com/joostdecock).

VaHI is licensed under the MIT license 
See [the license file](https://github.com/vahicode/vahi/blob/develop/LICENSE) for details.

