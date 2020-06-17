<template>
  <div>
    <div
      class="container-xl shadow-sm bg-white position-fixed"
      style="top:0; left:50%; transform:translateX(-50%); z-index:1000;"
    >
      <div class="row">
        <div class="col-24">
          <div class="d-flex align-items-center mt-3">
            <h5 v-show="$route.path.includes('week')">預約行事曆</h5>
            <div
              v-show="$route.path.includes('day')"
              class="align-items-center mr-2"
              :class="{ 'd-flex': $route.path.includes('day')}"
            >
              <a href="javascript:;" class="text-dark btn" @click="adjustDay(-1)">
                <fa icon="arrow-alt-circle-left"></fa>
              </a>
              <span>{{ getNowYear + ' / ' + getNowMonth + ' / ' + getNowDay}}</span>
              <a href="javascript:;" class="text-dark btn" @click="adjustDay(1)">
                <fa icon="arrow-alt-circle-right"></fa>
              </a>
            </div>
            <a
              href="javascript:;"
              class="ml-auto btn btn-secondary text-primary rounded-pill"
              @click="$router.push({ name: $route.path.includes('week') ? 'day' : 'week' })"
            >
              {{ $route.path.includes('week') ?'週檢視' : '日檢視' }}
              <fa icon="caret-down"></fa>
            </a>
            <a href="javascript:;" class="ml-2 btn btn-secondary text-primary rounded-pill">K</a>
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
          class="col-3 d-flex flex-column align-items-center btn"
          v-for="(day,index) of getNowWeek"
          :key="day.day"
          :class="{ 'bg-primary rounded': isToday(day) && $route.path.includes('day')}"
          @click="selectDay(day)"
        >
          <span
            :class="{'text-light': isToday(day) && $route.path.includes('day')}"
          >{{ weeks[index].n}}</span>
          <span :class="{'text-light': isToday(day) && $route.path.includes('day')}">{{ day.day }}</span>
        </button>
      </div>
    </div>
    <router-view
      :timeline="timeline"
      :week="filterEventsToCurrentWeek()"
      :events="filterEventsToCurrentDay()"
    ></router-view>
    <div
      class="container-xl position-fixed bg-white shadow-sm"
      style="bottom:0; left:50%; transform:translateX(-50%);"
    >
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
import checkDateIsToday from '@/mixins/checkDateIsToday'
import reformatTime from '@/mixins/reformatTime'
// import countDaysInMonth from '@/mixins/countDaysInMonth'
export default {
  mixins: [weeksData, checkDateIsToday, reformatTime],
  computed: {
    ...mapGetters(['getNowWeek'])
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
        if (this.alerts.indexOf('請填入所有欄位') === -1) this.alerts.push('請填入所有欄位')
        return false
      }
      // const startTime = +this.form.startTime.substr(0, this.form.startTime.indexOf('a') > -1 ? this.form.startTime.indexOf('a') : this.form.startTime.indexOf('p')).split(':').join('')
      // const endTime = +this.form.endTime.substr(0, this.form.endTime.indexOf('a') > -1 ? this.form.endTime.indexOf('a') : this.form.endTime.indexOf('p')).split(':').join('')
      const startTime = this.reformatTime(this.form.startTime)
      const endTime = this.reformatTime(this.form.endTime)
      if (startTime > endTime) {
        if (this.alerts.indexOf('開始時間不得晚於結束時間') === -1) this.alerts.push('開始時間不得晚於結束時間')
        return false
      }
      const events = this.getEventsFromLs() || []
      // check if block is already booked
      if (events.length) {
        if (events.find(event => this.reformatTime(event.startTime) <= startTime || this.reformatTime(event.endTime) >= endTime || this.reformatTime(event.endTime) > startTime)) {
          if (this.alerts.indexOf('這個時段已經有預約') === -1) this.alerts.push('這個時段已經有預約')
        }
      }
      events.push(this.form)
      localStorage.setItem('events', JSON.stringify(events))
      this.form = { content: '', startTime: '', endTime: '', date: '' }
      this.filterEventsToCurrentWeek()
    },
    selectDay(date) {
      // if (this.$route.path.includes('week')) return false
      const { day, month, year } = date
      this.setNowDate(`${year}-${month}-${day}`)
    },
    adjustDay(val) {
      if ((this.getNowDay === this.countDaysInMonth(this.getNowYear, this.getNowMonth) && val === 1) || (this.getNowDay === 1 && val === -1)) {
        if (val === 1) {
          if (this.getNowMonth === 12 && this.getNowDay === 31) {
            this.setNowDate(`${this.getNowYear + 1}-${1}-${1}`)
          } else {
            this.setNowDate(`${this.getNowYear}-${this.getNowMonth + 1}-${1}`)
          }
        } else {
          if (this.getNowMonth === 1 && this.getNowDay === 1) {
            this.setNowDate(`${this.getNowYear - 1}-${12}-${31}`)
          } else {
            this.setNowDate(`${this.getNowYear}-${this.getNowMonth - 1}-${this.countDaysInMonth(this.getNowYear, this.getNowMonth - 1)}`)
          }
        }
      } else {
        this.setNowDate(`${this.getNowYear}-${this.getNowMonth}-${this.getNowDay + val}`)
      }
    },
    countDaysInMonth(year, month) {
      return /3|5|8|10/.test(month - 1)
        ? 30
        : month - 1 === 1
          ? (!(year % 4) && year % 100) || !(year % 400)
            ? 29
            : 28
          : 31
    }
  },
  created() {
    this.makeTimeline()
    // localStorage.setItem('events', JSON.stringify([{ date: new Date(), startTime: '08:00', endTime: '12:00', content: 'hello world' }]))
    this.filterEventsToCurrentWeek()
  },
  beforeDestroy() {
    // force calender to render current month at top
    this.setNowDate(new Date())
  }
}
</script>

<style>
</style>
