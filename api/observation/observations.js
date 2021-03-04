const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');
const page_details = require('../../utils/page_details.js')
const paginate = require('../../utils/paginate.js');

const router = new Router({
    prefix: '/observations'
});

module.exports = router;

router.get("/", async (ctx) => {
  try {
    const observations = await knex('Observation').select('*');

        var page_info = await page_details.fn(ctx,observations)
        var results = page_info['results']
        var pageCount = page_info['pageCount']
        var itemCount = page_info['itemCount']

        if (!ctx.query.page || !ctx.query.limit) {
            ctx.body = {
                data: observations
            }
        }
        else {
            ctx.body = {
                data: results,
                pageCount,
                itemCount,
                pages: paginate.getArrayPages(ctx)(3, parseInt(pageCount), parseInt(ctx.query.page))
            }
        }
    
  } catch (err) {
    ctx.status = 404
    console.log(err)
    ctx.body = {error:err}
  }
})


router.post("/", async (ctx) => {
  try {
    if (
        !ctx.request.body.name ||
        !ctx.request.body.rubric_id ||
        !ctx.request.body.group_id ||
        !ctx.request.body.observer_id ||
        !ctx.request.body.observee_id
    ) {
        ctx.response.status = 400;
        ctx.body = 'Please enter the data';
    }
    else
    {   
        const uuid1 = await generate_uuid.fn();
        ctx.request.body.id = uuid1

        var observation = await knex('Observation').insert(ctx.request.body)
        var resp = await knex('Observation').select('*').where({id: uuid1});
        ctx.body = {data:resp}
    }
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})

router.get("/:id", async (ctx) => {
  try {
    
    const observation = await knex('Observation').select('*').where({ id: ctx.params.id });

    if(observation.length===0){
        ctx.body = {error:"Does not exist"}
    }
    else
    {
    ctx.body = {
      data: observation
        };
    }
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})


router.put('/:id', async (ctx) => {
  try {
        var id = await knex('Observation').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('Observation').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('Observation').del().where({ id: ctx.params.id})
        var resp = await knex('Observation').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
        
  } catch (err) {
    ctx.status = 204
    ctx.body = {error:err}
  }
})