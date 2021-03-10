const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');
const page_details = require('../../utils/page_details.js')

const router = new Router({
    prefix: '/indicators'
});


let get_m2m = require('../../utils/indicator_dependencies.js');
module.exports = router;
const paginate = require('../../utils/paginate.js');


function return_ids(data)
{   
    return data['indicator_id']
}


router.get("/", async (ctx) => {
  try {
        var indicators = []
        var subprop = ctx.query.subproposition
        var prop = ctx.query.proposition
        var rubric = ctx.query.rubric
        var tag = ctx.query.tag
        var type = ctx.query.type
        var indicator_subprop = []
        var indicator_prop = []
        var indicator_rubric = []
        var indicator_tag = []
        var indicator_type = []
        var print_all = false

        if (subprop)
        {   
            subprop = subprop.split(',')
            indicator_subprop = await knex('indicator_subpropositions').select('indicator_id').where((builder) =>
                                            builder.whereIn('subproposition_id', subprop))
            indicator_subprop = indicator_subprop.map(return_ids)
        }
        if(prop)
        {
            prop = prop.split(',')
            indicator_prop = await knex('indicator_propositions').select('indicator_id').where((builder) =>
                                            builder.whereIn('proposition_id', prop))
            indicator_prop = indicator_prop.map(return_ids)
        }
        if(tag)
        {
            tag = tag.split(',')
            indicator_tag = await knex('indicator_tags').select('indicator_id').where((builder) =>
                                            builder.whereIn('tag_id', tag))
            indicator_tag = indicator_tag.map(return_ids)
        }
        if(type)
        {
            type = type.split(',')
            indicator_type = await knex('indicator_types').select('indicator_id').where((builder) =>
                                            builder.whereIn('type_id', type))
            indicator_type = indicator_type.map(return_ids)
        }
        if(rubric)
        {
            rubric = rubric.split(',')
            indicator_rubric = await knex('rubric_indicators').select('indicator_id').where((builder) =>
                                            builder.whereIn('rubric_id', rubric))
            indicator_rubric = indicator_rubric.map(return_ids)
        }

        else if((!subprop && !prop && !rubric && !tag && !type) || (subprop=='' || prop=='' || rubric=='' || tag=='' || type==''))
        {
            indicators = await knex('indicator').select('*');
            print_all = true
        }

        if(print_all==false)
        {
            //merge all arrays
            indicators = [].concat(indicator_subprop, indicator_prop, indicator_tag, indicator_type, indicator_rubric) ;
            indicators = new Set(indicators); //to remove duplicates
            indicators = Array.from(indicators); //convert back to array
            indicators = await knex('indicator').where((builder) =>
                                            builder.whereIn('id', indicators))
        }


        var indicators_w_dependencies = await get_m2m.indicator_dependencies(indicators)

        var page_info = await page_details.get_page_info(ctx,indicators_w_dependencies)
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
    ctx.status = 404,
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

        var tags = ctx.request.body.tags
        var propositions = ctx.request.body.propositions
        var subprops = ctx.request.body.subpropositions
        var types = ctx.request.body.types

        delete ctx.request.body["tags"];
        delete ctx.request.body["propositions"];
        delete ctx.request.body["subpropositions"];
        delete ctx.request.body["types"];

        var indicator = await knex('indicator').insert(ctx.request.body)
        
        
        tags_length = tags.length
        if(tags_length!=0)
        {
            for(var i=0;i<tags_length;i++)
            {
                const new_uuid = await generate_uuid.get_uuid();
                var indicator_tag = {id:new_uuid, indicator_id:uuid1, tag_id:tags[i]}
                var indi_tag = await knex('indicator_tags').insert(indicator_tag)
            }
        }

        
        props_length = propositions.length
        if(props_length!=0)
        {
            for(var i=0;i<props_length;i++)
            {
                const new_uuid = await generate_uuid.get_uuid();
                var indicator_proposition = {id:new_uuid, indicator_id:uuid1, proposition_id:propositions[i]}
                var indi_prop = await knex('indicator_propositions').insert(indicator_proposition)
            }
        }

        
        subprops_length = subprops.length
        if(subprops_length!=0)
        {
            for(var i=0;i<subprops_length;i++)
            {
                const new_uuid = await generate_uuid.get_uuid();
                var indicator_subproposition = {id:new_uuid, indicator_id:uuid1, subproposition_id:subprops[i]}
                var indi_subprop = await knex('indicator_subpropositions').insert(indicator_subproposition)
            }
        }

        
        types_length = types.length
        if(types_length!=0)
        {
            for(var i=0;i<types_length;i++)
            {
                const new_uuid = await generate_uuid.get_uuid();
                var indicator_type = {id:new_uuid, indicator_id:uuid1, type_id:types[i]}
                var indi_type = await knex('indicator_types').insert(indicator_type)
            }
        }

        
        var resp = await knex('indicator').select('*').where({id: uuid1});
        resp[0]["tags"] = tags
        resp[0]["propositions"] = propositions
        resp[0]["subpropositions"] = subprops
        resp[0]["types"] = types

        ctx.body = {data:resp}
    
    }
  } catch (err) {
    ctx.status = 404,
    console.log(err),
    ctx.body = {error:err}
  }
})


router.get("/:id", async (ctx) => {
  try {

    const indicator = await knex('indicator').select('*').where({ id: ctx.params.id });
    var indicators_w_dependencies = await get_m2m.indicator_dependencies(indicator)
    
    if(indicator.length===0){
        ctx.body = {error:"Does not exist"}
    }
    else
    {
    ctx.body = {
      data: indicators_w_dependencies
        };
    }
    
  } catch (err) {
    ctx.status = 404,
    console.log(err),
    ctx.body = {error:err}
  }
})


router.put('/:id', async (ctx) => {
  try 
    {

        var tags = ctx.request.body.tags
        var propositions = ctx.request.body.propositions
        var subprops = ctx.request.body.subpropositions
        var types = ctx.request.body.types

        delete ctx.request.body["tags"];
        delete ctx.request.body["propositions"];
        delete ctx.request.body["subpropositions"];
        delete ctx.request.body["types"];

        var id = await knex('indicator').update(ctx.request.body).where({ id: ctx.params.id})

        var delete_tags = await knex('indicator_tags').del().where({indicator_id:ctx.params.id})
        var delete_propositions = await knex('indicator_propositions').del().where({indicator_id:ctx.params.id})
        var delete_subprops = await knex('indicator_subpropositions').del().where({indicator_id:ctx.params.id})
        var delete_types = await knex('indicator_types').del().where({indicator_id:ctx.params.id})
        
        
        tags_length = tags.length
        if(tags_length!=0)
        {
            

            for(var i=0;i<tags_length;i++)
            {
                const new_uuid = await generate_uuid.get_uuid();
                var indicator_tag = {id:new_uuid, indicator_id:ctx.params.id, tag_id:tags[i]}
                var indi_tag = await knex('indicator_tags').insert(indicator_tag)
            }
        }

        
        props_length = propositions.length
        if(props_length!=0)
        {
            

            for(var i=0;i<props_length;i++)
            {
                const new_uuid = await generate_uuid.get_uuid();
                var indicator_proposition = {id:new_uuid, indicator_id:ctx.params.id, proposition_id:propositions[i]}
                var indi_prop = await knex('indicator_propositions').insert(indicator_proposition)
            }
        }

        
        subprops_length = subprops.length
        if(subprops_length!=0)
        {
            
            for(var i=0;i<subprops_length;i++)
            {
                const new_uuid = await generate_uuid.get_uuid();
                var indicator_subproposition = {id:new_uuid, indicator_id:ctx.params.id, subproposition_id:subprops[i]}
                var indi_subprop = await knex('indicator_subpropositions').insert(indicator_subproposition)
            }
        }

        
        types_length = types.length
        if(types_length!=0)
        {
            
            for(var i=0;i<types_length;i++)
            {
                const new_uuid = await generate_uuid.get_uuid();
                var indicator_type = {id:new_uuid, indicator_id:ctx.params.id, type_id:types[i]}
                var indi_type = await knex('indicator_types').insert(indicator_type)
            }
        }

        
        var resp = await knex('indicator').select('*').where({id: ctx.params.id});
        var indicators_w_dependencies = await get_m2m.indicator_dependencies(resp)
    

    ctx.body = {data:indicators_w_dependencies}

  } catch (err) {
    ctx.status = 404,
    console.log(err)
    ctx.body = {error:err}
  }
})

router.delete('/:id', async (ctx) => {
  try {
        
        var delete_tags = await knex('indicator_tags').del().where({indicator_id:ctx.params.id})
        var delete_propositions = await knex('indicator_propositions').del().where({indicator_id:ctx.params.id})
        var delete_subprops = await knex('indicator_subpropositions').del().where({indicator_id:ctx.params.id})
        var delete_types = await knex('indicator_types').del().where({indicator_id:ctx.params.id})
        var id = await knex('indicator').del().where({ id: ctx.params.id})
        var resp = await knex('indicator').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 204,
    console.log(err),
    ctx.body = {error:err}
  }
})