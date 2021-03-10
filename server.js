// app.js
'use strict';
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();

const config = require('./knexfile.js')
const knex = require('knex')(config)
var serve = require('koa-static');

//koa-admin config
/*const AdminBro = require('admin-bro')
const { buildRouter } = require('@admin-bro/koa')
const AdminBroSequelize = require('@admin-bro/sequelize')
AdminBro.registerAdapter(AdminBroSequelize)

const run = async () => {
 
  const { Client } = require('pg');
  const pg = require('pg')
  const pool = new pg.Pool(config);

    var client = new Client({
                    user: 'postgres', 
                    database: 'sensei_koa',
                    host: "localhost",
                    password : 'admin1234',
                    port : 5432,
                    useNewUrlParser: true,
    });


const props = await knex('proposition')
const PROPS = require('./api/rubric/propositions.js');

const adminBro = new AdminBro({
  Database: [pool],
  rootPath: '/admin',
})

const router = buildRouter(adminBro, app)
app
  .use(router.routes())
  .use(router.allowedMethods())
app.use(PROPS.routes()); 

}*/
//---------------------


app.use(serve('./'));

// Set up body parsing middleware
app.use(koaBody());
var jwt = require('koa-jwt');
const jwt1 = require('jsonwebtoken');

// Require the Router we defined in books.js
let user = require('./api/user/users.js');
let token = require('./api/user/token.js'); //not being used
let prop = require('./api/rubric/propositions.js');
let subprop = require('./api/rubric/subpropositions.js');
let tag = require('./api/rubric/tags.js');
let type = require('./api/rubric/types.js');
let indicator = require('./api/rubric/indicators.js');
let login = require('./api/user/login.js');
let rating_scheme = require('./api/observation/rating_scheme.js');
let account = require('./api/common/accounts.js');
let rating = require('./api/observation/ratings.js');
let rubric = require('./api/observation/rubrics.js');
let group = require('./api/common/groups.js');
let observation = require('./api/observation/observations.js');
let evidence = require('./api/observation/evidences.js');



// Use the Router on the sub route /books
app.use(login.routes());
app.use(user.routes());
app.use(token.routes()); //Not being used now

app.use(jwt({secret:'password'}).unless({ path: [/^\/admin/] })) //will add the secret key i.e. 'password' to another file which is not in repo like secrets.json in django  
app.use(prop.routes()); 
app.use(tag.routes());
app.use(type.routes());
app.use(indicator.routes());
app.use(subprop.routes());
app.use(rating_scheme.routes());
app.use(account.routes());
app.use(rating.routes());
app.use(rubric.routes());
app.use(group.routes());
app.use(observation.routes());
app.use(evidence.routes());


app.use(koaBody({
   formidable:{uploadDir: './uploads',
                keepExtensions: true},    //This is where the files would come
   multipart: true,
   urlencoded: true
}));
let attachment = require('./api/common/attachment.js');
app.use(attachment.routes());

console.log(config)
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}.`)})
/*console.log("SERVER",server)*/
module.exports = server;
/*run()*/