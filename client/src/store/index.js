import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import API from '@/API';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    async getEvents({}, { startRange, endRange }) {
      return axios({
        url: API.GET_EVENTS,
        data: { startRange, endRange },
        method: 'SEARCH',
      });
    },
    async updateEvent({}, updateValues) {
      return axios({
        url: API.UPDATE_EVENT,
        data: {
          startDate: updateValues.start,
          endDate: updateValues.end,
          title: updateValues.name,
          _UUID: updateValues._UUID,
        },
        method: 'PUT',
      });
    },

    async createEventAction({}, newValues) {
      return axios({
        url: API.CREATE_EVENT,
        data: {
          startDate: newValues.start,
          endDate: newValues.end,
          title: newValues.name,
          isFullDay: !newValues.timed,
        },
        method: 'POST',
      });
    },
  },
  modules: {
  },
});
