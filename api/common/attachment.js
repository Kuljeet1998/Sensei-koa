const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');
const koaBody = require('koa-body')
const ThumbnailGenerator = require('video-thumbnail-generator').default;

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

        var type = ctx.request.files.file.type
        var path = ctx.request.files.file.path

        if(type=='video/mp4')
        {
            const tg = new ThumbnailGenerator({
                            sourcePath: './'+path,
                            thumbnailPath: './thumbnail/',
                            });
            var thumbnail = await tg.generateOneByPercent(25)
            ctx.request.body.thumbnail_path = 'thumbnail/'+thumbnail
        }
        ctx.request.body.id = uuid1
        ctx.request.body.path = path
        const attachments = await knex('Attachment').insert(ctx.request.body);
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