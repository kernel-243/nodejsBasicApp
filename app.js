require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const { CronJob } =require('cron');


// routers
 
const userRouter = require('./routes/user');
 
const app = express();

// Set up mongoose connection
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGOURI;
 
connectToMongoDB().catch((err) => console.log(err));

async function connectToMongoDB() {
 const res= await mongoose.connect(mongoDB);
console.log('Connected to MongoDB ');
//use qavahdb
 

}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// middlewares
app.use(cors());
//cors allow all
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

// routes
// app.use('/app', indexRouter);
// app.use('/blog', blogRouter);
app.get('/test', (req, res) => {
  res.json({ message: 'Hello World here' });
}
);
 
app.use('/user', userRouter);
 
 


const job = new CronJob(
	//run every 25th of the month at 06h am
  '0 0 6 25 * *',
	function () {
		console.log('Sending res to all locataires');
	}, // onTick
	null, // onComplete
	true, // start
	'America/Los_Angeles' // timeZone
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message, status: err.status, stack: err.stack });
});

module.exports = app;





 