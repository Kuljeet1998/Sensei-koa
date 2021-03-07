Steps to setup project locally:

1. Clone the repo to to your local machine.
2. Install npm, initialize npm; and therefore install all dependencies via npm.
3. Create a local DB in Postgres, change config in knexfile.js.
4. Run migrations using command 'knex migrate:latest'
5. Install nodemon; use nodemon to run the file 'server.js'

To run APIs:
1. Create a User w password.
2. Login w same credentials.
3. You'll get token as the result.
4. Use this token in header, Authorization: Bearer `token`
