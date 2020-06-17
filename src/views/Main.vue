<template>
  <div>
    <div
      class="container-fluid shadow-sm bg-white position-fixed"
      style="top:0; left:0; z-index:1000;"
    >
      <div class="row">
        <div class="col-24">
          <div class="d-flex align-items-center pt-2">
            <h5>預約行事曆</h5>
            <a
              href="javascript:;"
              class="ml-auto btn btn-secondary text-primary rounded-pill"
              @click="$router.push({ name: $route.path.includes('week') ? 'day' : 'week' })"
            >{{ $route.path.includes('week') ?'週檢視' : '日檢視' }}</a>
            <a href="javascript:;" class="ml-2 btn btn-secondary text-primary rounded-pill">使用者</a>
          </div>
        </div>
      </div>
      <div class="row py-2">
        <div class="col-3 text-center d-flex align-items-center justify-content-center">
          <button
            class="bg-secondary text-primary rounded-circle btn"
            style="font-size: 16px; transform:translateY(5px);"
            @click="$router.push({ name: 'calendar'})"
          >
            <fa :icon="['far', 'calendar']"></fa>
          </button>
        </div>
        <button
          class="col-3 btn"
          v-for="(day,index) of getNowWeek"
          :key="day.day"
          :class="{ 'bg-primary rounded': isToday(day) && $route.path.includes('day')}"
          @click="selectDay(day)"
        >
          <a href="javascript:;" class="d-flex flex-column align-items-center text-dark btn">
            <span
              class="d-block text-center"
              :class="{'text-light': isToday(day) && $route.path.includes('day')}"
            >{{ weeks[index].n}}</span>
            <span
              class="d-block text-center"
              :class="{'text-light': isToday(day) && $route.path.includes('day')}"
            >{{ day.day }}</span>
          </a>
        </button>
      </div>
    </div>
    <router-view
      :timeline="timeline"
      :week="filterEventsToCurrentWeek()"
      :events="filterEventsToCurrentDay()"
    ></router-view>
    <div class="container-fluid position-fixed bg-white shadow-sm" style="bottom:0; left:0;">
      <div class="row">
        <div class="col-24 text-center py-3">
          <button
            type="button"
            class="btn btn-primary"
            data-target="#addEventModal"
            data-toggle="modal"
          >新增預約</button>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="addEventModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">新增預約</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div
              class="alert alert-warning alert-dismissible fade show"
              role="alert"
              v-for="alert in alerts"
              :key="alert"
            >
              {{ alert }}
              <button
                type="button"
                class="close"
                data-dismiss="alert"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="form-row">
              <div class="form-group col-24">
                <label for="exampleFormControlTextarea1">預約內容</label>
                <textarea
                  v-model="form.content"
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group col-24">
                <label for="exampleInputEmail1">日期</label>
                <input
                  v-model="form.date"
                  type="date"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                >
              </div>
              <div class="form-group col-12">
                <label for="exampleFormControlSelect1">開始時間</label>
                <select
                  class="form-control"
                  id="exampleFormControlSelect1"
                  v-model="form.startTime"
                >
                  <option value>選擇開始的時間</option>
                  <option v-for="time in timeline" :key="time" :value="time">{{time}}</option>
                </select>
              </div>
              <div class="form-group col-12">
                <label for="exampleFormControlSelect2">結束時間</label>
                <select class="form-control" id="exampleFormControlSelect2" v-model="form.endTime">
                  <option value>選擇結束的時間</option>
                  <option v-for="time in timeline" :key="time" :value="time">{{time}}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleFormSubmit"
              :data-dismiss="alerts.length > 0 ? '' : 'modal'"
            >提交</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import weeksData from '@/mixins/weeksData'

export default {
  mixins: [weeksData],
  computed: {
    ...mapGetters(['getNowWeek', 'getNowMonth', 'getNowYear', 'getNowDay'])
  },
  data() {
    return {
      timeline: [],
      form: {
        content: '',
        startTime: '',
        endTime: '',
        date: ''
      },
      alerts: []
    }
  },
  methods: {
    ...mapMutations(['setNowDate']),
    // make timeline blocks (every 30 mins)
    makeTimeline() {
      for (let i = 6; i < 24; i += 0.5) {
        const hour = parseInt(i).toString()
        const min = i % 1 === 0 ? '00' : '30'
        const zone = parseInt(i) < 12 ? 'am' : 'pm'
        const str = hour + ':' + min + zone
        this.timeline = [...this.timeline, str]
      }
    },
    getEventsFromLs() {
      const events = JSON.parse(localStorage.getItem('events'))
      if (!events) return false
      return events
    },
    filterEventsToCurrentWeek() {
      const filteredEvents = this.getEventsFromLs() || []
      const res = this.getNowWeek.map(weekDay => {
        const inRange = { ...weekDay, events: [] }
        filteredEvents.forEach(event => {
          const date = new Date(event.date)
          if (weekDay.month === date.getMonth() + 1 && weekDay.year === date.getFullYear() && weekDay.day === date.getDate()) {
            inRange.events = [...inRange.events, event]
          }
        })
        return inRange
      })
      return res
    },
    filterEventsToCurrentDay() {
      const filteredEvents = this.getEventsFromLs() || []
      const res = filteredEvents.filter(event => {
        const date = new Date(event.date)
        if (date.getMonth() + 1 === this.getNowMonth && date.getFullYear() === this.getNowYear && date.getDate() === this.getNowDay) return event
      })
      return res || []
    },
    handleFormSubmit() {
      if (this.form.content === '' || this.form.startTime === '' || this.form.endTime === '' || this.form.date === '') {
        this.alerts.push('請填入所有欄位')
        return false
      }
      const startTime = +this.form.startTime.substr(0, this.form.startTime.indexOf('a') > -1 ? this.form.startTime.indexOf('a') : this.form.startTime.indexOf('p')).split(':').join('')
      const endTime = +this.form.endTime.substr(0, this.form.endTime.indexOf('a') > -1 ? this.form.endTime.indexOf('a') : this.form.endTime.indexOf('p')).split(':').join('')
      if (startTime > endTime) {
        this.alerts.push('開始時間不得晚於結束時間')
        return false
      }
      const events = this.getEventsFromLs() || []
      events.push(this.form)
      localStorage.setItem('events', JSON.stringify(events))
      this.form = { content: '', startTime: '', endTime: '', date: '' }
      this.filterEventsToCurrentWeek()
    },
    isToday(date) {
      const { day, month, year } = date
      return day === this.getNowDay && month === this.getNowMonth && year === this.getNowYear
    },
    selectDay(date) {
      // if (this.$route.path.includes('week')) return false
      const { day, month, year } = date
      this.setNowDate(`${year}-${month}-${day}`)
    }
  },
  created() {
    this.makeTimeline()
    // localStorage.setItem('events', JSON.stringify([{ date: new Date(), startTime: '08:00', endTime: '12:00', content: 'hello world' }]))
    this.filterEventsToCurrentWeek()
  }
}
</script>

<style>
</style>
