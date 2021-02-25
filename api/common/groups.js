const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const generate_uuid = require('../../utils/uuid.js');
let get_m2m = require('../../utils/group_dependencies.js');

const router = new Router({
    prefix: '/groups'
});

module.exports = router;

router.get("/", async (ctx) => {
  try {
    const groups = await knex('Group').select('*');
    var group_w_users = await get_m2m.group_w_users(groups);
    ctx.body = {
      data: group_w_users
    };
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})


router.post("/", async (ctx) => {
  try {
    if (
        !ctx.request.body.name ||
        !ctx.request.body.account_id ||
        !ctx.request.body.created_by ||
        !ctx.request.body.rubric_id ||
        !ctx.request.body.users
    ) {
        ctx.response.status = 400;
        ctx.body = 'Please enter the data';
    }
    else
    {   
        const uuid1 = await generate_uuid.fn();
        ctx.request.body.id = uuid1
        var users = ctx.request.body.users

        delete ctx.request.body["users"];

        var group = await knex('Group').insert(ctx.request.body)

        users_length = users.length
        if(users_length!=0)
        {
            for(var i=0;i<users_length;i++)
            {
                const new_uuid = await generate_uuid.fn();
                var group_user_data = {id:new_uuid, user_id:users[i], group_id:uuid1}
                var group_user = await knex('group_users').insert(group_user_data)
            }
        }

        var resp = await knex('Group').select('*').where({id: uuid1});
        resp[0]["users"] = users
        ctx.body = {data:resp}
    }
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})

router.get("/:id", async (ctx) => {
  try {
    
    const group = await knex('Group').select('*').where({ id: ctx.params.id });
    var group_w_users = await get_m2m.group_w_users(group)

    if(group.length===0){
        ctx.body = {error:"Does not exist"}
    }
    else
    {
    ctx.body = {
      data: group_w_users
        };
    }
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})


router.put('/:id', async (ctx) => {
  try {
        var id = await knex('Group').update(ctx.request.body).where({ id: ctx.params.id})
        var resp = await knex('Group').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 404
    ctx.body = {error:err}
  }
})

router.delete('/:id', async (ctx) => {
  try {
        var users = await knex('group_users').del().where({group_id: ctx.params.id})
        var id = await knex('Group').del().where({ id: ctx.params.id})
        var resp = await knex('Group').select('*').where({ id: ctx.params.id});
        ctx.body = {data:resp}
    
  } catch (err) {
    ctx.status = 204
    ctx.body = {error:err}
  }
})