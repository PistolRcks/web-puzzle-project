import { db } from "../../server/db";

const app = require('../../server/index')
const request = require('supertest')

jest.mock("../../server/db");

/**
 * Helper function to insert test puzzles into db
 * @param {int} k - Number of test puzzles to insert
 * @returns nothing
 */
function dataHelper(k) {
    for (let i = 1; i <= k; i++) {
        db.run(`INSERT INTO Puzzle VALUES (${i}, "test puzzle ${i}", "test description ${i}")`);
    }
}

describe('Puzzles endpoint', () => {
    test("Response 200 - successful query", async () => {
        dataHelper(5);

        const res = await request(app).get("/api/PuzzleSelection");

        expect(res.statusCode).toEqual(200); // status code should be 200
        expect(res.body).toEqual( // res should contain all inserted puzzles
            expect.arrayContaining([
                expect.objectContaining(
                    {
                        puzzle_id: 1,
                        title: "test puzzle 1",
                        description: "test description 1"
                    },
                    {
                        puzzle_id: 2,
                        title: "test puzzle 2",
                        description: "test description 2"
                    },
                    {
                        puzzle_id: 3,
                        title: "test puzzle 3",
                        description: "test description 3"
                    },
                    {
                        puzzle_id: 4,
                        title: "test puzzle 4",
                        description: "test description 4"
                    },
                    {
                        puzzle_id: 5,
                        title: "test puzzle 5",
                        description: "test description 5"
                    })
            ])
        );
    });
});
