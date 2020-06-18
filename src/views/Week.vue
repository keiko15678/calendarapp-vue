<template>
  <div class="container-xl bg-light" style="padding-top: 130px; padding-bottom: 70px;">
    <div class="row" v-for="time of timeline" :key="time">
      <div
        class="col-3 border border-right-0 border-top-0 text-center pt-5 pb-n1"
        style="min-height: 10vh;"
      >
        <small
          class="position-absolute"
          style="left:25%; bottom: 0;"
        >{{ time.split('a')[0].length > 5 ? time.split('p')[0] : time.split('a')[0] }}</small>
      </div>
      <div
        class="col-3 border border-right-0 border-top-0 text-center text-break"
        :class="{ 'bg-info': isBooked(item.events, time).res,
        'border-info': isBooked(item.events, time).res,
        'rounded-top': isBooked(item.events, time).start,
        'rounded-bottom': isBooked(item.events, time).end}"
        v-for="item in week"
        :key="item.day"
      >{{ isBooked(item.events, time).start ? isBooked(item.events, time).res : '' }}</div>
    </div>
  </div>
</template>

<script>
import checkBookingBlock from '@/mixins/checkBookingBlock'
import reformatTime from '@/mixins/reformatTime'
export default {
  mixins: [checkBookingBlock, reformatTime],
  props: {
    timeline: {
      type: Array,
      required: true
    },
    week: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>
</style>
