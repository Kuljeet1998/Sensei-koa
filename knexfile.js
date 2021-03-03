// Update with your config settings.

const config = {
  user: "fbcvnfcjsunupi",
  password: "0406bf83512cf45cc2430a1ff1a2d60194139cab081d98ffbd1deac4488c349f",
  host: 'ec2-3-232-163-23.compute-1.amazonaws.com',
  port: '5432',
  database: "d463teparurj33",
  ssl: { rejectUnauthorized: false },
  sslfactory:"org.postgresql.ssl.NonValidatingFactory"
};


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