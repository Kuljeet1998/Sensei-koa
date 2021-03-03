// Update with your config settings.

/*module.exports = {
  client: 'pg',
  connection: {
    host: "localhost",
    port : 5432,
    user : 'postgres',
    password : 'admin1234',
    database : 'sensei_koa',
    max: 10,
    use_env_variable: "postgres://fbcvnfcjsunupi:0406bf83512cf45cc2430a1ff1a2d60194139cab081d98ffbd1deac4488c349f@ec2-3-232-163-23.compute-1.amazonaws.com:5432/d463teparurj33"
  }
}*/

/*var config = process.env.DATABASE_URL
if(config!==undefined)
{   
    console.log(config)
    config += '&ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory'
}*/

/*const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports ={
    client: 'pg',
    connection: process.env.DATABASE_URL || { user: 'postgres', 
                                                database: 'sensei_koa',
                                                host: "localhost",
                                                password : 'admin1234',
                                                port : 5432}
}

const Pool = require('pg-pool');
const url = require('url')

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');
*/
const config = {
  user: "fbcvnfcjsunupi",
  password: "0406bf83512cf45cc2430a1ff1a2d60194139cab081d98ffbd1deac4488c349f",
  host: 'ec2-3-232-163-23.compute-1.amazonaws.com',
  port: '5432',
  database: "d463teparurj33",
  ssl: { rejectUnauthorized: false },
  sslfactory:"org.postgresql.ssl.NonValidatingFactory"
};

/*const pool = new Pool(config);*/



var config1 = process.env.DATABASE_URL
if(config1!==undefined)
{   
    module.exports = {
    client:'pg',
    connection: config
    }
}
else
{
    module.exports = {
    client: 'pg',
    connection: { user: 'postgres', 
                    database: 'sensei_koa',
                    host: "localhost",
                    password : 'admin1234',
                    port : 5432}
}
}