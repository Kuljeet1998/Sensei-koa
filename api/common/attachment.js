const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
var fs = require('fs');

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
    console.log(err)
  }
})


router.post("/", koaBody, async (ctx) => {
  try {
    if (
        !ctx.request.body.name
    ) {
        ctx.response.status = 400;
        ctx.body = 'Please enter the data';
    }
    else
    {   
        const uuid1 = await generate_uuid.fn();
        ctx.request.body.id = uuid1
        var path = ctx.request.body.path
        var name = ctx.request.body.name
        console.log(path)
        console.log(name)
        var file = await knex('Attachment').insert(ctx.request.body)
        var resp = await knex('Attachment').select('*').where({id: uuid1});
        /*await fs.copyFile(path, `${name}`, (err) => {
                            if (err) throw err;
                            console.log('source.txt was copied to destination.txt');
                          });*/
        ctx.body = {data:resp}
    }
  } catch (err) {
    console.log(err)
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
    console.log(err)
  }
})


router.put('/:id', async (ctx) => {
  try {
        var id = await knex('Attachment').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('Attachment').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var id = await knex('Attachment').del().where({ id: ctx.params.id})
        var resp = await knex('Attachment').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    console.log(err)
  }
})