const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const CalendarEventSchema = new mongoose.Schema({
  _UUID: { type: String, default: uuidv4 },
  title: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  updatedDate: {
    type: Date,
    default: Date.now(),
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  isFullDay: {
    type: Boolean,
  },
  isRecurring: {
    type: Boolean,
  },
  recurringPattern: {
    type: String,
  },
  isCancelled: {
    type: Boolean,
    default: false,
  },
});

// create index for search on startDate and endDate fields
CalendarEventSchema.index({
  startDate: 1,
  endDate: 1,
  _UUID: 1,
});

module.exports = mongoose.model('CalendarEvent', CalendarEventSchema);
