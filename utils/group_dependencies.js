const config = require('../knexfile.js')
const knex = require('knex')(config)

function return_ids(data)
{   
    return data['id']
}


exports.group_w_users= async function get_dependencies(groups)
{
    for(var i=0;i<groups.length;i++)
    {
        var users = await knex('group_users').column('id').where({ group_id: groups[i]['id']});
        var users_length = users.length;
        var users_array = users.map(return_ids)
        groups[i]["users"] = users_array;
    }
    return groups
}