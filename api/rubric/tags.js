const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');
const page_details = require('../../utils/page_details.js')
const paginate = require('koa-ctx-paginate')

const router = new Router({
    prefix: '/tags'
});

module.exports = router;

router.get("/", async (ctx) => {
  try {
    var tags = {}
    if(ctx.query.search===undefined || ctx.query.search ==='')
    {   
        tags = await knex('tag').select('*');
        
    }
    else
    {
        var search = ctx.query.search
        tags = await knex('tag').select('*').where({title:search})
    }
    
    var page_info = await page_details.fn(ctx,tags)
    var results = page_info['results']
    var pageCount = page_info['pageCount']
    var itemCount = page_info['itemCount']

    if (!ctx.query.page || !ctx.query.limit) {
        ctx.body = {
            object: 'list',
            data: tags
        }
    }
    else {
        ctx.body = {
            users: results,
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
        !ctx.request.body.title
    ) {
        ctx.response.status = 400;
        ctx.body = 'Please enter the data';
    }
    else
    {   
        const uuid1 = await generate_uuid.fn();
        ctx.request.body.id = uuid1
        var user = await knex('tag').insert(ctx.request.body)
        var resp = await knex('tag').select('*').where({id: uuid1});
        ctx.body = {data:resp}
    }
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})

router.get("/:id", async (ctx) => {
  try {
    
    const tag = await knex('tag').select('*').where({ id: ctx.params.id });

    if(tag.length===0){
        ctx.body = {error:"Does not exist"}
    }
    else
    {
    ctx.body = {
      data: tag
        };
    }
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})


router.put('/:id', async (ctx) => {
  try {
        var id = await knex('tag').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('tag').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('tag').del().where({ id: ctx.params.id})
        var resp = await knex('tag').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 204
    ctx.body = {error:err}
  }
})