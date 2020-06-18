export default {
  methods: {
    // check and return whether event start/ends/exists at each block
    isBooked(events, time) {
      let res = false
      let start = false
      let end = false
      events.forEach(event => {
        const timeBlockReformat = this.reformatTime(time)
        const startTimeReformat = this.reformatTime(event.startTime)
        const endTimeReformat = this.reformatTime(event.endTime)
        if (
          timeBlockReformat > startTimeReformat &&
          timeBlockReformat <= endTimeReformat
        ) {
          res = event.content
        }
        // minus 30 mins because UI starts at the 'next' block
        // e.g. event starts @ 8:00, UI starts showing at the 8:30 block
        if (
          timeBlockReformat - 30 === startTimeReformat ||
          timeBlockReformat - 70 === startTimeReformat
        ) {
          start = true
        }

        if (timeBlockReformat === endTimeReformat) {
          end = true
        }
      })
      return { res, start, end }
    }
  }
}
