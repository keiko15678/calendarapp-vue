<template>
  <div class="calender__btnblock clearfix">
    <a
      class="calender__btn py-2"
      :class="{ 'bg-primary text-white rounded-pill': isToday(date)}"
      :style="{ color: currentMonth !== date.month ? '#eee' : '#aaa'}"
      href="javascript:;"
      v-for="date in dates"
      :key="date.day.toString()+date.month"
      @click="handleDateSelect(date)"
    >{{ date.day }}</a>
  </div>
</template>

<script>
import checkDateIsToday from '@/mixins/checkDateIsToday'
export default {
  mixins: [checkDateIsToday],
  props: {
    dates: {
      type: Array,
      required: true
    }
  },
  computed: {
    // first day of a month always only appear once
    currentMonth: {
      get() {
        const firstDay = this.dates.find(date => date.day === 1)
        return firstDay.month
      }
    }
  },
  methods: {
    handleDateSelect(date) {
      this.$emit('handleDateSelect', date)
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
