const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');

const router = new Router({
    prefix: '/ratings'
});

module.exports = router;

router.get("/", async (ctx) => {
  try {
    const ratings = await knex('Rating').select('*');
    ctx.body = {
      data: ratings
    };
    
  } catch (err) {
    console.log(err)
  }
})


router.post("/", async (ctx) => {
  try {
    if (
        !ctx.request.body.name ||
        !ctx.request.body.rating_scheme_id ||
        !ctx.request.body.account_id ||
        !toString(ctx.request.body.score)
    ) {
        ctx.response.status = 400;
        ctx.body = 'Please enter the data';
    }
    else
    {   
        const uuid1 = await generate_uuid.fn();
        ctx.request.body.id = uuid1
        var rating = await knex('Rating').insert(ctx.request.body)
        var resp = await knex('Rating').select('*').where({id: uuid1});
        ctx.body = {data:resp}
    }
  } catch (err) {
    console.log(err)
  }
})

router.get("/:id", async (ctx) => {
  try {
    
    const rating = await knex('Rating').select('*').where({ id: ctx.params.id });

    if(rating.length===0){
        ctx.body = {error:"Does not exist"}
    }
    else
    {
    ctx.body = {
      data: rating
        };
    }
    
  } catch (err) {
    console.log(err)
  }
})


router.put('/:id', async (ctx) => {
  try {
        var id = await knex('Rating').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('Rating').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('Rating').del().where({ id: ctx.params.id})
        var resp = await knex('Rating').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    console.log(err)
  }
})