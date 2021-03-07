const config = require('../../knexfile.js')
const knex = require('knex')(config)

const Router = require('koa-router');
const bcrypt = require('bcryptjs');
const generate_uuid = require('../../utils/uuid.js');
const jwt1 = require('jsonwebtoken');

const Koa = require('koa');

const router = new Router({
		prefix: '/users'
});


module.exports = router;

router.get("/",  async (ctx) => {
	try {
		const users = await knex('User').select('id','username');

		ctx.body = {
			data: users
		};
 
	} catch (err) {
		ctx.status = 404
		console.log(err)
		ctx.body = {error:err}
	}
})


router.post("/", async (ctx) => {
	try {
		if (
				!ctx.request.body.username ||
				!ctx.request.body.password
		) {
				ctx.response.status = 400;
				ctx.body = 'Please enter the data';
		}
		else
		{   
				const password = ctx.request.body.password
				const uuid1 = await generate_uuid.get_uuid();
				var username = ctx.request.body.username
				var token = jwt1.sign({username: ctx.request.body.password}, 'password'); //'password' is the secret-key which will be added in a file that's not in repo like secrets.json in django

				var user = await knex('User').insert({id:uuid1, username:ctx.request.body.username, password:token})
				/*const uuid2 = await generate_uuid.get_uuid()*/
				/*var token = await knex('Token').insert({key:hash, user_id:uuid1});*/
				var resp = await knex('User').select('*').where({id: uuid1});
				ctx.body = {data:resp}
		}
	} catch (err) {
		ctx.status = 404
		console.log(err)
		ctx.body = {error:err}
	}
})

router.get("/:id", async (ctx) => {
	try {
		const user = await knex('User').select('*').where({ id: ctx.params.id });

		if(user.length===0){
				ctx.body = {error:"Does not exist"}
		}
		else
		{
		ctx.body = {
			 user
				};
		}
		
	} catch (err) {
		ctx.status = 404
		ctx.body = {error:err}
	}
})


router.put('/:id', async (ctx) => {
	try {
				var id = await knex('User').update(ctx.request.body).where({ id: ctx.params.id})
				var resp = await knex('User').select('*').where({ id: ctx.params.id});
				ctx.body = {data:resp}
		
	} catch (err) {
		ctx.status = 404
		ctx.body = {error:err}
	}
})

router.delete('/:id', async (ctx) => {
	try {
				var id = await knex('User').del().where({ id: ctx.params.id})
				var resp = await knex('User').select('*').where({ id: ctx.params.id});
				ctx.body = {data:resp}
		
	} catch (err) {
		ctx.status = 204
		ctx.body = {error:err}
	}
})