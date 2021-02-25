const config = require('../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../utils/uuid.js');

const router = new Router({
    prefix: '/propositions'
});

const page_details = require('../utils/page_details.js')

module.exports = router;
const paginate = require('koa-ctx-paginate')

router.get("/",  async (ctx) => {
  try {
    const props = await knex('proposition').select('*');

    if (!ctx.query.page || !ctx.query.limit) {
            ctx.body = {
                object: 'list',
                data: props
            }
        }
    else {
            var page_info = await page_details.fn(ctx,props)
            var results = page_info['results']
            var pageCount = page_info['pageCount']
            var itemCount = page_info['itemCount']
            ctx.body = {
                users: results,
                pageCount,
                itemCount,
                pages: paginate.getArrayPages(ctx)(3, parseInt(pageCount), parseInt(ctx.query.page))
            }
        }
    
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
        console.log("uuid",uuid1)
        ctx.request.body.id = uuid1
        var prop = await knex('proposition').insert(ctx.request.body)
        var resp = await knex('proposition').select('*').where({id: uuid1});
        ctx.body = {data:resp}
    }
  } catch (err) {
    console.log(err)
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
    console.log(err)
  }
})


router.put('/:id', async (ctx) => {
  try {

        var id = await knex('proposition').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('proposition').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('proposition').del().where({ id: ctx.params.id})
        var resp = await knex('proposition').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    console.log(err)
  }
})