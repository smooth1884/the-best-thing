//Using this middlewear to Authorize the User
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = async (req, res, next) => {
    const jwtToken = req.header('token')
    if (!jwtToken) {
        return res.status(403).json('Not Authorized') // Checks if User even has a token
    }
    try {
        //verify is a jwt function which checks if the given token is a valid token
        const payload = jwt.verify(jwtToken, process.env.jwtSecret) // checks if jwt is valid. User token (jwtToken) is compared with server secret (jwtSecret) and returns a payload

        req.user = payload.user
        next() // continues on. Without this, there is no response to client
    } catch (err) {
        //If jws is not valid, error.
        console.error(err.message)
        return res.status(403).json('Not Authorized')
    }
}
