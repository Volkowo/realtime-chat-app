const { app, initApp, client, getCollections } = require('../server');
const request = require('supertest'); 
const { expect } = require('chai');

describe('Auth Routes', function() {
    let userCollection;

    before(async function() {
        await initApp(true); 
        ({ userCollection } = getCollections());
    });

    after(async function() {
        await userCollection.deleteOne({ username: "testDB" });
        await client.close(); 
    });

    describe("1. Login Route", function() {
        it("Should log in successfully", async function() {
            const res = await request(app)  // use supertest to make request
                .post('/api/auth')
                .send({ username: "super", pass: '123' });
    
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('signedIn', true);
        });
    
        it("Should not log in with wrong credentials", async function() {
            const res = await request(app) 
                .post('/api/auth')
                .send({ username: "bruh", pass: 'lololol' });
    
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('signedIn', false);
        });

        it("Should register user if username unique", async function() {
            const res = await request(app)
                .post('/api/register')
                .send({ username: "testDB", pass: '123', email: "balls@email.com" });
    
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('register', true);
        })

        it("Should register user if username isnt unique (hopefully)", async function() {
            const res = await request(app)
                .post('/api/register')
                .send({ username: "userTwo", password: '123', email: "balls@email.com" });
    
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('register', false);
        })
    })
});
