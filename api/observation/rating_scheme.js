const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');
const page_details = require('../../utils/page_details.js')
const paginate = require('../../utils/paginate.js');

const router = new Router({
    prefix: '/rating-scheme'
});

module.exports = router;

router.get("/", async (ctx) => {
  try {
    const RatingSchemes = await knex('RatingScheme').select('*');
    var page_info = await page_details.fn(ctx,RatingSchemes)
    var results = page_info['results']
    var pageCount = page_info['pageCount']
    var itemCount = page_info['itemCount']

    if (!ctx.query.page) {
        ctx.body = {
            data: results,
            pageCount,
            itemCount,
            pages: paginate.getArrayPages(ctx)(3, parseInt(pageCount), 1)
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
    ctx.body = {error:err}
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
    ctx.status = 404
    ctx.body = {error:err}
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
    ctx.status = 404
    ctx.body = {error:err}
  }
})


router.put('/:id', async (ctx) => {
  try {
        var id = await knex('RatingScheme').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('RatingScheme').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('RatingScheme').del().where({ id: ctx.params.id})
        var resp = await knex('RatingScheme').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 204
    ctx.body = {error:err}
  }
})