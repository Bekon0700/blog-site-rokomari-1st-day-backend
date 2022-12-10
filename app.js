const { json } = require('express');
const express = require('express');
const morgan = require('morgan');

// global error class
const AppError = require('./utils/appError');

const globalErrorHandler = require('./controller/errorController');

const userRouter = require('./routes/userRoutes');
const tagRouter = require('./routes/tagRoutes');
const blogRouter = require('./routes/blogRoutes');

const app = express();

app.use(morgan('dev'));


// body-parser, reading data from req to req.body
app.use(express.json({ limit: '10kb' }));


app.get('/', (req, res) => {
  res.json({
    status: 'success'
  })
})

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tags', tagRouter);
app.use('/api/v1/blogs', blogRouter);


app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `can't find the ${req.originalUrl} in the server`,
  });

  next(new AppError(`can't find the ${req.originalUrl} in the server`, 500));
});

// error handler
app.use(globalErrorHandler);

module.exports = app;
