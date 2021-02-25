const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');

const router = new Router({
    prefix: '/rating-scheme'
});

module.exports = router;

router.get("/", async (ctx) => {
  try {
    const RatingSchemes = await knex('RatingScheme').select('*');
    ctx.body = {
      data: RatingSchemes
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
        console.log("uuid",uuid1)
        ctx.request.body.id = uuid1
        var user = await knex('RatingScheme').insert(ctx.request.body)
        var resp = await knex('RatingScheme').select('*').where({id: uuid1});
        ctx.body = {data:resp}
    }
  } catch (err) {
    console.log(err)
  }
})

router.get("/:id", async (ctx) => {
  try {
    
    const RatingScheme = await knex('RatingScheme').select('*').where({ id: ctx.params.id });

    if(RatingScheme.length===0){
        ctx.body = {error:"Does not exist"}
    }
    else
    {
    ctx.body = {
      data: RatingScheme
        };
    }
    
  } catch (err) {
    console.log(err)
  }
})


router.put('/:id', async (ctx) => {
  try {
        var id = await knex('RatingScheme').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('RatingScheme').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('RatingScheme').del().where({ id: ctx.params.id})
        var resp = await knex('RatingScheme').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    console.log(err)
  }
})