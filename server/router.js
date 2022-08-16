const express = require('express');
const _ = require('lodash');
const responseStatus = require('./lib/responseStatusSelector');
const logger = require('./lib/logger');
const sendSuccess = require('./lib/sendSuccess');
const Calendar = require('./DAL/Calendar');

const router = express.Router();

router.route('/getEvents')
  .search((request, response) => {
    const { startRange, endRange } = request.body;

    Calendar
      .getEvents(startRange, endRange)
      .then((result) => {
        sendSuccess(response, result);
      })
      .catch((error) => {
        response.status(responseStatus.InternalServerError).send();
        logger.error(`error in /getEvents SEARCH. message: ${error.message}`);
      });
  });

router.route('/updateEvent')
  .put((request, response) => {
    const {
      _UUID,
    } = request.body;

    const updateValues = _.pick(request.body, ['title', 'startDate', 'endDate', 'isFullDay', 'isCancelled', 'isRecurring', 'recurringPattern']);

    Calendar
      .updateEvent(updateValues, _UUID)
      .then((result) => {
        sendSuccess(response, result);
      })
      .catch((error) => {
        response.status(responseStatus.InternalServerError).send();
        logger.error(`error in /updateEvent UPDATE. message: ${error.message}`);
      });
  });

router.route('/createEvent')
  .post((request, response) => {
    const newValues = _.pick(request.body, ['title', 'startDate', 'endDate', 'isFullDay', 'isRecurring', 'recurringPattern']);

    Calendar
      .createEvent(newValues)
      .then((result) => {
        sendSuccess(response, result);
      })
      .catch((error) => {
        response.status(responseStatus.InternalServerError).send();
        logger.error(`error in /createEvent UPDATE. message: ${error.message}`);
      });
  });

module.exports = router;
