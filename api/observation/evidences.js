const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');

const router = new Router({
    prefix: '/evidences'
});

let get_m2m = require('../../utils/evidence_dependencies.js');
module.exports = router;


function return_ids(data)
{   
    return data['id']
}


router.get("/", async (ctx) => {
  try 
  {
    var evidences = []
    var observations = []
    var observation = ctx.query.observation
    var observer = ctx.query.observation__observer
    var is_empty = false

    if(observation)
    {
        observation = observation.split(',')
        evidences = await knex('Evidence').select('*').where((builder) =>
                                builder.whereIn('observation_id', observation))
    }
    if(observer)
    {
        observer = observer.split(',')
        observations = await knex('Observation').select('id').where((builder) =>
                                builder.whereIn('observer_id', observer))
        observations = observations.map(return_ids)

        //check if filter by observaion is also used
        if(evidences.length>0)
        {
            var evidences_wrt_observer = await knex('Evidence').select('*').where((builder) =>
                                                    builder.whereIn('observation_id', observations))

            evidences = evidences.filter(value => evidences_wrt_observer.includes(value));
            //set a varibale to inform that evidence array is empty after filtering
            if(evidences.length==0)
            {
                is_empty = true
            }
        }
        else
        {
            evidences = await knex('Evidence').select('*').where((builder) =>
                                builder.whereIn('observation_id', observations))
        }
    }
    if((evidences.length==0 && is_empty==false) || (observation==='' && observer===''))
    {
        evidences = await knex('Evidence').select('*');
    }

    
    var evidences_w_dependencies = await get_m2m.evidence_w_dependencies(evidences)

    ctx.body = {
      data: evidences_w_dependencies
    };
    
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
        !ctx.request.body.observation_id ||
        !ctx.request.body.indicators_data
    ) {
        ctx.response.status = 400;
        ctx.body = 'Please enter the data';
    }
    else
    {   
        const uuid1 = await generate_uuid.fn();
        ctx.request.body.id = uuid1

        var attachments = ctx.request.body.attachments
        var rated_indicators = ctx.request.body.indicators_data

        delete ctx.request.body["attachments"];
        delete ctx.request.body["indicators_data"];

        var evidence = await knex('Evidence').insert(ctx.request.body)
        var resp = await knex('Evidence').select('*').where({id: uuid1});

        rated_indicators_length = rated_indicators.length
        if(rated_indicators_length!=0)
        {
            for(var i=0;i<rated_indicators_length;i++)
            {
                const new_uuid = await generate_uuid.fn();
                var indicator_rating = {id:new_uuid, indicator_id:rated_indicators[i]['indicator'], evidence_id:uuid1, rating_id:rated_indicators[i]['rating']}
                var indi_rating = await knex('IndicatorRating').insert(indicator_rating)
            }
        }

        attachment_length = attachments.length
        if(attachment_length!=0)
        {
            for(var i=0;i<attachment_length;i++)
            {
                const new_uuid = await generate_uuid.fn();
                var evidence_attachment = {id:new_uuid, attachment_id:attachments[i], evidence_id:uuid1}
                var evidence_att = await knex('evidence_attachments').insert(evidence_attachment)
            }
        }

        resp[0]["attachments"] = attachments
        resp[0]['indicators_data'] = rated_indicators
        ctx.body = {data:resp}
    }
  } catch (err) {
    ctx.status = 404
    console.log(err)
    ctx.body = {error:err}
  }
})

router.get("/:id", async (ctx) => {
  try {
    
    const evidences = await knex('Evidence').select('*').where({ id: ctx.params.id });
    var evidences_w_dependencies = await get_m2m.evidence_w_dependencies(evidences)

    if(evidences.length===0){
        ctx.body = {error:"Does not exist"}
    }
    else
    {
    ctx.body = {
      data: evidences_w_dependencies
        };
    }
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})


router.put('/:id', async (ctx) => {
  try {
        var attachments = ctx.request.body.attachments
        var rated_indicators = ctx.request.body.indicators_data

        delete ctx.request.body["attachments"];
        delete ctx.request.body["indicators_data"];

        console.log(ctx.request.body)
        if(ctx.request.body !== {})
        {
            var id = await knex('Evidence').update(ctx.request.body).where({ id: ctx.params.id})
        }
        var resp = await knex('Evidence').select('*').where({ id: ctx.params.id});
        var evidence_id = ctx.params.id


        //Method 1 to update:
        rated_indicators_length = rated_indicators.length
        if(rated_indicators_length!=0)
        {
            for(var i=0;i<rated_indicators_length;i++)
            {
                const is_present = await knex('IndicatorRating').where({indicator_id:rated_indicators[i]['indicator'], evidence_id:evidence_id, rating_id:rated_indicators[i]['rating']})
                const is_indicator_present = await knex('IndicatorRating').where({indicator_id:rated_indicators[i]['indicator'], evidence_id:evidence_id})
                if(is_present!==undefined) ///The entered indicator-rating is already present
                {
                    continue;
                }
                else if(is_present===undefined && is_indicator_present===undefined) ///New indicator rating
                {
                    const new_uuid = await generate_uuid.fn();
                    var indicator_rating = {id:new_uuid, indicator_id:rated_indicators[i]['indicator'], evidence_id:evidence_id, rating_id:rated_indicators[i]['rating']}
                    var indi_rating = await knex('IndicatorRating').insert(indicator_rating)
                }
                else if(rated_indicators[i]['rating']!== is_indicator_present['rating_id'])///Indicator already present, but different rating
                {
                    var indicator_rating = await knex('IndicatorRating').update(rated_indicators[i]['rating']).where({indicator_id:rated_indicators[i]['indicator'], evidence_id:evidence_id})
                }
            }
        }
        else ///Blank indicator_data -> delete all
        {
            const indicator_rating = await knex('IndicatorRating').del().where({evidence_id:evidence_id})
        }


        ///Method 2:
        attachment_length = attachments.length
        var delete_all = await knex('evidence_attachments').del().where({evidence_id:evidence_id})
        if(attachment_length!=0)
        {
            for(var i=0; i<attachment_length;i++)
            {
                const new_uuid = await generate_uuid.fn();
                var evidence_attachment = await knex('evidence_attachments').insert({id:new_uuid,evidence_id:evidence_id,attachment_id:attachment_id})
            }
        }

        var evidences_w_dependencies = await get_m2m.evidence_w_dependencies(resp)
        ctx.body = {data:evidences_w_dependencies}
    
  } catch (err) {
    ctx.status = 404
    console.log(err)
    ctx.body = {error:err}
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('Evidence').del().where({ id: ctx.params.id})
        var resp = await knex('Evidence').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
        
  } catch (err) {
    ctx.status = 204
    ctx.body = {error:err}
  }
})