import {describe, expect, test, beforeAll} from '@jest/globals';
import {insertUser} from '../../server/api/signup';

describe("Test insertUser", () => {
    var db;
    beforeAll(() => {
        
    });

    test("Standard user", () => {
        expect(insertUser()).toEqual();
    });
});