Steps to setup project locally:

1. Clone the repo to tour local machine.
2. Install npm, initialize npm; and therefore install all dependencies via npm.
3. Create a local DB in MySql.
4. Include knexfile.js in main directory containing DB setup information.
5. Run migrations using command 'knex migrate:latest'
5. Install nodemon; use nodemon to run the file 'server.js'

To run APIs:
1. Create a User w password.
2. Login w same credentials.
3. You'll get token as the result.
4. Use this token in header, Authorization: Bearer `token`

For attachments:
1. Create folder: 'uploads' in main directory

**In my local DB, table 'Evidence' has column 'observee_id' instead of 'observation'. So to run w/o error replace all 'observee_id' to 'observation' in /api/observation/evidence.js