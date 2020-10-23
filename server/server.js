require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('./'))

//& GET things, pagination, search pagination
app.use('/api', require('./routes/things'))

//& GET thing, img, comment, comment with parent, DEL&ED&POST thing
app.use('/api', require('./routes/thing'))

//& VOTE
app.use('/api', require('./routes/voting'))

//& POST & DEL img
app.use('/api', require('./routes/imgs'))

//& POST & DEL comment
app.use('/api', require('./routes/comment'))

//& LOGIN AND REGISTER
app.use('/api/auth', require('./routes/jwtAuth'))

const port = process.env.PORT || 3002
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
