# Shrinkr

## Description
A simple web application that allows a user to create a short version of a lengthy url. The User can either generate a random short URL aur he can add a URL of his choosing.
A live and deployed version for the application is available here https://wec-task-shrinker-production.up.railway.app/

## Built with

Nodejs
Express
Ejs
Prisma
Css
Passport

## Installation

1. Fork this repository and clone it on your local system.
2. You should have either npm or yarn installed on your system.
3. Create a .env file in the root directory of this project and add following variables in it

```
PORT = # Some PORT number
DATABASE_URL= # Database URL
```

You should have postgres installed on your system. Create a database and add it's URL in the .env file 4. Install prisma and on terminal type

```
prisma migrate dev
```

This updates the database you created with the prisma schema present in the repo and this also generates a prisma client. 5. You can simply run

```
node --watch app.js
```

from your terminal to start the server 6. Open any browser and go to localhost://#PORT
where PORT is the Port your provided in .env file

## Usage

Here is a video of me using the web application
https://youtu.be/uC4RBC9p6a0

