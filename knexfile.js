// Update with your config settings.

module.exports = {
  client: 'pg',
  version: '7.2',
  connection: {
    host : 'localhost',
    port : 5432,
    user : 'postgres',
    password : 'admin1234',
    database : 'sensei_koa',
    "use_env_variable": "DATABASE_URL"
  }
}