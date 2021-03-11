const request = require('supertest');
const server = require('../server.js');
var supertest = request(server);

const config = require('../knexfile.js')
const knex = require('knex')(config)

beforeAll(async () => {
 // do something before anything else runs
 console.log('Jest starting!');
});


// close the server after each test
afterAll(() => {
 server.close();
 console.log('server closed!');
});

const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNpbmdoIiwiaWF0IjoxNjE1MDI3NTI5fQ.58Z4vchBvwwH13egjBP_L8SvEDBSzfZF40Pv30fev0o'

describe('test rating-scheme APIs', () => {
 test('GET & structure - rating-scheme /', async () => {

 const response = await supertest.get('/rating-scheme').set({ Authorization: TOKEN });
 expect(response.status).toEqual(200);
 var output = JSON.parse(response.text)

 var api_keys = Object.keys(output.data[0])
 var keys = ['id','name','description','created','updated','code','is_input_required']
 expect(JSON.stringify(api_keys)).toContain(JSON.stringify(keys));
 });
});

describe('test ratings APIs', () => {
 test('GET & structure - ratings /', async () => {

 const response = await supertest.get('/ratings').set({ Authorization: TOKEN });
 expect(response.status).toEqual(200);
 var output = JSON.parse(response.text)

 var api_keys = Object.keys(output.data[0])
 var keys = ['id','name','description','created','updated','score','rating_scheme_id','account_id']
 expect(JSON.stringify(api_keys)).toContain(JSON.stringify(keys));
 });
});

describe('test rubrics APIs', () => {
 test('GET & structure - rubrics /', async () => {

 const response = await supertest.get('/rubrics').set({ Authorization: TOKEN });
 expect(response.status).toEqual(200);
 var output = JSON.parse(response.text)

 var api_keys = Object.keys(output.data[0])
 var keys = ['id','name','description','created','updated','account_id',
                'rating_scheme_id','is_archived','is_dummy','indicators']
 expect(JSON.stringify(api_keys)).toContain(JSON.stringify(keys));
 });
});

describe('test observations APIs', () => {
 test('GET & structure - observations /', async () => {

 const response = await supertest.get('/observations').set({ Authorization: TOKEN });
 expect(response.status).toEqual(200);
 var output = JSON.parse(response.text)

 var api_keys = Object.keys(output.data[0])
 var keys = ['id','name','description','created','updated','rubric_id',
                'group_id','observer_id','observee_id','is_published']
 expect(JSON.stringify(api_keys)).toContain(JSON.stringify(keys));
 });
});

describe('test evidences APIs', () => {
 test('GET & structure - evidences /', async () => {

 const response = await supertest.get('/evidences').set({ Authorization: TOKEN });
 expect(response.status).toEqual(200);
 var output = JSON.parse(response.text)

 var api_keys = Object.keys(output.data[0])
 var keys = ['id','name','description','created','updated','observation_id',
                'is_observers_learning','indicator_rating_details','attachments']
 expect(JSON.stringify(api_keys)).toContain(JSON.stringify(keys));
 });
});


//POST & DELETE APIs

describe('test POST APIs', () => {
 test('POST APIs - observations flow /', async () => {

 //Pre-requisites
 var account_id = await knex('Account').select('id') 
 account_id = account_id[0]['id'] //First account from DB

 var indicator_id = await knex('indicator').select('id')
 indicator_id = indicator_id[0]['id'] //First indicator in DB

 var observer_id = await knex('User').select('id')
 observer_id = observer_id[0]['id'] //First user as observer 

 var observee_id = await knex('User').select('id')
 observee_id = observee_id[1]['id'] //First user as observee

 var group_id = await knex('Group').select('id')
 group_id = group_id[0]['id'] //First group in DB



 var rating_scheme_data = {'name':'TEST Rating scheme 1','code':'4_pointer'}

 //create RATING SCHEME
 var create_rating_scheme = await supertest.post('/rating-scheme').set({ Authorization: TOKEN }
                        ).send(rating_scheme_data)
 expect(create_rating_scheme.status).toEqual(200);
 create_rating_scheme = JSON.parse(create_rating_scheme.text)
 var rating_scheme_id = create_rating_scheme.data[0].id

 //create Rating
 var rating_data = {'name':'TEST novice','score':0,'rating_scheme_id':rating_scheme_id,'account_id':account_id}
 var create_rating = await supertest.post('/ratings').set({ Authorization: TOKEN }
                        ).send(rating_data)
 expect(create_rating.status).toEqual(200);
 create_rating = JSON.parse(create_rating.text)
 var rating_id = create_rating.data[0].id

 //create Rubrics
 var rubric_data = {'name':'TEST Rubric','rating_scheme_id':rating_scheme_id,'account_id':account_id,
                    'indicators':[indicator_id]}
 var create_rubrics = await supertest.post('/rubrics').set({ Authorization: TOKEN }
                        ).send(rubric_data)
 expect(create_rubrics.status).toEqual(200);
 create_rubrics = JSON.parse(create_rubrics.text)
 var rubric_id = create_rubrics.data[0].id
 
 //create Observations
 var observation_data = {'name':'TEST Observation 1','rubric_id':rubric_id,'group_id':group_id,
                        'observer_id':observer_id,'observee_id':observee_id}
 var create_observation = await supertest.post('/observations').set({ Authorization: TOKEN }
                        ).send(observation_data)

 expect(create_observation.status).toEqual(200);
 create_observation = JSON.parse(create_observation.text)
 var observation_id = create_observation.data[0].id
 
 //create Evidences
 var evidence_data = {"name":"TEST evidence 1","observation_id":observation_id,"attachments":[],
                        "indicators_data":[{"indicator":indicator_id,"rating":rating_id}]}
 var create_evidence = await supertest.post('/evidences').set({ Authorization: TOKEN }
                        ).send(evidence_data)

 expect(create_evidence.status).toEqual(200);
 create_evidence = JSON.parse(create_evidence.text)
 var evidence_id = create_evidence.data[0].id

 //Delete all

 //delete evidence
 var delete_evidence = await supertest.delete(`/evidences/${evidence_id}`).set({ Authorization: TOKEN })
 expect(delete_evidence.status).toEqual(200);
 //delete observation
 var delete_observation = await supertest.delete(`/observations/${observation_id}`).set({ Authorization: TOKEN })
 expect(delete_observation.status).toEqual(200);
 //delete rubrics
 var delete_rubrics = await supertest.delete(`/rubrics/${rubric_id}`).set({ Authorization: TOKEN })
 expect(delete_rubrics.status).toEqual(200);
 //delete ratings
 var delete_rating = await supertest.delete(`/ratings/${rating_id}`).set({ Authorization: TOKEN })
 expect(delete_rating.status).toEqual(200);
 //delete rating-scheme
 var delete_evidence = await supertest.delete(`/rating-scheme/${rating_scheme_id}`).set({ Authorization: TOKEN })
 expect(delete_evidence.status).toEqual(200);

 })
});