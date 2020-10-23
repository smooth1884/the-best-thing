const express = require('express'),
    path = require('path')
dotenv = require('dotenv')
app = express()

dotenv.config()

app.use(express.static(path.join(__dirname, 'build')))
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
