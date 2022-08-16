const CalendarEventModel = require('../db/models/CalendarEvent');
const logger = require('../lib/logger');

class Calendar {
  /**
   *
   * @param {*} object new event values
   * @returns new event
   */
  static async createEvent({
    title, startDate, endDate, isFullDay, isRecurring, recurringPattern,
  }) {
    const result = await CalendarEventModel.create({
      title: title || 'New event',
      startDate,
      endDate,
      isFullDay,
      isRecurring,
      recurringPattern,
    });
    logger.info(`created new event ${result._UUID}`);

    return result;
  }

  /**
   *
   * @param {*} object update values
   * @param {UUID4} _UUID
   * @returns updated event
   */
  static async updateEvent({
    title, startDate, endDate, isFullDay, isCancelled, isRecurring, recurringPattern,
  }, _UUID) {
    const findQuery = { _UUID };
    const updateObject = {
      title, startDate, endDate, isFullDay, isCancelled, isRecurring, recurringPattern,
    };
    const result = await CalendarEventModel.findOneAndUpdate(findQuery, updateObject);

    logger.info(`updated event ${_UUID}`);

    return result;
  }

  /**
   *
   * @param {string} startRange
   * @param {string} endRange
   * @returns {Array<events>} array of events inside the range
   */
  static async getEvents(startRange, endRange) {
    const findQuery = {
      $and: [{
        startDate: {
          $not: {
            $gt: new Date(endRange),
          },
        },
      }, {
        endDate: {
          $not: {
            $lt: new Date(startRange),
          },
        },
      }],
    };
    const result = await CalendarEventModel.find(findQuery);

    logger.info(`getting events between ${startRange} - ${endRange}`);

    return result;
  }
}

module.exports = Calendar;
