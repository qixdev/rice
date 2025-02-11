const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { recover } = require('./middleware/misc');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const assignmentsRouter = require('./routes/assignments');
const formsRouter = require('./routes/forms');
const adminRouter = require('./routes/admin');
const newsRouter = require('./routes/news'); // <-- Added News Router
const session = require('express-session');

const bodyParser = require('body-parser');
const app = express();
const connectDB = require('./models/database');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // <-- Serve uploaded images

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/assignments', assignmentsRouter);
app.use('/forms', formsRouter);
app.use('/admin', adminRouter);
app.use('/news', newsRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

connectDB()
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1); // Exit if DB connection fails
    });

app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        "status": err.status || 500,
        "message": "something went wrong",
        "error": err.message
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on http://localhost:' + (process.env.PORT || 3000));
});

module.exports = app;
