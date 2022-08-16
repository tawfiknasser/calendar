const express = require('express');

const app = express();
const createError = require('http-errors');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db/connect');
const router = require('./router');
const responseStatus = require('./lib/responseStatusSelector');
const logger = require('./lib/logger');

connectDB()
  .then(() => {
    logger.info('connected to the database');
  })
  .catch((e) => {
    logger.error(`failed to connect to the database. do something! ${e.message}`);
  });

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    logger.info(`${req.method}::${req.url}`);
    next();
  });
}

app.use(cors({
  methods: 'PUT,POST,SEARCH',
}));

app.use(bodyParser.json());

app.use('/api', router);

app.use((req, res, next) => {
  logger.warn('not found route');
  next(createError(responseStatus.NotFound));
});
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || responseStatus.InternalServerError);
  logger.error(`server error: ${err.status || responseStatus.InternalServerError}. ${err.message}`);

  res.json({
    error: {},
    message: err.message,
  });
});

module.exports = app;
