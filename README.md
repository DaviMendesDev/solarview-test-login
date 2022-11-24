# Solar View Login Test

### Description
This is a project with the purpose to be a "Test Project" for the SolarView opportunity as FullStack Engineer,
The Project is a kinda small, since its features is very "simple" at once, but its frontend was very hard to work
on in only 2 days (yeah, I made this project in 2 days)

The Technologies of the project are:
* NextJS (of course, with ReactJS)
* Laravel
* MySQL
* Redis (for caching)

## Run
To run this project you just must follow some basic steps
### First
The project is divided between 'login-laravel' dir and 'login-react' dir,
they both implement each other (one as an SPA frontend, and other with Laravel on backend API)

## Running Laravel
To run Laravel, All that you must do is copying the `.env.example` file
to one new called `.env`, you can do this running the command below:

```shell
cp ./login-laravel/.env.example ./login-laravel/.env
```

After that, you need to run docker, don't worry, it should be way easier than you
might think:

```shell
cd ./login-laravel && docker compose -f docker-compose.dev.yml up --build
```

this command will also install all the composer dependencies and
run migrations too, so, we're done for Laravel now.

## Running NextJS
As (for simplicity) we want to run our NextJS App as a SSR, we should just
run a similar command as the last one:

```shell
cd ./login-react && docker compose -f docker-compose.dev.yml up --build
```

# And we're done
If you did run these commands, your both frontend and backend should work
as fine as possible, to ensure that, try to enter on:

http://localhost:8085