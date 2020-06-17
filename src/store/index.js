import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    now: new Date(),
    dates: []
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
    }
  },
  actions: {},
  modules: {}
})
