const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');
let get_m2m = require('../../utils/rubric_dependencies.js');
const page_details = require('../../utils/page_details.js')
const paginate = require('koa-ctx-paginate')

const router = new Router({
    prefix: '/rubrics'
});

module.exports = router;


function return_ids(data)
{   
    return data['rubric_id']
}


router.get("/", async (ctx) => {
  try {
    var rubrics =[]
    var rubric_id_array = []
    if(ctx.query.indicator)
    {   
        var indicator = ctx.query.indicator
        var rubric_ids = await knex('rubric_indicators').select('rubric_id').where({indicator_id:indicator})
        rubric_id_array = rubric_ids.map(return_ids)
        rubrics = await knex('Rubric').where((builder) =>
                                builder.whereIn('id', rubric_id_array))
    }

    if(rubrics.length==0 || ctx.query.indicator=='')
    {
        rubrics = await knex('Rubric').select('*');
    }

    var rubrics_w_indicators = await get_m2m.rubric_w_indicators(rubrics)
    
    var page_info = await page_details.fn(ctx,rubrics_w_indicators)
    var results = page_info['results']
    var pageCount = page_info['pageCount']
    var itemCount = page_info['itemCount']

    if (!ctx.query.page || !ctx.query.limit) {
        ctx.body = {
            object: 'list',
            data: rubrics_w_indicators
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
        !ctx.request.body.name ||
        !ctx.request.body.rating_scheme_id ||
        !ctx.request.body.account_id ||
        !ctx.request.body.indicators
    ) {
        ctx.response.status = 400;
        ctx.body = 'Please enter the data';
    }
    else
    {   
        const uuid1 = await generate_uuid.fn();
        ctx.request.body.id = uuid1
        var indicators = ctx.request.body.indicators

        delete ctx.request.body["indicators"];

        var rubric = await knex('Rubric').insert(ctx.request.body)
        var resp = await knex('Rubric').select('*').where({id: uuid1});

        indicator_length = indicators.length
        if(indicator_length!=0)
        {
            for(var i=0;i<indicator_length;i++)
            {
                const new_uuid = await generate_uuid.fn();
                var rubric_indicator = {id:new_uuid, indicator_id:indicators[i], rubric_id:uuid1}
                var rubric_indi = await knex('rubric_indicators').insert(rubric_indicator)
            }
        }

        var resp = await knex('Rubric').select('*').where({id: uuid1});
        resp[0]["indicators"] = indicators

        ctx.body = {data:resp}
    }
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})

router.get("/:id", async (ctx) => {
  try {
    
    const rubric = await knex('Rubric').select('*').where({ id: ctx.params.id });
    var rubrics_w_indicators = await get_m2m.rubric_w_indicators(rubric)

    if(rubric.length===0){
        ctx.body = {error:"Does not exist"}
    }
    else
    {
    ctx.body = {
      data: rubrics_w_indicators
        };
    }
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})


router.put('/:id', async (ctx) => {
  try {
        var id = await knex('Rubric').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('Rubric').select('*').where({ id: ctx.params.id});
        
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var indicators = await knex('rubric_indicators').del().where({rubric_id: ctx.params.id})
        var id = await knex('Rubric').del().where({ id: ctx.params.id})
        var resp = await knex('Rubric').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
        
  } catch (err) {
    ctx.status = 204
    ctx.body = {error:err}
  }
})