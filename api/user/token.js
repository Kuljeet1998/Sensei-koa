const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');

const router = new Router({
    prefix: '/tokens'
});

module.exports = router;

router.get("/", async (ctx) => {
  try {
    
    const tokens = await knex('Token').select('*');
    ctx.body = {
      data: tokens
    };
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})
