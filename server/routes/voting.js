const router = require('express').Router()
const db = require('../db')

router.put('/:id/dislike', async (req, res) => {
    try {
        const result = await db.query(
            'UPDATE things SET score_minus = score_minus + 1 WHERE id = $1 RETURNING *',
            [req.params.id]
        )
        res.json({
            status: 'success',
            results: result.rows.length,
            data: result.rows[0],
        })
    } catch (error) {
        res.status(404).json(console.error(error.message))
    }
})

router.put('/:id/like', async (req, res) => {
    try {
        const result = await db.query(
            'UPDATE things SET score_plus = score_plus + 1 WHERE id = $1 RETURNING *',
            [req.params.id]
        )
        res.json({
            status: 'success',
            results: result.rows.length,
            data: result.rows[0],
        })
    } catch (error) {
        res.status(404).json(console.error(error.message))
    }
})

module.exports = router
