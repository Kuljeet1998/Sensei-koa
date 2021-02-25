const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');

const router = new Router({
    prefix: '/observations'
});

module.exports = router;

router.get("/", async (ctx) => {
  try {
    const observations = await knex('Observation').select('*');

    ctx.body = {
      data: observations
    };
    
  } catch (err) {
    console.log(err)
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
    console.log(err)
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
    console.log(err)
  }
})


router.put('/:id', async (ctx) => {
  try {
        var id = await knex('Observation').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('Observation').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('Observation').del().where({ id: ctx.params.id})
        var resp = await knex('Observation').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
        
  } catch (err) {
    console.log(err)
  }
})