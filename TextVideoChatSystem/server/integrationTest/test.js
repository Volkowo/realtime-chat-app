const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, initApp, client } = require('../server');
const { expect } = chai;

chai.use(chaiHttp);

describe('Auth Routes', function() {
    before(async function() {
        await initApp();
    });

    after(async function() {
        await client.close();
    });

    describe("LOGIN ROUTE", function() {
        
    })
})