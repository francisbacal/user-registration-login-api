require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const users = require('./src/routes/users')

const port = process.env.PORT || 5000;


/* ========================
| DATABASE CONNECTION 
--------------------------*/

const URI = 'mongodb://localhost:27017/user-api';

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})


/* ========================
| INITITALIZE THE APP 
--------------------------*/

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => next());


/* ========================
| USER ROUTE 
--------------------------*/

app.get('/', (req, res, next)=> res.send('USER - API'));
app.use('/users', users);




/* ========================
| ERROR HANDLING
--------------------------*/


app.use((err, req, res, next)=> {
    console.log(err)
    res.status(400).json({error: err})

})


/* ========================
| LISTEN TO PORT
--------------------------*/

app.listen(port, () => 
    {
        console.log(`App is running on port: ${port}`)
    }
)