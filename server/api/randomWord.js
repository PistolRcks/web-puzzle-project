/*
Acceptance Criteria:

- This (https://random-word-api.herokuapp.com/home) API is connected
- Server endpoint is setup to generate one or more random words at the request of the client.
- The endpoint allows the client to specify a number of words it would like.
- The endpoint allows the client to specify a length for the words.
- The endpoint returns the random words as an array or an object containing an array.

Notes:
Consider allowing the front end to send something like 
    [
        {
          numberOfWords: 5,
          length: 3
        },
        {
          numberOfWords: 2,
          length: 8
        },
        ...
    ]
to allow the front end to request multiple words of different lengths in one call.

The example above would return something like 2D array:
    [ [5 three letter words], 
      [2 eight letter words]]

or an object like:
{
  3: [5 three letter words],
  8: [2 eight letter words]
}
*/

function randomWord(req, res, next) {
    
}