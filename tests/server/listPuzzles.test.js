import { db } from "../../server/db";

const app = require('../../server/index')
const request = require('supertest')

jest.mock("../../server/db");

describe('Puzzles endpoint', () => {
    test("Response 200 - successful query", async () => {
        // insert dummy puzzle into mock db
        db.run(`INSERT INTO Puzzle VALUES (1, "test puzzle", "test description")`);
        const res = await request(app).get("/api/PuzzleSelection");
        expect(res.statusCode).toEqual(200); // statues code should be 200
        expect(res.body).toEqual([{ // res should be the same as dummy puzzle
            puzzle_id: 1,
            title: "test puzzle",
            description: "test description"
        }]);
    });
});
