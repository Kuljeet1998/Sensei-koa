const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');

const router = new Router({
    prefix: '/propositions'
});

const page_details = require('../../utils/page_details.js')

module.exports = router;
const paginate = require('../../utils/paginate.js');

router.get("/",  async (ctx) => {
  try {
    const props = await knex('proposition').select('*');

    var page_info = await page_details.get_page_info(ctx,props)
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
        const uuid1 = await generate_uuid.get_uuid();
        ctx.request.body.id = uuid1
        var prop = await knex('proposition').insert(ctx.request.body)
        var resp = await knex('proposition').select('*').where({id: uuid1});
        ctx.body = {data:resp}
    }
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})

router.get("/:id", async (ctx) => {
  try {

    const prop = await knex('proposition').select('*').where({ id: ctx.params.id });

    if(prop.length===0){
        ctx.body = {error:"Does not exist"}
    }
    else
    {
    ctx.body = {
      data: prop
        };
    }
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})


router.put('/:id', async (ctx) => {
  try {

        var id = await knex('proposition').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('proposition').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('proposition').del().where({ id: ctx.params.id})
        var resp = await knex('proposition').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 204
    ctx.body = {error:err}
  }
})