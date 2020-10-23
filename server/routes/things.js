const router = require('express').Router()
const db = require('../db')

router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM things ORDER BY score_plus - score_minus  DESC'
        )
        res.json({
            status: 'success',
            results: result.rows.length,
            data: {
                things: result.rows,
            },
        })
    } catch (error) {
        res.status(404).json(console.error(error.message))
    }
})

router.get('/page/:pid', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT *, COUNT(*) OVER() AS full_count, ROW_NUMBER () OVER ( ORDER BY score_plus - score_minus DESC) FROM things LIMIT $1 OFFSET $2',
            [2, 2 * (req.params.pid - 1)]
        )
        res.json({
            status: 'success',
            results: result.rows.length,
            data: {
                things: result.rows,
            },
        })
    } catch (error) {
        res.status(404).json(console.error(error.message))
    }
})

router.get('/search/:search/:pid', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, name, description, score_minus, score_plus, COUNT(*) OVER() AS full_count, ROW_NUMBER () OVER ( ORDER BY score_plus - score_minus DESC) FROM things WHERE name ILIKE ('%' || $1 || '%') LIMIT $2 OFFSET $3`,
            [req.params.search, 2, 2 * (req.params.pid - 1)]
        )
        res.json(result.rows)
    } catch (error) {
        res.status(404).json(console.error(error.message))
    }
})

module.exports = router
