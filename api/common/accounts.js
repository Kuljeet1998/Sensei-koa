const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');

const router = new Router({
    prefix: '/accounts'
});

module.exports = router;

router.get("/", async (ctx) => {
  try {
    const accounts = await knex('Account').select('*');
    ctx.body = {
      data: accounts
    };
    
  } catch (err) {
    console.log(err)
  }
})


router.post("/", async (ctx) => {
  try {
    if (
        !ctx.request.body.name
    ) {
        ctx.response.status = 400;
        ctx.body = 'Please enter the data';
    }
    else
    {   
        const uuid1 = await generate_uuid.fn();
        ctx.request.body.id = uuid1
        var account = await knex('Account').insert(ctx.request.body)
        var resp = await knex('Account').select('*').where({id: uuid1});
        ctx.body = {data:resp}
    }
  } catch (err) {
    console.log(err)
  }
})

router.get("/:id", async (ctx) => {
  try {
    
    const account = await knex('Account').select('*').where({ id: ctx.params.id });

    if(account.length===0){
        ctx.body = {error:"Does not exist"}
    }
    else
    {
    ctx.body = {
      data: account
        };
    }
    
  } catch (err) {
    console.log(err)
  }
})


router.put('/:id', async (ctx) => {
  try {
        var id = await knex('Account').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('Account').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('Account').del().where({ id: ctx.params.id})
        var resp = await knex('Account').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    console.log(err)
  }
})