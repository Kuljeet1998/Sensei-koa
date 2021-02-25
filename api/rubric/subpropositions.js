const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');

const router = new Router({
    prefix: '/subpropositions'
});


module.exports = router;


var jwt = require('koa-jwt');
router.get("/",  async (ctx) => {
  try {
    const subprops = await knex('subproposition').select('*');
    ctx.body = {
      data: subprops
    };
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})


router.post("/", async (ctx) => {
  try {
    if (
        !ctx.request.body.title
    ) {
        ctx.response.status = 400;
        ctx.body = 'Please enter the data';
    }
    else
    {   
        const uuid1 = await generate_uuid.fn();
        ctx.request.body.id = uuid1
        var subprop = await knex('subproposition').insert(ctx.request.body)
        var resp = await knex('subproposition').select('*').where({id: uuid1});
        ctx.body = {data:resp}
    }
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})

router.get("/:id", async (ctx) => {
  try {
    const subprop = await knex('subproposition').select('*').where({ id: ctx.params.id });

    if(subprop.length===0){
        ctx.body = {error:"Does not exist"}
    }
    else
    {
    ctx.body = {
      data: subprop
        };
    }
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})


router.put('/:id', async (ctx) => {
  try {
        var id = await knex('subproposition').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('subproposition').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}      
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('subproposition').del().where({ id: ctx.params.id})
        var resp = await knex('subproposition').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 204
    ctx.body = {error:err}
  }
})