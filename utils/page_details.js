
const config = require('../knexfile.js')
const knex = require('knex')(config)

exports.fn= async function page_details(ctx,data)
{
const itemCount = data.length
const pageCount = Math.ceil(itemCount / parseInt(ctx.query.limit));
const start = (parseInt(ctx.query.page)-1)*parseInt(ctx.query.limit)
const results = data.slice(start,start+parseInt(ctx.query.limit));

return {'pageCount':pageCount,'itemCount':itemCount,'results':results}
}