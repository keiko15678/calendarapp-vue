import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['getNowDay', 'getNowMonth', 'getNowYear'])
  },
  methods: {
    isToday(date) {
      const { day, month, year } = date
      return (
        day === this.getNowDay &&
        month === this.getNowMonth &&
        year === this.getNowYear
      )
    }
  }
}
