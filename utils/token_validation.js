const config = require('../knexfile.js')
const knex = require('knex')(config)

exports.fn= async function check_authorisation(token)
{
    if (token==undefined)
    {
        return {"error":"Authorization required."}
    }
    else
    {
        token = token.split(" ")
        if (token[0]!=='Token')
        {
            return {error:"Authorization required"}
        }
        if (token[1] == undefined)
        {
            return {"error":"Unauthorised access"}
        }
        else
        {
            token = token[1]
            var check_token = await knex('Token').select('*').where("key",token)
            if (check_token.length===0)
            {
                return {"error": "Unauthorized access"}
            }
            else
            {
                return true;
            }
        }
    }
}