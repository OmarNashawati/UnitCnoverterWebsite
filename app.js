const express = require('express')
const app = express()

const router = require('./routes/converter')

app.use(express.static('./public'))
app.use(express.json())

app.use('/api/v1',router)

const port = process.env.PORT || 3100
app.listen(port,console.log(`Server listen on port ${port}`))