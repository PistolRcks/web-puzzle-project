const axios = require('axios');

/**
 * Serves as the callback for the GET /api/word route. Gets an Array containing Arrays containing words.
 * The JSON body should have one key-value pair at the root called "words" which contains the Array of requirement Objects, e.g.:
 * ```json
 * {
 *    "words" : [
 *      {
 *        put in requirement 1 here...
 *      },
 *      {
 *        put in requirement 2 here...
 *      }
 *    ]
 * }
 * ```
 * @see fetchWordsFromAPI for more info on how to structure the request object's body.
 * @param {Express.Request} req - The Request object generated by the route.
 * @param {Express.Response} res - The Result object generated by the route.
 * @param {Function} next - The next() function used in the callback.
 * @returns Nothing.
 */
async function randomWord(req, res, next) {
  let words;

  // check for bad data
  if (!("words" in req.body)) {
    res.status(400).send("Error: Malformed JSON. Make sure that the `words` array exists in the root of the request.");
    return;
  }

  try {
    words = await fetchWordsFromAPI(req.body.words);
    res.status(200).json(words);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

/**
 * Fetches an Array containing Arrays of words based on the `requirements` Array from the API.
 * NB: Please do not spam this! The rate limiting might be harsh!
 * @param {Array} requirements - An Array containing Objects formatted in this way:
 *    ```js
 *    {
 *      numWords: x,  // `int` - number of words you need
 *      length: y     // `int` - length of each word in characters (use -1 for a random length)
 *    }
 *    ```
 *    NB: `numWords` will default to 1, and `length` will default to -1.
 * @throws `Error` if the response code from the API is not 200. 
 * @returns A Promise resolving to an Array containing Arrays of random words, based on each Object in `requirements`.
 *    Each Array returned will be in the order that they were requested in `requirements`.
 */
async function fetchWordsFromAPI(requirements) {
  let out = [];

  // populate output array
  for (const requirement of requirements) {
    // set defaults if keys are not found; also force to Number for safety
    const num = ("numWords" in requirement) ? Number(requirement.numWords) : 1;
    const len = ("length" in requirement) ? Number(requirement["length"]) : -1;

    const response = await axios.get("https://random-word-api.herokuapp.com/word", {
      params : {
        number: num,
        length: len
      }
    });
    
    if (response.status !== 200) {
      throw Error(`Status code returned from API as ${response.status}!`);
    }
    
    out.push(response.data);
  }

  return out;
}

module.exports = { randomWord, fetchWordsFromAPI };