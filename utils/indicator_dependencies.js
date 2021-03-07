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

exports.indicator_dependencies= async function get_dependencies(indicators)
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

exports.indicator_dependencies_details= async function get_detailed_dependencies(indicators)
{
    for(var i=0;i<indicators.length;i++)
    {
        var indi_props = await knex('indicator_propositions').column('proposition_id').where({ indicator_id: indicators[i]['id']});
        var indi_subprops = await knex('indicator_subpropositions').select('subproposition_id').where({ indicator_id: indicators[i]['id']});
        var indi_tags = await knex('indicator_tags').select('tag_id').where({ indicator_id: indicators[i]['id']});
        var indi_types = await knex('indicator_types').select('type_id').where({ indicator_id: indicators[i]['id']});

        var props_length = indi_props.length;
        var subprops_length = indi_subprops.length;
        var tags_length = indi_tags.length;
        var types_length = indi_types.length;

        var props_array = indi_props.map(return_prop_ids)
        var subprops_array = indi_subprops.map(return_subprop_ids)
        var tags_array = indi_tags.map(return_tag_ids)
        var types_array = indi_types.map(return_type_ids)

        indicators[i]["propositions"] = props_array;
        indicators[i]["subpropositions"] = subprops_array;
        indicators[i]["tags"] = tags_array;
        indicators[i]["types"] = types_array;

        console.log(subprops_array)
        
        /*var props = await knex('Proposition').select('*').where((builder) =>
                                                builder.whereIn('id', props_array))*/
        var subprops = await knex('Subproposition').column('title','description').where((builder) =>
                                                builder.whereIn('id', subprops_array))
        var tags = await knex('Tag').column('id','title','description').where((builder) =>
                                                builder.whereIn('id', tags_array))
        var props = await knex('Type').column('id','title','description').where((builder) =>
                                                builder.whereIn('id', types_array))

        indicators[i]["propositions_details"] = props;
        indicators[i]["subpropositions_details"] = subprops;
        indicators[i]["tags_details"] = tags;
        indicators[i]["types_details"] = types;
    }
    return indicators
}