const express = require('express');
const routes = require('./routes');
require('dotenv').config();

const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`); 
})

app.get('/', async (req, res) => {
    res.send('Hello World');
})

app.use('/api', routes);