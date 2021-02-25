// app.js
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();

const config = require('./knexfile.js')
const knex = require('knex')(config)

// Set up body parsing middleware
app.use(koaBody());
var jwt = require('koa-jwt');
const jwt1 = require('jsonwebtoken');
const get_secrets = require('./utils/secrets_list.js');
// Require the Router we defined in books.js
let user = require('./api/users.js');
let token = require('./api/token.js');
let prop = require('./api/propositions.js');
let subprop = require('./api/subpropositions.js');
let tag = require('./api/tags.js');
let type = require('./api/types.js');
let indicator = require('./api/indicators.js');
let login = require('./api/login.js');
let rating_scheme = require('./api/observation/rating_scheme.js');
let attachment = require('./api/common/attachment.js');
let account = require('./api/common/accounts.js');
let rating = require('./api/observation/ratings.js');
let rubric = require('./api/observation/rubrics.js');
let group = require('./api/common/groups.js');
let observation = require('./api/observation/observations.js');

// Use the Router on the sub route /books
app.use(login.routes());
app.use(user.routes());
app.use(token.routes());

function return_password(data)
{
    return data['password']
}
app.use(jwt({ secret: async function secrets()
{
    var secret = await get_secrets.fn()
    var array = []
    array = secret.map(return_password)
    return array;
}}))
app.use(prop.routes()); 
app.use(tag.routes());
app.use(type.routes());
app.use(indicator.routes());
app.use(subprop.routes());
app.use(rating_scheme.routes());
app.use(attachment.routes());
app.use(account.routes());
app.use(rating.routes());
app.use(rubric.routes());
app.use(group.routes());
app.use(observation.routes());

app.listen(3000);