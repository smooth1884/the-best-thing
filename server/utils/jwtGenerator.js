const jwt = require('jsonwebtoken'); // jsonwebtoken includes jwt
require('dotenv').config(); // is going to allow us to get access to all our Environmental vars 

function jwtGenerator(user_id) {
    const payload = {
        user: user_id
    };

    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "1hr"}) // this is signing the token
};

module.exports = jwtGenerator;