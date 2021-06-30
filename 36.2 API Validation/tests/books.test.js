process.env.NODE_ENV = "test";
const request = require('supertest');
const app = require('../app');
const db = require('../db')

const testBook = {
    "isbn": "123456",
    "amazon_url": "http://www.amazon.com/testBook",
    "author": "Donald Trump",
    "language": "English",
    "pages": 9104,
    "publisher": "Fischer Price",
    "title": "The Great Fish from the Deep Dark Beyond",
    "year": 2020
}

beforeEach( async () => {
    await request(app).post('/books').send(testBook);
});

describe("POST books with good data", () => {
    const newBook = {
        "isbn": "2321342132132312111421",
        "amazon_url": "http://www.amazon.com/book",
        "author": "Billy Tangley",
        "language": "English",
        "pages": 400,
        "publisher": "Fishcer Price",
        "title": "Donald Trump and the Palisade of the King",
        "year": 2020
    };

    test("Create a book", async () => {
        let resp = await request(app)
            .post('/books')
            .send(newBook);

        expect(resp.status).toBe(201);
        expect(resp.body).toEqual({
            book: newBook
        });

        //Make sure it exists
        let checkResp = await request(app).get(`/books/${newBook.isbn}`);
        
        expect(checkResp.body).toEqual({
           book: newBook 
        });
    });

});

describe("POST book with bad data", () => {
    test("Post a book", async () => {
        let resp = await request(app)
            .post('/books')
            .send({
                "isbn": "terrible",
                "Pages": 400,
                "Author": "Test",
                "Title": "Everything is missing"
            });
        expect(resp.status).toBe(400);
        expect(resp).toHaveProperty("error");
    });
});

describe("PUT a book, modifying its attributes", () => {
    test("Put a book", async () => {
        let resp = await request(app)
        .put(`/books/${testBook.isbn}`)
        .send({
            "title": "The Lord and the Sword"
        });
        
        expect(resp.status).toBe(200);
        expect(resp.body.book.title).toBe("The Lord and the Sword");

        let check = await request(app).get(`/books/${testBook.isbn}`);
        expect(resp.status).toBe(200);
        expect(resp.body.book.title).toBe("The Lord and the Sword");
    });
});

afterEach(async () => {
    await db.query(`
        DELETE FROM books
    `);
});

afterAll(async () => {
    await db.end();
});