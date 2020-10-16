const router = require('express').Router();
const { response } = require('express');
const pool = require('../db');
const autorization = require('../middlewear/authorization.js');


router.get('/', autorization, async (req, res) => {
    try {
        
        //req.user has the payload from ../middlewear/authorization.js
        //res.json(req.user);
        

        // user_name only returns the user_name 
        const user = await pool.query("SELECT user_name FROM users WHERE user_id = $1", [
            req.user
        ]);

        res.json(user.rows[0]);
    } catch(err) { 
        console.error(err.message);
        res.status(500).json('Server Error')
    }
});


module.exports = router; 