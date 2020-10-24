const router = require('express').Router()
const db = require('../db')
const autorization = require('../middlewear/authorization')

router.post('/:id/post-comment', autorization, async (req, res) => {
    try {
        const result = await db.query(
            'INSERT INTO comments(comment, parent_id, user_name, user_id, id, date_created) VALUES($1, $2, $3, $4, $5, $6) RETURNING*',
            [
                req.body.comment,
                req.body.parent_id,
                req.body.user_name,
                req.user,
                req.params.id,
                req.body.date_created,
            ]
        )
        res.json({
            status: 'success',
            body: result.rows[0],
        })
    } catch (error) {
        res.status(404).json(console.error(error.message))
    }
})

router.delete('/comment/:id/delete-comment', async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM comments WHERE comment_id = $1 RETURNING *',
            [req.params.id]
        )
        res.json(result.rows)
    } catch (error) {
        res.status(404).json(console.error(error.message))
    }
})

router.put('/comment/:id/edit', async (req, res) => {
    try {
        const result = await db.query(
            'UPDATE comments SET comment = $1 WHERE comment_id = $2 RETUNRING *',
            [req.body.comment, req.params.id]
        )
    } catch (error) {
        res.status(404).json(console.error(error.message))
    }
})

module.exports = router
