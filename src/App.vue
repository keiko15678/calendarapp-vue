<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  methods: {
    // find which day of week does the month start at
    zellerCongruence(year, month, day) {
      // 蔡勒公式中 1, 2 月視為前一年的 13, 14 月
      if (month === 1 || month === 2) {
        month += 12
        year -= 1
      }
      const c = Math.floor(year / 100) // 年份前兩位數
      const y = year % 100 // 年份後兩位數
      const m = month
      const d = day
      let w = 0
      // TODO: 1582.10.15 以後改曆，目前尚未處理 1582.10.4 以前公式
      w = y + Math.floor(y / 4) + Math.floor(c / 4) - 2 * c + Math.floor((26 * (m + 1)) / 10) + d - 1
      if (w < 0) w = (w & (7 + 7)) % 7
      else w = w % 7
      return w
    },
    countDaysInMonth(year, month) {
      return /3|5|8|10/.test(month - 1)
        ? 30
        : month - 1 === 1
          ? (!(year % 4) && year % 100) || !(year % 400)
            ? 29
            : 28
          : 31
    },
    // make dates from years 1900-2100
    produceDates() {
      const res = []
      let obj
      const totalDays = 42
      for (let i = 1900; i <= 2100; i++) {
        obj = {}
        obj.year = i
        for (let j = 1; j <= 12; j++) {
          const days = this.countDaysInMonth(i, j)
          const obj2 = { ...obj }
          obj2.month = j
          obj2.days = []
          for (let k = 1; k <= days; k++) {
            obj2.days.push({ day: k, month: j, year: i })
            const startDate = this.zellerCongruence(i, j, k)
            if (k === 1) {
              obj2.startDate = startDate
            }
          }
          if (obj2.startDate !== 0) {
            const daysInPrevMonth = this.countDaysInMonth(i, j - 1)
            let val = daysInPrevMonth
            for (let l = 0; l < obj2.startDate; l++) {
              obj2.days.unshift({ day: val, month: j - 1, year: j - 1 === 12 ? i - 1 : i })
              val--
            }
          }
          const fillTailDays = totalDays - obj2.days.length
          for (let m = 1; m < fillTailDays + 1; m++) {
            obj2.days.push({ day: m, month: j + 1, year: j + 1 === 1 ? i + 1 : i })
          }
          res.push(obj2)
        }
      }
      localStorage.setItem('dates', JSON.stringify(res))
      return res
    }
  },
  mounted() {
    // only run dates on first launch
    const dates = localStorage.getItem('dates') ? JSON.parse(localStorage.getItem('dates')) : this.produceDates()
    this.$store.commit('setDates', dates)
  }
}
</script>

<style lang="scss">
@import "../node_modules/bootstrap/scss/functions";
@import "./assets/variables";
@import "../node_modules/bootstrap/scss/mixins";

@import "../node_modules/bootstrap/scss/bootstrap";
</style>
