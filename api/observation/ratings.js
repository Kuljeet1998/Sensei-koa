const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');
const page_details = require('../../utils/page_details.js')
const paginate = require('koa-ctx-paginate')

const router = new Router({
    prefix: '/ratings'
});

module.exports = router;

function return_rating_scheme_ids(data)
{   
    return data['rating_scheme_id']
}

router.get("/", async (ctx) => {
  try {
    var ratings = {}
    var rubrics = ctx.query.rating_scheme__rubrics
    var rating_id_array = []
    if(rubrics)
    {   
        rubrics = rubrics.split(',')
        var rating_scheme_ids = await knex('Rubric').select('rating_scheme_id').where((builder) =>
                                builder.whereIn('id', rubrics))
        rating_scheme_ids = rating_scheme_ids.map(return_rating_scheme_ids)
        ratings = await knex('Rating').where((builder) =>
                                builder.whereIn('rating_scheme_id', rating_scheme_ids))
    }

    if(Object.keys(ratings).length===0 || ratings.length==0 || rubrics=='')
    {
        ratings = await knex('Rating').select('*');
    }
    

    var page_info = await page_details.fn(ctx,ratings)
    var results = page_info['results']
    var pageCount = page_info['pageCount']
    var itemCount = page_info['itemCount']

    if (!ctx.query.page || !ctx.query.limit) {
        ctx.body = {
            object: 'list',
            data: ratings
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
    ctx.status = 404
    ctx.body = {error:err}
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
    ctx.status = 404
    ctx.body = {error:err}
  }
})


router.put('/:id', async (ctx) => {
  try {
        var id = await knex('Rating').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('Rating').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('Rating').del().where({ id: ctx.params.id})
        var resp = await knex('Rating').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 204
    ctx.body = {error:err}
  }
})