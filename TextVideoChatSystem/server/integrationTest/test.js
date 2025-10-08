const { app, initApp, client } = require('../server');
const request = require('supertest'); 
const { expect } = require('chai');  

describe('Auth Routes', function() {
    before(async function() {
        await initApp(true); 
    });

    after(async function() {
        await client.close(); 
    });

    it("Should log in successfully", async function() {
        const res = await request(app)  // use supertest to make request
            .post('/api/auth')
            .send({ username: "super", pass: '123' });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('signedIn', true);
    });
});
