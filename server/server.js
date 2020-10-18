require("dotenv").config();
const express = require("express");
const db = require("./db");
const app = express();
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const autorization = require('./middlewear/authorization')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(express.static("./"));

//& CHECK IF ADMIN

// app.get('/admin', autorization, (req, res) => {
//   try {
//     const result = db.query('SELECT admin FROM users WHERE user_id = $1', [req.body])
//     res.json(result)
//   } catch (error) {
//     console.error(error.message)
//   }
// })

//& LOGIN AND REGISTER

//* register and login routes
app.use("/auth", require("./routes/jwtAuth"));

//dashboard route
// app.use('/dashboard', require('./routes/dashboard'));

//& IMGS
//* POST IMG
app.post("/:id/uploadImg", upload.single("img"), autorization, async (req, res) => {
  try {
    const result = await db.query(
      "INSERT INTO imgs(id, img_name, img_url, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.params.id, req.file.originalname, req.file.path, req.user]
    );
    res.json({
      status: 'success',
      imgUrl: result.rows[0].img_url
  })
     } catch (error) {
    console.error(error.message);
  }
});

//* GET IMG WHERE ID
app.get("/:id/imgs", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT img_url, img_id FROM imgs WHERE id = $1",
      [req.params.id]
    )
    res.json({
      status: "success",
      imgs: result.rows,
    });
  } catch (error) {
    console.error(error.message);
  }
});

//* DELETE IMG
app.delete("/:id");

//& THINGS
//* GET ALL THINGS
app.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM things ORDER BY score_plus - score_minus  DESC"
    );
    res.json({
      status: "success",
      results: result.rows.length,
      data: {
        things: result.rows,
      },
    });
  } catch (error) {
    res.status(404).json(console.error(error.message));
  }
});

//* GET ALL THINGS PAGINATION
app.get('/page/:pid', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT *, COUNT(*) OVER() AS full_count, ROW_NUMBER () OVER ( ORDER BY score_plus - score_minus DESC) FROM things LIMIT $1 OFFSET $2', [2, (2 *(req.params.pid -1)) ]
    )
    res.json({
      status: "success",
      results: result.rows.length,
      data: {
        things: result.rows,
      }})
  } catch (error) {
    res.status(404).json(console.error(error.message));
  }
})

//* GET A THING
app.get("/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM things WHERE id = $1", [
      req.params.id,
    ]);
    res.json({
      status: "success",
      results: result.rows.length,
      data: {
        things: result.rows,
      },
    });
  } catch (error) {
    res.status(404).json(console.error(error.message));
  }
});

//* POST THING
app.post("/", autorization, async (req, res) => {
  try {
    const result = await db.query(
      "INSERT INTO things(name, description, score_plus, score_minus, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        req.body.name,
        req.body.description,
        0,
        0,
        req.user,
      ]
    );
    res.json({
      status: "success",
      data: { things: result.rows },
    });
  } catch (error) {
    res.status(404).json(console.error(error.message));
  }
});

//* DELETE THING
app.delete("/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM things WHERE id = $1", [
      req.params.id,
    ]);
    res.json({
      status: "success",
      results: result.rows.length,
      data: {
        things: result.rows,
      },
    });
  } catch (error) {
    res.status(404).json(console.error(error.message));
  }
});

//* LIKE
app.put("/:id/like", async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE things SET score_plus = score_plus + 1 WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    res.json({
      status: "success",
      results: result.rows.length,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(404).json(console.error(error.message));
  }
});

//*DISLIKE
app.put("/:id/dislike", async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE things SET score_minus = score_minus + 1 WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    res.json({
      status: "success",
      results: result.rows.length,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(404).json(console.error(error.message));
  }
});

//* UPDATE THING
app.put("/:id", async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE things SET name = $1, description = $2, score_plus = $3, score_minus = $4 WHERE id = $5 RETURNING *",
      [
        req.body.name,
        req.body.description,
        req.body.score_plus,
        req.body.score_minus,
        req.params.id,
      ]
    );
    res.json({
      status: "success",
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
