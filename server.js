require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection')

const express = require('express');
const app = express();

const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3500;




//connect to the database
connectDB();

app.use(cors(corsOptions));

//built-in middleware to handle urlencoded form data
app.use(express.urlencoded({extended : false}));

//built in middleware for JSON
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//routers
app.use('/tasks', require('./routes/api/tasks'));
app.use('/register', require('./routes/api/register'));
app.use('/auth', require('./routes/api/auth'));
app.use('/refresh', require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logout'));

app.all('*', (req, res) => {
    res.status(404).type('txt').send(`Error 404. The requested url ${req.url} was not found`);
});

//ensure that the connection to the DB is successful before listening
mongoose.connection.once('connected', () => 
{
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
