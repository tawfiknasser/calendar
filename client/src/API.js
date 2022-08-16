const SERVER_BASE = 'http://localhost:8000';

/**
 * API selector
 */
export default {
  SERVER_BASE,
  GET_EVENTS: `${SERVER_BASE}/api/getEvents`,
  UPDATE_EVENT: `${SERVER_BASE}/api/updateEvent`,
  CREATE_EVENT: `${SERVER_BASE}/api/createEvent`,
};
