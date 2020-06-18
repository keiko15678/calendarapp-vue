<template>
  <div>
    <div
      class="container-xl shadow-md bg-white position-fixed"
      style="z-index: 1000; left:50%; transform:translateX(-50%);"
    >
      <div class="row">
        <div class="col-24">
          <div class="d-flex align-items-center">
            <button
              class="bg-secondary text-primary rounded-circle btn"
              style="font-size:16px; transform:translateY(5px);"
            >
              <fa :icon="['far', 'calendar']"></fa>
            </button>
            <h1 class="ml-2 mt-3 h5">選擇日期</h1>
            <a
              href="javascript:;"
              class="ml-auto mt-3 h3 text-decoration-none text-dark"
              @click="$router.push({ name: 'week'})"
            >&times;</a>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-24 mt-3">
          <Month :year="getNowYear" :month="getNowMonth"/>
          <div class="calender__btnblock pb-2 clearfix pt-1">
            <span v-for="day in weeks" :key="day.id" class="calender__btn">{{ day.n }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="container bg-light" style="padding-top: 140px;">
      <div class="row" id="datesArea">
        <div class="col-24" v-for="(date, index) in dates" :key="date.month.toString()+date.year">
          <Month :year="date.year" :month="date.month" v-if="index > currentDateIndex"/>
          <Dates
            :dates="date.days"
            v-if="index >= currentDateIndex"
            @handleDateSelect="handleDateSelect"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Dates from '@/components/Dates'
import Month from '@/components/Month'
import weeksData from '@/mixins/weeksData'

export default {
  components: {
    Dates,
    Month
  },
  mixins: [weeksData],
  computed: {
    ...mapGetters(['getNowYear', 'getNowMonth']),
    ...mapState(['dates']),
    currentCalender: {
      get() {
        return this.dates.find(date => {
          return +date.year === +this.getNowYear && +date.month === +this.getNowMonth
        })
      },
      set(date) {
        this.$store.commit('setNowDate', date)
      }
    },
    currentDateIndex: {
      get() {
        return this.dates.findIndex(date => {
          return +date.year === +this.getNowYear && +date.month === +this.getNowMonth
        })
      }
    }
  },
  methods: {
    handleDateSelect(date) {
      const { day, month, year } = date
      this.currentCalender = `${year}-${month}-${day}`
      this.$router.push({ name: 'week' })
    }
  }
}
</script>

<style lang="scss" scoped>
.calender {
  &__btn {
    float: left;
    width: calc(100% / 7);
    text-align: center;
  }
}
</style>
