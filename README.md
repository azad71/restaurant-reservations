## Restaurant Reservations

This is my kind of Nextjs playground. I will experiment and implement different sort stuff here. So, what is restaurant reservations? Well, you can browse through a list of restaurants, look into restaurant menus and make reservations. That's it.

## Getting Started

To install dependencies, run `npm i`

Then, create a .env file at root. Put your `DATABASE_URL` env value inside. I am using Postgres. So, to be compliant with the defined schema, you should provide a Postgres db url too.

Then run, `npx prisma db push`

Then, run the development server:

`npm run dev` <br>
or <br>
`yarn dev`
