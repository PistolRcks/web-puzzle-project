// Provides routes to get and set user info for the user profile page

function getUserInfo(req, res, next) {
    /*
        The endpoint retrieves and sends the current user’s username, profile picture, and top puzzle completion times.
        The endpoint sends error responses in the event of an error occurring, input failing validation, user not being logged in, etc.
    */
}

function setUserInfo(req, res, next) {
    /*
        The endpoint validates the a user is logged in.
        The endpoint validates the password only contains allowed characters.
        The endpoint successfully updates the user’s password to the new one.
        The endpoint sends error responses in the event of an error occurring, input failing validation, user not being logged in, etc.
    */

}

module.exports = {
    getUserInfo, setUserInfo
}