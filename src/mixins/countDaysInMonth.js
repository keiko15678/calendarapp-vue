export default {
  methods: {
    // total days in the month
    countDaysInMonth(year, month) {
      return /3|5|8|10/.test(month - 1)
        ? 30
        : month - 1 === 1
        ? (!(year % 4) && year % 100) || !(year % 400)
          ? 29
          : 28
        : 31
    }
  }
}
