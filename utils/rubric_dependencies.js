const config = require('../knexfile.js')
const knex = require('knex')(config)

function return_ids(data)
{   
    return data['indicator_id']
}


exports.rubric_w_indicators= async function get_dependencies(rubrics)
{
    for(var i=0;i<rubrics.length;i++)
    {
        var indicators = await knex('rubric_indicators').column('indicator_id').where({ rubric_id: rubrics[i]['id']});
        var indicators_length = indicators.length;
        var indicators_array = indicators.map(return_ids)
        rubrics[i]["indicators"] = indicators_array;
    }
    return rubrics
}