# VaHI v2

## What am I looking at? :thinking:

This is **a work-in-progress** to build version 2 of VaHI

After the initial work in the spring of 2018, VaHI has been running for 4 years now.
There's new interest in the system, but four years is a lifetime in frontend development.
So I felt it was best to build a new major version and port this to a more modern stack.

## About VaHI 

For more information on what VaHI does/is, please visit [vahi.eu](https://vahi.eu/).

## Get involved with VaHI v2 :rocket:

Check out [the v2 roadmap](https://github.com/vahicode/vahi/discussions/1) to see what I'm working on.
I am open to ideas/suggestions for what you would like to see in our mext major release.

## Technology stack 🤓

VaHI 2 is a [NextJS](https://nextjs.org/) app using 
a [SQLite database](https://www.sqlite.org/) through [prisma](https://www.prisma.io/).

To run it, you will need [NodeJS](https://nodejs.org/en/) on your system (I recommend 
using [nvm](https://github.com/nvm-sh/nvm) for installing NodeJS).

## Getting started 🚀

> Version 2 of VaHI is **a work in progress**. In other words, if you're curious or are interested
in contributing, feel free to kick the tires. But if you expect something that *just works* it's
too early for that.

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

> Note that you can also just remove the database file (by default that file is `db/vahi.db`)

## Configuration 🔧

Check the configuration file `vahi.config.mjs` and the Prisma schema in `prisma/prisma.schema`
for ways to configure VaHI.

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

If you want to report a problem, please [create an issue](https://github.com/vahicode/vahi/issues/new).

## Contribute

Your pull request are welcome here. If you have any questions, please [create an issue](https://github.com/vahicode/website/issues/new).

## License: MIT 🤓

© [Joost De Cock](https://github.com/joostdecock).

VaHI is licensed under the MIT license 
See [the license file](https://github.com/vahicode/vahi/blob/develop/LICENSE) for details.

