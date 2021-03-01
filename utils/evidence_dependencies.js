const config = require('../knexfile.js')
const knex = require('knex')(config)

function return_ids(data)
{   
    return data['attachment_id']
}


exports.evidence_w_dependencies= async function get_dependencies(evidences)
{
    for(var i=0;i<evidences.length;i++)
    {

        var rated_indicators = await knex('IndicatorRating').select('*').where({ evidence_id: evidences[i]['id']});
        var attachments = await knex('evidence_attachments').select('attachment_id').where({ evidence_id: evidences[i]['id']});

        var attachments_array = attachments.map(return_ids)

        evidences[i]["indicator_rating_details"] = rated_indicators;
        evidences[i]["attachments"] = attachments_array;
    }
    return evidences
}