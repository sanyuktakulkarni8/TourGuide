const express = require('express');
const AppError = require('./utils/appError');
const app = express();
const globalErrorHandler = require('./controllers/errorHandler');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//middlewares

// app.use(express.static(''))
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on server `, 404));
});

app.use(globalErrorHandler);

module.exports = app;
