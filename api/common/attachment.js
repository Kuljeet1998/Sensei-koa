const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');
const koaBody = require('koa-body')

const router = new Router({
    prefix: '/attachments'
});

module.exports = router;


router.get("/", async (ctx) => {
  try {
    const attachments = await knex('Attachment').select('*');
    ctx.body = {
      data: attachments
    };
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})


router.post("/", async (ctx) => {
  try {
    if (
        !ctx.request.body.name
    ) {
        console.log(ctx.request.body)
        ctx.response.status = 400;
        ctx.body = 'Please enter the data';
    }
    else
    {   
        const uuid1 = await generate_uuid.fn();
        var name = ctx.request.body.name

        /*console.log('ctx.file-name', ctx.request.files.file.name);
        console.log('ctx.file-path', ctx.request.files.file.path);
        console.log('ctx.file-path', ctx.request.files.file.type);
        console.log('options',Object.keys(ctx.request.files.file));*/

        var path = ctx.request.files.file.path
        const attachments = await knex('Attachment').insert({id:uuid1, name:name, path:path});
        const attachment = await knex('Attachment').select('*').where({id:uuid1})
        ctx.body = {data:attachment}
    }
  } catch (err) {
    ctx.status = 404
    console.log(err)
    ctx.body = {error:err}
  }
})

router.get("/:id", async (ctx) => {
  try {
    
    const attachment = await knex('Attachment').select('*').where({ id: ctx.params.id });

    if(attachment.length===0){
        ctx.body = {error:"Does not exist"}
    }
    else
    {
    ctx.body = {
      data: attachment
        };
    }
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})


router.put('/:id', async (ctx) => {
  try {
        var id = await knex('Attachment').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('Attachment').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('Attachment').del().where({ id: ctx.params.id})
        var resp = await knex('Attachment').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 204
    ctx.body = {error:err}
  }
})