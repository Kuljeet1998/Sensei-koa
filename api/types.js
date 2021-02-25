const config = require('../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../utils/uuid.js');
const toslug = require('../utils/toSlug.js');

const router = new Router({
    prefix: '/types'
});


module.exports = router;

router.get("/", async (ctx) => {
  try {
    const types = await knex('type').select('*');
    ctx.body = {
      data: types
    };
  } catch (err) {
    console.log(err)
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
        slug = await toslug.fn(ctx.request.body.title)
        ctx.request.body.slug = slug
        var type = await knex('type').insert(ctx.request.body)
        var resp = await knex('type').select('*').where({id: uuid1});
        ctx.body = {data:resp}
    }
  } catch (err) {
    console.log(err)
  }
})

router.get("/:id", async (ctx) => {
  try {
    const type = await knex('type').select('*').where({ id: ctx.params.id });

    if(type.length===0){
        ctx.body = {error:"Does not exist"}
    }
    else
    {
    ctx.body = {
      data: type
        };
    }
  } catch (err) {
    console.log(err)
  }
})


router.put('/:id', async (ctx) => {
  try {
        var id = await knex('type').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('type').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('type').del().where({ id: ctx.params.id})
        var resp = await knex('type').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    console.log(err)
  }
})