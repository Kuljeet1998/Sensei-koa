const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');

const router = new Router({
    prefix: '/evidences'
});

module.exports = router;

router.get("/", async (ctx) => {
  try {
    const evidences = await knex('Evidence').select('*');

    ctx.body = {
      data: evidences
    };
    
  } catch (err) {
    console.log(err)
  }
})


router.post("/", async (ctx) => {
  try {
    if (
        !ctx.request.body.name ||
        !ctx.request.body.observee_id ||
        !ctx.request.body.indicators_data ||
        !ctx.request.body.ratings
    ) {
        ctx.response.status = 400;
        ctx.body = 'Please enter the data';
    }
    else
    {   
        const uuid1 = await generate_uuid.fn();
        ctx.request.body.id = uuid1

        var indicators = ctx.request.body.indicators_data.indicators
        var attachments = ctx.request.body.attachments
        var ratings = ctx.request.body.indicators_data.ratings

        delete ctx.request.body["indicators"];
        delete ctx.request.body["attachments"];
        delete ctx.request.body["ratings"];

        var observation = await knex('Evidence').insert(ctx.request.body)
        var resp = await knex('Evidence').select('*').where({id: uuid1});

        indicator_length = indicators.length
        if(indicator_length!=0)
        {
            for(var i=0;i<indicator_length;i++)
            {
                const new_uuid = await generate_uuid.fn();
                var evidence_indicator = {id:new_uuid, indicator_id:indicators[i], evidence_id:uuid1}
                var evidence_indi = await knex('evidence_indicators').insert(evidence_indicator)
            }
        }

        attachment_length = attachments.length
        if(attachment_length!=0)
        {
            for(var i=0;i<attachment_length;i++)
            {
                const new_uuid = await generate_uuid.fn();
                var evidence_attachment = {id:new_uuid, attachment_id:attachments[i], evidence_id:uuid1}
                var evidence_att = await knex('evidence_indicators').insert(evidence_attachment)
            }
        }

        rating_length = ratings.length
        if(rating_length!=0)
        {
            for(var i=0;i<rating_length;i++)
            {
                const new_uuid = await generate_uuid.fn();
                var indicator_rating = {id:new_uuid, indicator_id:ratings[i]['indicator'], evidence_id:uuid1, rating_id:ratings[i]['rating']}
                var indi_rating = await knex('IndicatorRating').insert(indicator_rating)
            }
        }

        resp[0]["indicators"] = indicators
        resp[0]["attachments"] = attachments
        resp[0]["ratings"] = ratings
        ctx.body = {data:resp}
    }
  } catch (err) {
    console.log(err)
  }
})

router.get("/:id", async (ctx) => {
  try {
    
    const observation = await knex('Evidence').select('*').where({ id: ctx.params.id });

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
        var id = await knex('Evidence').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('Evidence').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('Evidence').del().where({ id: ctx.params.id})
        var resp = await knex('Evidence').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
        
  } catch (err) {
    console.log(err)
  }
})