module.exports = (req, res, next) => {
    const { name, email, password } = req.body

    // CHECK IF EMAIL IS VALID
    function validEmail(userEmail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)
    }
    // REGISTER ROUTE
    if (req.path === '/register') {
        //console.log(!email.length);
        if (![email, name, password].every(Boolean)) {
            // CHECKS IF VALUES ARE EMPTY
            return res.status(401).json('Missing Credentials')
        } else if (!validEmail(email)) {
            // IF ALL VAULES ARE FILLED, CHECK IF EMAIL IS VALID
            return res.status(401).json('Invalid Email')
        }

        //LOGIN ROUTE
    } else if (req.path === '/login') {
        if (![email, password].every(Boolean)) {
            //CHEKS IF VALUES ARE EMPTY
            return res.status(401).json('Missing Credentials')
        } else if (!validEmail(email)) {
            // CHECKS IF EMAIL IS VALID
            return res.status(401).json('Invalid Email')
        }
    }

    next() // if everything is ok, its goingto continue on
}
