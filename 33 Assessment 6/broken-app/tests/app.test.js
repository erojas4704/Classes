process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app")

test("Try to get information on several users.", async () => {
    let resp = await request(app)
        .post('/')
        .send({
            developers: ['joelburton', 'elie']
        });

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual([
        {
            "bio": "Open source developer. Former dev at Apple...",
            "name": "Joel Burton"
        },
        {
            "bio": "Co-founder + Lead Instructor @rithmschool ",
            "name": "Elie Schoppik"
        }
    ]);
});