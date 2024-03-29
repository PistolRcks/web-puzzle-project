const axios = require('axios');

const app = require("../../server/index");
const Supertest = require("supertest");
const request = Supertest(app);

jest.mock("axios");

// mock the middleware, specifically mock the auth check to "create" the session
jest.mock("../../server/middleware", () => {
  return {
    redirectBundleManifest: jest.fn((req, res, next) => {
      next();
    }),
    logRouteAndCheckAuthorization: jest.fn((req, res, next) => {
      req.session.userID = 1;
      req.session.username = 'alice';
      next();
    })
  }
})

describe("Tests for POST at /api/word", () => {
  const route = "/api/word";

  beforeEach(() => {
    axios.get.mockClear();
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  test("200 - Object within 'words' does not contain property 'length'", async () => {
    const data = [
      "word1",
      "word2"
    ];

    axios.get.mockResolvedValueOnce({ data: data, status: 200 });

    const response = await request.post(route)
      .send({
        words: [
          {
            numWords: 2
          }
        ]
      });

    expect(axios.get.mock.lastCall[1]).toEqual({ params: { length: -1, number: 2 } });
    expect(response.text).toBe(JSON.stringify([data]));
  });

  test("200 - Object within 'words' does not contain property 'numWords'", async () => {
    const data = [
      "word1"
    ];

    axios.get.mockResolvedValueOnce({ data: data, status: 200 });

    const response = await request.post(route)
      .send({
        words: [
          {
            length: 5
          }
        ]
      });

    expect(axios.get.mock.lastCall[1]).toEqual({ params: { length: 5, number: 1 } });
    expect(response.text).toBe(JSON.stringify([data]));
  });

  test("200 - Proper usage with one requirement set", async () => {
    const data = [
      "word1",
      "word2"
    ];

    axios.get.mockResolvedValueOnce({ data: data, status: 200 });

    const response = await request.post(route)
      .send({
        words: [
          {
            numWords: 2,
            length: 5
          }
        ]
      });

    expect(axios.get.mock.lastCall[1]).toEqual({ params: { length: 5, number: 2 } });
    expect(response.text).toBe(JSON.stringify([data]));
  });

  test("200 - Proper usage with multiple requirement sets", async () => {
    const data1 = [
      "word1",
      "word2"
    ];

    axios.get.mockResolvedValueOnce({ data: data1, status: 200 });

    const data2 = [
      "word"
    ];

    axios.get.mockResolvedValueOnce({ data: data2, status: 200 });

    const response = await request.post(route)
      .send({
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

    expect(axios.get.mock.calls[0][1]).toEqual({ params: { length: 5, number: 2 } });
    expect(axios.get.mock.calls[1][1]).toEqual({ params: { length: 4, number: 1 } });
    expect(response.text).toBe(JSON.stringify([data1, data2]));
  });

  test("400 - Invalid input", async () => {
    const response = await request.post(route)
      .send({
        blah: []
      });

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Error: Malformed JSON. Make sure that the `words` array exists in the root of the request.");
  });

  test("500 - Random Word API failed", async () => {
    axios.get.mockResolvedValueOnce({ status: 418 });

    const response = await request.post(route).send({
      words: [
        {
          numWords: 2,
          length: 5
        }
      ]
    });

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("Status code returned from API as 418!");
  });
});
