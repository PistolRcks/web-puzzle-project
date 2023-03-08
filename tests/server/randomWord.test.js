import Supertest from "supertest";
import axios from "axios";

const App = require("../../server/index");
const request = Supertest(App);

jest.mock("axios");

describe("Test /api/word route", () => {
    test("Response 400 - Malformed input", async () => {
        const res = await request.get("/api/word").send({
            blah: []
        });
        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual("Error: Malformed JSON. Make sure that the `words` array exists in the root of the request.");
    })
    
    test("Response 200 - numWords given, not length", async () => {
        const data = [
            "word1",
            "word2"
        ];

        axios.get.mockResolvedValue({data: data, status: 200});

        const res = await request.get("/api/word").send({
            words: [
                {
                    numWords: 2
                }
            ] 
        });

        expect(axios.get.mock.lastCall[1]).toEqual({params: {length: -1, number: 2}});
        expect(res.text).toEqual(JSON.stringify([data]));
    })
    
    
    test("Response 200 - length given, not numWords", async () => {
        const data = [
            "word1"
        ];

        axios.get.mockResolvedValue({data: data, status: 200});

        const res = await request.get("/api/word").send({
            words: [
                {
                    length: 5
                }
            ] 
        });

        expect(axios.get.mock.lastCall[1]).toEqual({params: {length: 5, number: 1}});
        expect(res.text).toEqual(JSON.stringify([data]));
    })
    
    test("Response 500 - API failed", async () => {
        axios.get.mockResolvedValue({status: 418});

        const res = await request.get("/api/word").send({
            words: [
                {
                    numWords: 2,
                    length: 5
                }
            ] 
        });

        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("Status code returned from API as 418!")
    })

    test("Response 200 - standard usage, singular requirement", async () => {
        const data = [
            "word1",
            "word2"
        ];

        axios.get.mockResolvedValue({data: data, status: 200});

        const res = await request.get("/api/word").send({
            words: [
                {
                    numWords: 2,
                    length: 5
                }
            ] 
        });

        expect(axios.get.mock.lastCall[1]).toEqual({params: {length: 5, number: 2}});
        expect(res.text).toEqual(JSON.stringify([data]));
    })
    
    test("Response 200 - standard usage, multiple requirements", async () => {
        const data1 = [
            "word1",
            "word2"
        ];

        axios.get.mockResolvedValueOnce({data: data1, status: 200});
        
        const data2 = [
            "word"
        ];

        axios.get.mockResolvedValueOnce({data: data2, status: 200});

        const res = await request.get("/api/word").send({
            words: [
                {
                    numWords: 2,
                    length: 5
                },
                {
                    numWords: 1,
                    length: 4
                }
            ] 
        });

        expect(axios.get.mock.calls[0][1]).toEqual({params: {length: 5, number: 2}});
        expect(axios.get.mock.calls[1][1]).toEqual({params: {length: 1, number: 4}});
        expect(res.text).toEqual(JSON.stringify([data1, data2]));
    })
})