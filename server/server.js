require("dotenv").config();
const express = require("express");
const db = require("./db");
const app = express();
const cors = require("cors");
const path = require("path");
const multer = require("multer");
//const upload = multer({ dest: "./public/uploads" });

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
>>>>>>> tmp

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.static("./"));

//& IMGS
//* POST IMG
app.post("/:id/uploadImg", upload.single("myFile"), (req, res) => {
  try {
    const result = db.query(
      "INSERT INTO imgs(id, img_name, img_url) VALUES ($1, $2, $3) RETURNING *",
      [req.params.id, req.file.originalname, req.file.path]
    );
    console.log(req.file);
    res.json({ success: true });
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
    );
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

<<<<<<< HEAD
const upload = multer({ dest: "uploads/" });

=======
//& THINGS
//* GET ALL THINGS
>>>>>>> tmp
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
<<<<<<< HEAD
});

app.get("/:id/img", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT img_url, img_id FROM imgs WHERE id = $1",
      [req.params.id]
    );
    res.json({
      status: "success",
      results: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    res.status(404).json(console.error(error.message));
  }
});

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

app.post("/:id/uploadimg", upload.single("img"), async (req, res) => {
  console.log(req.file, req.body);
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  try {
    const result = await db.query(
      "INSERT INTO imgs (id, img_name, img_url) VALUES ($1, $2, $3)",
      [req.params.id, req.file.originalname, req.file.path]
    );
    res.json({
      status: "success",
      data: result.rows,
=======
});

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
>>>>>>> tmp
    });
  } catch (error) {
    res.status(404).json(console.error(error.message));
  }
});

<<<<<<< HEAD
=======
//* POST THING
>>>>>>> tmp
app.post("/", async (req, res) => {
  try {
    const result = await db.query(
      "INSERT INTO things(name, description, score_plus, score_minus) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        req.body.name,
        req.body.description,
        req.body.score_plus,
        req.body.score_minus,
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

<<<<<<< HEAD
=======
//* DELETE THING
>>>>>>> tmp
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

<<<<<<< HEAD
=======
//* LIKE
>>>>>>> tmp
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

<<<<<<< HEAD
=======
//*DISLIKE
>>>>>>> tmp
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

<<<<<<< HEAD
=======
//* UPDATE THING
>>>>>>> tmp
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
