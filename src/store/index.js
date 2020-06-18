import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    now: new Date(),
    dates: [],
    isLoggedIn: false,
    displayName: null,
    userId: null,
    events: []
  },
  getters: {
    getNowYear(state) {
      return state.now.getFullYear()
    },
    getNowMonth(state) {
      return state.now.getMonth() + 1
    },
    getNowMonthDates(state, getters) {
      return state.dates.find(
        date =>
          date.month === getters.getNowMonth && date.year === getters.getNowYear
      ).days
    },
    getNowDayOfWeek(state) {
      return state.now.getDay()
    },
    getNowDay(state) {
      return state.now.getDate()
    },
    // get this week's dates (ordered from sunday-saturday)
    getNowWeek(state, getters) {
      const lengthOfWeek = 7
      const dayOfWeek = getters.getNowDayOfWeek
      const filterForward = lengthOfWeek - dayOfWeek
      const filterBackward = lengthOfWeek - filterForward
      const filterStart = getters.getNowMonthDates.findIndex(
        day =>
          day.day === getters.getNowDay && day.month === getters.getNowMonth
      )
      return getters.getNowMonthDates.slice(
        filterStart - filterBackward,
        filterStart + filterForward
      )
    }
  },
  mutations: {
    setNowDate(state, payload) {
      state.now = new Date(payload)
    },
    setDates(state, payload) {
      state.dates = payload
    },
    setLogin(state, payload) {
      state.isLoggedIn = payload
    },
    setDisplayName(state, payload) {
      state.displayName = payload
    },
    setUserId(state, payload) {
      state.userId = payload
    },
    setEvents(state, payload) {
      state.events = payload
    }
  },
  actions: {
    updateLoginStatus({ commit }, payload) {
      const { status, displayName, accessToken, userId } = payload
      localStorage.setItem('token', accessToken)
      localStorage.setItem('userId', userId)
      commit('setLogin', status)
      commit('setDisplayName', displayName || null)
      commit('setUserId', userId || null)
    },
    GET_events({ commit, state }) {
      return axios
        .get(`${process.env.VUE_APP_API_URL}/events/${state.userId}`)
        .then(res => {
          commit('setEvents', res.data.events)
        })
    },
    UPDATE_events({ commit, state }, payload) {
      return axios
        .post(`${process.env.VUE_APP_API_URL}/events/${state.userId}`, {
          event: payload
        })
        .then(res => {
          commit('setEvents', [...state.events, payload])
        })
    }
  },
  modules: {}
})
