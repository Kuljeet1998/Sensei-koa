const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');
const toslug = require('../../utils/toSlug.js');
const page_details = require('../../utils/page_details.js')
const paginate = require('koa-ctx-paginate')

const router = new Router({
    prefix: '/types'
});


module.exports = router;

router.get("/", async (ctx) => {
  try {
    const types = await knex('type').select('*');
    
    var page_info = await page_details.fn(ctx,types)
    var results = page_info['results']
    var pageCount = page_info['pageCount']
    var itemCount = page_info['itemCount']

    if (!ctx.query.page || !ctx.query.limit) {
        ctx.body = {
            object: 'list',
            data: types
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
    ctx.status = 404
    ctx.body = {error:err}
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
    ctx.status = 404
    ctx.body = {error:err}
  }
})


router.put('/:id', async (ctx) => {
  try {
        var id = await knex('type').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('type').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('type').del().where({ id: ctx.params.id})
        var resp = await knex('type').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 204
    ctx.body = {error:err}
  }
})