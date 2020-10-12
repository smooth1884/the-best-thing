require('dotenv').config();
const express = require('express');
const db = require('./db');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM things ORDER BY score_plus - score_minus  DESC',
        );
        res.json({
            status: 'success',
            results: result.rows.length,
            data: {
                things: result.rows,
            },
        });
    } catch (error) {
        res.status(404).json(console.error(error.message));
    }
});

app.get('/:id', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM things WHERE id = $1', [
            req.params.id,
        ]);
        res.json({
            status: 'success',
            results: result.rows.length,
            data: {
                things: result.rows,
            },
        });
    } catch (error) {
        res.status(404).json(console.error(error.message));
    }
});

app.post('/', async (req, res) => {
    try {
        const result = await db.query(
            'INSERT INTO things(name, description, score_plus, score_minus) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                req.body.name,
                req.body.description,
                req.body.score_plus,
                req.body.score_minus,
            ],
        );
        res.json({
            status: 'success',
            data: { things: result.rows },
        });
    } catch (error) {
        res.status(404).json(console.error(error.message));
    }
});

app.delete('/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM things WHERE id = $1', [
            req.params.id,
        ]);
        res.json({
            status: 'success',
            results: result.rows.length,
            data: {
                things: result.rows,
            },
        });
    } catch (error) {
        res.status(404).json(console.error(error.message));
    }
});

app.put('/:id/like', async (req, res) => {
    try {
        const result = await db.query(
            'UPDATE things SET score_plus = score_plus + 1 WHERE id = $1 RETURNING *',
            [req.params.id],
        );
        res.json({
            status: 'success',
            results: result.rows.length,
            data: result.rows[0],
        });
    } catch (error) {
        res.status(404).json(console.error(error.message));
    }
});

app.put('/:id/dislike', async (req, res) => {
    try {
        const result = await db.query(
            'UPDATE things SET score_minus = score_minus + 1 WHERE id = $1 RETURNING *',
            [req.params.id],
        );
        res.json({
            status: 'success',
            results: result.rows.length,
            data: result.rows[0],
        });
    } catch (error) {
        res.status(404).json(console.error(error.message));
    }
});

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
            ],
        );
        res.json({
            status: 'success',
            results: result.rows.length,
            data: {
                things: result.rows,
            },
        });
    } catch (error) {
        res.status(404).json(console.error(error.message));
    }
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
