<template>
  <div>
    <div class="container-fluid shadow-md">
      <div class="row">
        <div class="col-24">
          <div class="d-flex align-items-center" style="font-size: 16px;">
            <button
              class="bg-secondary text-primary rounded-circle btn"
              style="font-size: 16px; transform:translateY(5px);"
            >
              <fa :icon="['far', 'calendar']"></fa>
            </button>
            <h5>選擇日期</h5>
            <a href="javascript:;" class="ml-auto">&times;</a>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-24 col-sm-12 col-lg-8">
          <Month :year="getNowYear" :month="getNowMonth"/>
          <div class="calender__btnblock pb-2 clearfix">
            <span v-for="day in weeks" :key="day.id" class="calender__btn">{{ day.n }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid bg-light">
      <div class="row">
        <div
          class="col-24 col-sm-12 col-lg-8"
          v-for="(date, index) in dates"
          :key="date.month.toString()+date.year"
        >
          <Month
            :year="date.year"
            :month="date.month"
            v-if="index > currentDateIndex && index < (currentDateIndex + 7)"
          />
          <Dates
            :dates="date.days"
            v-if="index >= currentDateIndex && index < (currentDateIndex + 7)"
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
