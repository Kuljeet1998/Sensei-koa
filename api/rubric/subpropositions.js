const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');
const page_details = require('../../utils/page_details.js')
const paginate = require('../../utils/paginate.js');

const router = new Router({
    prefix: '/subpropositions'
});


module.exports = router;


var jwt = require('koa-jwt');
router.get("/",  async (ctx) => {
  try {
    var subprops = {}
    if(ctx.query.sort===undefined || ctx.query.sort ==='')
    {   
        subprops = await knex('subproposition').select('*');
        
    }
    else
    {
        var sort_by = ctx.query.sort
        if (sort_by[0]==='-')
        {   
            sort_by = sort_by.split('-')[1]
            subprops = await knex('subproposition').select('*').orderBy(sort_by, 'desc')
        }
        else
        {
            subprops = await knex('subproposition').select('*').orderBy(sort_by)
        }
    }
    
    var page_info = await page_details.fn(ctx,subprops)
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