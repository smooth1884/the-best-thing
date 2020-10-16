const express = require('express');
const router = require('express').Router(); // the routers, (recieve commands from user)
const pool = require('../db'); // for the database
const bcrypt = require('bcrypt') // for the passwort bcryption
const jwtGenerator = require('../utils/jwtGenerator'); // importing the jwtGenerator 
const validInfo = require('../middlewear/validinfo')
const authorization = require('../middlewear/authorization')


//registering

router.post('/register', validInfo, async (req, res) => {
    //1. destructure the req.body(name, email, password)

    const { name, email, password } = req.body; // req.body has it all and we take it apart

    try {
        

        //2. check if user exist (throw error)

        const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [ // pool is the acces to the db
            email
        ]);

        if (user.rows.length > 0) {
            return res.status(401).json('User already exists!')
        };
        //3. Bcrypt user passwort

        const saltRounds = 10; // How many rounds its going to be bcrypted
        const salt = await bcrypt.genSalt(saltRounds); //gonna take some time so, "await"

        const bcryptPassword = await bcrypt.hash(password, salt); // this is bcrypting the password



        //4. Enter user inside database

        let newUser = await pool.query
            ("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *", [
                name,
                email,
                bcryptPassword
            ]);

           
        //5. Generate jwt token

        const token = jwtGenerator(newUser.rows[0].user_id); //newUser comes from step 4.

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// LOGIN ROUTE

router.post('/login', validInfo, async (req, res) => {
try {
    //1. destructure the req.body

    const { email, password } = req.body;

    //2. check if user doesn't exist (throw error)

    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
        email
    ]);

    if(user.rows.length ===0) {
        return res.status(401).json("Password or Email is incorrect"); //.json or .send doesn' matter?
    };

    //3. check if incoming passwort is the same as the database password

    const validPasswort = await bcrypt.compare(password, user.rows[0].user_password);

    if (!validPasswort) { // Password is incorrect
        return res.status(401).json("Password or Email is incorrect");
    }

    //4. give the jwt 

    const token = jwtGenerator(user.rows[0].user_id);

    res.json({ token })

} catch(err) { console.error(err.message)
    
}
});
// authorization is already checking if the jwt is valid and then its passed in here:
router.get('/verify', authorization, async (req, res) => {
    try {
        res.json(true);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



module.exports = router;