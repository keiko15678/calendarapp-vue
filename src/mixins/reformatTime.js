export default {
  methods: {
    // e.g.'12:00pm' (String) -> 1200 (Number)
    reformatTime(time) {
      const substrEnd =
        time.indexOf('a') > -1 ? time.indexOf('a') : time.indexOf('p')
      return +time
        .substr(0, substrEnd)
        .split(':')
        .join('')
    }
  }
}
