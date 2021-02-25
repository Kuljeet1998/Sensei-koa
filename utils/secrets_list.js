const config = require('../knexfile.js')
const knex = require('knex')(config)

exports.fn= async function all_password()
{
    const secret = await knex('User').select('password');
    return secret
}