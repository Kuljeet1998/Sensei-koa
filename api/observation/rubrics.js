const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');
let get_m2m = require('../../utils/rubric_dependencies.js');

const router = new Router({
    prefix: '/rubrics'
});

module.exports = router;

router.get("/", async (ctx) => {
  try {
    const rubrics = await knex('Rubric').select('*');
    var rubrics_w_indicators = await get_m2m.rubric_w_indicators(rubrics)
    ctx.body = {
      data: rubrics_w_indicators
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
    console.log(err)
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
    console.log(err)
  }
})


router.put('/:id', async (ctx) => {
  try {
        var id = await knex('Rubric').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('Rubric').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var indicators = await knex('rubric_indicators').del().where({rubric_id: ctx.params.id})
        var id = await knex('Rubric').del().where({ id: ctx.params.id})
        var resp = await knex('Rubric').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
        
  } catch (err) {
    console.log(err)
  }
})