const router = require('express').Router()
const db = require('../db')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const autorization = require('../middlewear/authorization')

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

router.post(
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

router.delete('/:id/delete-img', async (req, res) => {
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

module.exports = router
