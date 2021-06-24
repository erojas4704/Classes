process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app")
let { items } = require("../fakedb");
let testFruit;

beforeEach(() => {
    testFruit = {
        name: "Testava",
        cost: 9.99
    };

    items.push(testFruit);
});

afterEach(() => {
    items.length = 0;
});

describe("POST /items", () => {
    let banana = {
        name: "Banana",
        price: 4.49
    };
    test("Creates a new item ", async () => {
        let resp = await request(app)
            .post('/items')
            .send(banana);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            added: banana
        })
    });
});

describe("GET /items", () => {
    test("Gets the list of items", async () => {
        let resp = await request(app).get('/items');
        expect(resp.body).toEqual(
            [testFruit]
        )
    })
});

describe("Get specific items.", () => {
    test("Gets a specific item by name.", async () => {
        let resp = await request(app).get('/items/Testava')
        expect(resp.body).toEqual(testFruit)
    });
    test("Gets a specific item by name and it shouldn't be case-sensitive.", async () => {
        let resp = await request(app).get('/items/tEsTaVa');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(testFruit);
    });
});

describe("Update an item with new values.", () => {
    test("Changes the name of an item.", async () => {
        let resp = await request(app)
            .patch('/items/Testava')
            .send({
                name: "Abimadril"
            });

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            updated: {
                name: "Abimadril",
                cost: testFruit.cost
            }
        });
    });

    test("Changes the name of an item with any case.", async () => {
        let resp = await request(app)
            .patch('/items/TeStAvA')
            .send({
                name: "Abimadril"
            });

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            updated: {
                name: "Abimadril",
                cost: testFruit.cost
            }
        });
    });
});

describe("Change the price of an item.", () => {
    test("Changes the price of an item.", async () => {
        let resp = await request(app)
            .patch('/items/Testava')
            .send({
                cost: 4.74
            });

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            updated: {
                name: testFruit.name,
                cost: 4.74
            }
        });
    });
});

describe("Deletes an item.", () => {
    test("Delets an item by name and makes sure it's gone.", async () => {

        let resp = await request(app)
        .delete('/items/Testava');
        
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            message: "deleted"
        });
        
        let itemRes = await request(app).get('/items/Testava');
        expect(itemRes.statusCode).toBe(404);
    });
});