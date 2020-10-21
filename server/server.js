require('dotenv').config()
const express = require('express')
const db = require('./db')
const app = express()
const cors = require('cors')
const path = require('path')
const multer = require('multer')
const autorization = require('./middlewear/authorization')
const router = require('express').Router()
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(
            null,
            file.fieldname +
                '-' +
                uniqueSuffix +
                path.extname(file.originalname)
        )
    },
})

const upload = multer({ storage: storage })

app.use(cors())
app.use(express.json())
app.use(express.static('./'))

//& GET A THING AND HIS IMGS & COMMENTS
app.get('/:id', async (req, res) => {
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

//& LOGIN AND REGISTER

//* register and login routes
app.use('/auth', require('./routes/jwtAuth'))

//& IMGS
//* POST IMG
app.post(
    '/:id/uploadImg',
    upload.single('img'),
    autorization,
    async (req, res) => {
        try {
            const result = await db.query(
                'INSERT INTO imgs(id, img_name, img_url, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
                [req.params.id, req.file.originalname, req.file.path, req.user]
            )
            res.json({
                status: 'success',
                imgUrl: result.rows[0].img_url,
            })
        } catch (error) {
            console.error(error.message)
        }
    }
)

//& COMMENTS
//* CREATE COMMENT
app.post('/:id/post-comment', autorization, async (req, res) => {
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

//* DELETE A COMMENT
app.delete('/:id/delete-comment', async (req, res) => {
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

//* DELETE IMG
app.delete('/:id/delete-img', async (req, res) => {
    try {
        const result = await db.query(
            `DELETE FROM imgs WHERE img_id = $1 RETURNING *`,
            [req.params.id]
        )
        fs.unlinkSync(`${result.rows[0].img_url}`)
        res.json(result.rows)
    } catch (error) {
        res.status(404).json(console.error(error.message))
    }
})

//& THINGS
//* GET THING BY SEARCH
app.get('/search/:search/:pid', async (req, res) => {
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

//* GET ALL THINGS
app.get('/', async (req, res) => {
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

//* GET ALL THINGS PAGINATION
app.get('/page/:pid', async (req, res) => {
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

//* POST THING
app.post('/', autorization, async (req, res) => {
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

//* DELETE THING
app.delete('/:id', async (req, res) => {
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

//* LIKE
app.put('/:id/like', async (req, res) => {
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

//*DISLIKE
app.put('/:id/dislike', async (req, res) => {
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

//* UPDATE THING
app.put('/:id', async (req, res) => {
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

const port = process.env.PORT || 3002
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
