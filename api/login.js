const config = require('../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../utils/uuid.js');


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
        check_password = await knex('User').select('password').where({username:ctx.request.body.username});
        if (check_password[0]['password'] !== password)
        {   
            ctx.body = {error:"password doesn't match"}
        }
        else
        {
            token = jwt1.sign({foo: 'bar'}, password);
            ctx.body ={token:token}
        }
    }
  } catch (err) {
    console.log(err)
  }
})