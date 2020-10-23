const router = require('express').Router()
const db = require('../db')
const autorization = require('../middlewear/authorization')

router.get('/:id', async (req, res) => {
    try {
        const thingsResult = await db.query(
            `SELECT id, name, description, score_minus, score_plus, user_id
           FROM things 
           WHERE id = $1`,
            [req.params.id]
        )
        const things = thingsResult.rows
        for (let i = 0; i < things.length; i++) {
            const imgsResult = await db.query(
                `SELECT img_id, img_url
                FROM imgs 
                WHERE id = $1`,
                [things[i].id]
            )
            const commentsResult = await db.query(
                `SELECT comment, user_name, date_created, comment_id FROM comments WHERE id = $1 AND parent_id IS NULL ORDER BY date_created DESC`,
                [things[i].id]
            )
            const commentsWithParentsResult = await db.query(
                `SELECT comment, user_name, date_created, comment_id, parent_id FROM comments WHERE id =$1 AND parent_id IS NOT NULL ORDER BY date_created DESC`,
                [things[i].id]
            )
            const commentsWithParents = commentsWithParentsResult.rows
            const comments = commentsResult.rows
            const imgs = imgsResult.rows

            things[i].commentsWithParents = commentsWithParents
            things[i].imgs = imgs
            things[i].comments = comments
        }
        res.json({
            status: 'success',
            results: thingsResult.rows.length,
            data: {
                things,
            },
        })
    } catch (error) {
        res.status(404).json(console.error(error.message))
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM things WHERE id = $1', [
            req.params.id,
        ])
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

router.put('/:id', async (req, res) => {
    try {
        const result = await db.query(
            'UPDATE things SET name = $1, description = $2, score_plus = $3, score_minus = $4 WHERE id = $5 RETURNING *',
            [
                req.body.name,
                req.body.description,
                req.body.score_plus,
                req.body.score_minus,
                req.params.id,
            ]
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

router.post('/', autorization, async (req, res) => {
    try {
        const result = await db.query(
            'INSERT INTO things(name, description, score_plus, score_minus, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.body.name, req.body.description, 0, 0, req.user]
        )
        res.json({
            status: 'success',
            data: { things: result.rows },
        })
    } catch (error) {
        res.status(404).json(console.error(error.message))
    }
})

module.exports = router
