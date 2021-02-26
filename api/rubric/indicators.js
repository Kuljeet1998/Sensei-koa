const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');
/*const page = require('../utils/pageable.js');*/
const page_details = require('../../utils/page_details.js')

const router = new Router({
    prefix: '/indicators'
});


let get_m2m = require('../../utils/indicator_dependencies.js');
module.exports = router;
/*const { middleware } = require('koa-pagination');
const { Pageable, IndexablePage, paginate } = require('@panderalabs/koa-pageable');*/
/*import * as paginate from 'koa-ctx-paginate';*/
const paginate = require('koa-ctx-paginate')


router.get("/", async (ctx) => {
  try {
        const indicators = await knex('indicator').select('*');
        var indicators_w_dependencies = await get_m2m.fn(indicators)

        var page_info = await page_details.fn(ctx,indicators_w_dependencies)
        var results = page_info['results']
        var pageCount = page_info['pageCount']
        var itemCount = page_info['itemCount']

        if (!ctx.query.page || !ctx.query.limit) {
            ctx.body = {
                object: 'list',
                data: indicators_w_dependencies
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
                const new_uuid = await generate_uuid.fn();
                var indicator_tag = {id:new_uuid, indicator_id:uuid1, tag_id:tags[i]}
                var indi_tag = await knex('indicator_tags').insert(indicator_tag)
            }
        }

        
        props_length = propositions.length
        if(props_length!=0)
        {
            for(var i=0;i<props_length;i++)
            {
                const new_uuid = await generate_uuid.fn();
                var indicator_proposition = {id:new_uuid, indicator_id:uuid1, proposition_id:propositions[i]}
                var indi_prop = await knex('indicator_propositions').insert(indicator_proposition)
            }
        }

        
        subprops_length = subprops.length
        if(subprops_length!=0)
        {
            for(var i=0;i<subprops_length;i++)
            {
                const new_uuid = await generate_uuid.fn();
                var indicator_subproposition = {id:new_uuid, indicator_id:uuid1, subproposition_id:subprops[i]}
                var indi_subprop = await knex('indicator_subpropositions').insert(indicator_subproposition)
            }
        }

        
        types_length = types.length
        if(types_length!=0)
        {
            for(var i=0;i<types_length;i++)
            {
                const new_uuid = await generate_uuid.fn();
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
    ctx.status = 404
    ctx.body = {error:err}
  }
})


router.get("/:id", async (ctx) => {
  try {

    const indicator = await knex('indicator').select('*').where({ id: ctx.params.id });
    var indicators_w_dependencies = await get_m2m.fn(indicator)
    
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
    ctx.status = 404
    ctx.body = {error:err}
  }
})


/*router.put('/:id', async (ctx) => {
  try {
    let token = ctx.request.headers['authorization'];
    var check = await validate.fn(token)
    if(check!==true)
    {
        ctx.body=check
    }
    else
    {
        var id = await knex('indicator').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('indicator').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    }
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})*/

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('indicator').del().where({ id: ctx.params.id})
        var resp = await knex('indicator').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 204
    ctx.body = {error:err}
  }
})