const request = require('supertest');
const server = require('../server.js');
var supertest = request(server);

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

describe('test proposition APIs', () => {
 test('GET & structure - props /', async () => {

 const response = await supertest.get('/propositions').set({ Authorization: TOKEN });
 expect(response.status).toEqual(200);
 var output = JSON.parse(response.text)

 var api_keys = Object.keys(output.data[0])
 var keys = ['id','title','description','created','updated']
 expect(JSON.stringify(api_keys)).toContain(JSON.stringify(keys));
 });
});

describe('test subproposition APIs', () => {
 test('GET & structure - subprops /', async () => {

 const response = await supertest.get('/subpropositions').set({ Authorization: TOKEN });
 expect(response.status).toEqual(200);
 var output = JSON.parse(response.text)

 var api_keys = Object.keys(output.data[0])
 var keys = ['id','title','description','created','updated']
 expect(JSON.stringify(api_keys)).toContain(JSON.stringify(keys));
 });
});

describe('test tags APIs', () => {
 test('GET & structure - tags /', async () => {

 const response = await supertest.get('/tags').set({ Authorization: TOKEN });
 expect(response.status).toEqual(200);
 var output = JSON.parse(response.text)

 var api_keys = Object.keys(output.data[0])
 var keys = ['id','title','description','created','updated']
 expect(JSON.stringify(api_keys)).toContain(JSON.stringify(keys));
 });
});

describe('test types APIs', () => {
 test('GET & structure - types /', async () => {

 const response = await supertest.get('/types').set({ Authorization: TOKEN });
 expect(response.status).toEqual(200);
 var output = JSON.parse(response.text)

 var api_keys = Object.keys(output.data[0])
 var keys = ['id','title','slug','created','updated']
 expect(JSON.stringify(api_keys)).toContain(JSON.stringify(keys));
 });
});

describe('test indicators APIs', () => {
 test('GET & structure - indicators /', async () => {

 const response = await supertest.get('/indicators').set({ Authorization: TOKEN });
 expect(response.status).toEqual(200);
 var output = JSON.parse(response.text)

 var api_keys = Object.keys(output.data[0])
 var keys = ['id','title','description','is_archived','created','updated',
                'propositions','subpropositions','tags','types']
 expect(JSON.stringify(api_keys)).toContain(JSON.stringify(keys));
 });
});

//Testing post APIS 
describe('test POST APIs', () => {
 test('POST APIs - Indicator mgmt. /', async () => {

 var prop_data = {'title':'Test prop 1'}
 var subprop_data = {'title':'Test subprop 1'}
 var tag_data = {'title':'Test tag 1'}
 var type_data = {'title':'Test type 1'}

 //create PROP
 var create_prop = await supertest.post('/propositions').set({ Authorization: TOKEN }
                        ).send(prop_data)
 expect(create_prop.status).toEqual(200);

 create_prop = JSON.parse(create_prop.text)
 var prop_id = create_prop.data[0].id

 //create SUBPROP
 var create_subprop = await supertest.post('/subpropositions').set({ Authorization: TOKEN }
                        ).send(subprop_data)
 expect(create_subprop.status).toEqual(200);

 create_subprop = JSON.parse(create_subprop.text)
 var subprop_id = create_subprop.data[0].id

 //create TAG
 var create_tag = await supertest.post('/tags').set({ Authorization: TOKEN }
                        ).send(tag_data)
 expect(create_tag.status).toEqual(200);

 create_tag = JSON.parse(create_tag.text)
 var tag_id = create_tag.data[0].id

 //create TYPE
 var create_type = await supertest.post('/types').set({ Authorization: TOKEN }
                        ).send(type_data)
 expect(create_type.status).toEqual(200);

 create_type = JSON.parse(create_type.text)
 var type_id = create_type.data[0].id

 //create INDICATOR
 var indicator_data = {'title':'TEST indicator 1', "tags":[tag_id], "propositions":[prop_id],
                        'subpropositions':[subprop_id],'types':[type_id]}
 
 var create_indicator = await supertest.post('/indicators').set({ Authorization: TOKEN }
                        ).send(indicator_data)
 expect(create_indicator.status).toEqual(200);

 create_indicator = JSON.parse(create_indicator.text)
 var indicator_id = create_indicator.data[0].id

 //Delete all

 //delete indicator
 var delete_indicator = await supertest.delete(`/indicators/${indicator_id}`).set({ Authorization: TOKEN })
 expect(delete_indicator.status).toEqual(200);
 //delete prop
 var delete_prop = await supertest.delete(`/propositions/${prop_id}`).set({ Authorization: TOKEN })
 expect(delete_prop.status).toEqual(200);
 //delete subprop
 var delete_subprop = await supertest.delete(`/subpropositions/${subprop_id}`).set({ Authorization: TOKEN })
 expect(delete_subprop.status).toEqual(200);
 //delete tag
 var delete_tag = await supertest.delete(`/tags/${tag_id}`).set({ Authorization: TOKEN })
 expect(delete_tag.status).toEqual(200);
 //delete type
 var delete_type = await supertest.delete(`/types/${type_id}`).set({ Authorization: TOKEN })
 expect(delete_type.status).toEqual(200);
 });
});
