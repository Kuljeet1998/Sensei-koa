const config = require('../knexfile.js')
const knex = require('knex')(config)

function return_prop_ids(data)
{   
    return data['proposition_id']
}

function return_subprop_ids(data)
{   
    return data['subproposition_id']
}

function return_tag_ids(data)
{   
    return data['tag_id']
}

function return_type_ids(data)
{   
    return data['type_id']
}

exports.fn= async function get_dependencies(indicators)
{
    for(var i=0;i<indicators.length;i++)
    {
        var props = await knex('indicator_propositions').column('proposition_id').where({ indicator_id: indicators[i]['id']});
        var subprops = await knex('indicator_subpropositions').select('subproposition_id').where({ indicator_id: indicators[i]['id']});
        var tags = await knex('indicator_tags').select('tag_id').where({ indicator_id: indicators[i]['id']});
        var types = await knex('indicator_types').select('type_id').where({ indicator_id: indicators[i]['id']});

        var props_length = props.length;
        var subprops_length = subprops.length;
        var tags_length = tags.length;
        var types_length = types.length;

        var props_array = props.map(return_prop_ids)
        var subprops_array = subprops.map(return_subprop_ids)
        var tags_array = tags.map(return_tag_ids)
        var types_array = types.map(return_type_ids)

        indicators[i]["propositions"] = props_array;
        indicators[i]["subpropositions"] = subprops_array;
        indicators[i]["tags"] = tags_array;
        indicators[i]["types"] = types_array;
    }
    return indicators
}