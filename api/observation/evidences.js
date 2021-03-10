const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');
const page_details = require('../../utils/page_details.js')
const paginate = require('../../utils/paginate.js');

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

    var page_info = await page_details.get_page_info(ctx,evidences_w_dependencies)
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
        !ctx.request.body.name ||
        !ctx.request.body.observation_id ||
        !ctx.request.body.indicators_data
    ) {
        ctx.response.status = 400;
        ctx.body = 'Please enter the data';
    }
    else
    {   
        const uuid1 = await generate_uuid.get_uuid();
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
                const new_uuid = await generate_uuid.get_uuid();
                var indicator_rating = {id:new_uuid, indicator_id:rated_indicators[i]['indicator'], evidence_id:uuid1, rating_id:rated_indicators[i]['rating']}
                var indi_rating = await knex('IndicatorRating').insert(indicator_rating)
            }
        }

        attachment_length = attachments.length
        if(attachment_length!=0)
        {
            for(var i=0;i<attachment_length;i++)
            {
                const new_uuid = await generate_uuid.get_uuid();
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
        var indicators = ctx.request.body.indicators

        delete ctx.request.body["attachments"];
        delete ctx.request.body["indicators"];

        var id = await knex('Evidence').update(ctx.request.body).where({ id: ctx.params.id})
        var delete_attachments = await knex('evidence_attachments').del().where({evidence_id:ctx.params.id})
        var delete_indicators = await knex('evidence_indicators').del().where({evidence_id:ctx.params.id})

        attachments_length = attachments.length
        if(attachments_length!=0)
        {
            for(var i=0;i<attachments_length;i++)
            {
                const new_uuid = await generate_uuid.get_uuid();
                var data = {id:new_uuid, evidence_id:ctx.params.id, attachment_id:attachments[i]}
                var resp = await knex('evidence_attachments').insert(data)
            }
        }

        indicators_length = indicators.length
        if(indicators_length!=0)
        {
            for(var i=0;i<indicators_length;i++)
            {
                const new_uuid = await generate_uuid.get_uuid();
                var data = {id:new_uuid, evidence_id:ctx.params.id, indicator_id:indicators[i]}
                var resp = await knex('evidence_indicators').insert(data)
            }
        }

        var evidences = await knex('Evidence').select('*').where({id: ctx.params.id});
        var evidences_w_dependencies = await get_m2m.evidence_w_dependencies(evidences)

        ctx.body = {data:evidences_w_dependencies}
    
  } catch (err) {
    ctx.status = 404
    console.log(err)
    ctx.body = {error:err}
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var indicator_rating = await('IndicatorRating').del().where({ evidence_id : ctx.params.id })
        var id = await knex('Evidence').del().where({ id: ctx.params.id})
        var resp = await knex('Evidence').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
        
  } catch (err) {
    ctx.status = 204
    ctx.body = {error:err}
  }
})