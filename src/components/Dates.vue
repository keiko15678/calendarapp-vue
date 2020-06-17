<template>
  <div class="calender__btnblock clearfix">
    <a
      class="calender__btn py-2"
      href="javascript:;"
      v-for="day in dates"
      :key="day.day.toString()+day.month"
    >{{ day.day }}</a>
  </div>
</template>

<script>
export default {
  props: {
    dates: {
      type: Array,
      required: true
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
