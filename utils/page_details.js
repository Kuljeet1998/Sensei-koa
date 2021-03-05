
const config = require('../knexfile.js')
const knex = require('knex')(config)

exports.fn= async function page_details(ctx,data)
{
const itemCount = data.length
var limit = ctx.query.limit || 3
var page = ctx.query.page || 1
const pageCount = Math.ceil(itemCount / parseInt(limit));
const start = (parseInt(page)-1)*parseInt(limit)
const results = data.slice(start,start+parseInt(limit));

return {'pageCount':pageCount,'itemCount':itemCount,'results':results}
}