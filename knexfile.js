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

var config = process.env.DATABASE_URL
if(config!==undefined)
{   
    console.log(config)
    config += '&ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory'
}
module.exports ={
    client: 'pg',
    connection: config || { user: 'postgres', 
                                                database: 'sensei_koa',
                                                host: "localhost",
                                                password : 'admin1234',
                                                port : 5432}
}