const myApp = require('../../server/index')
const supertest = require('supertest')
const request = supertest(myApp)

jest.mock('jsdom', () => {
    return {
        getPuzzles: jest.fn(),
    };
});

function dataForListPuzzles(rows, offset = 0) {
    const data = [];
    for (let i = 1; i <= rows; i++) {
        const value = i + offset;
        data.push({
            puzzle_id: `${value}`,
            title: `Test Puzzle ${value}`,
            description: `Test description ${value}`,
        })
    }
    return data;
}

describe('GET /ListPuzzles', () => {
    beforeEach(() => {
        puzzles.getPuzzles.mockReset();
        puzzles.getPuzzles.mockResolvedValue(null);
    })
});

async function callGetOnListPuzRoute(row, key = 'id') {
    const id = row[key];
    puzzles.getPuzzles.mockResolvedValueOnce(row);
    const response = await request(app).get(`/PuzzleSelection/${id}`);
    return response;
}

it('should respond with json containing puzzle data', async () => {
    const data = dataForListPuzzles(10);
    for (const row of data) {
        const { body: puzzle } = await callGetOnListPuzRoute(row);
        expect(puzzle.puzzle_id).toBe(row.puzzle_id);
        expect(puzzle.title).toBe(row.title);
        expect(puzzle.description).toBe(row.description);
    }
});