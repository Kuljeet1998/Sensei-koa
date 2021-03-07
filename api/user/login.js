const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');


var jwt = require('koa-jwt');
const jwt1 = require('jsonwebtoken');


const router = new Router({
    prefix: '/login'
});

module.exports = router;

router.post("/", async (ctx) => {
  try {
    if (
        !ctx.request.body.username ||
        !ctx.request.body.password
    ) {
        ctx.response.status = 400;
        ctx.body = 'Please enter the data';
    }
    else
    {   
        password = ctx.request.body.password
        var username = ctx.request.body.username

        check_password = await knex('User').select('password').where({username:ctx.request.body.username});
 
        var token = check_password[0]['password']
        var decoded_password = jwt1.decode(check_password[0]['password'])
        decoded_password = decoded_password.username

        if (password !== decoded_password)
        {   
            ctx.body = {error:"password doesn't match"}
        }
        else
        {
            ctx.body ={token:token}
        }
    }
  } catch (err) {
    ctx.status = 404,
    console.log(err),
    ctx.body = {error:"Incorrect username"}
  }
})