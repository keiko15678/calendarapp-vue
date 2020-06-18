<template>
  <form class="form-signin d-flex flex-column align-items-center justify-content-center">
    <img class="mb-4" src="../assets/logo.png" alt width="72" height="72">
    <h1 class="h2 mb-3 font-weight-bold text-center">預約行事曆 APP</h1>
    <button class="btn btn-lg btn-primary btn-block" type="submit" @click="handleLogin">LINE Login</button>
  </form>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'Home',
  computed: {
    ...mapState(['isLoggedIn'])
  },
  methods: {
    ...mapActions(['updateLoginStatus']),
    handleLogin() {
      location.href = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1654358305&scope=profile&state=123&redirect_uri=${process.env.VUE_APP_LOCAL_URL}`
    },
    verifyToken(accessToken, refreshToken) {
      axios.post(`${process.env.VUE_APP_API_URL}/users/verify`, { accessToken, refreshToken })
        .then(res => {
          // login success
          const { accessToken, displayName, userId } = res.data
          this.updateLoginStatus({ status: true, accessToken, displayName, userId })
          this.$router.push({ name: 'week' })
        })
        .catch((err) => {
          // retry verify after getting new access token
          const { status, data: { accessToken } } = err.response
          if (status === 401) this.verifyToken(accessToken)

          // otherwise, login required
          this.updateLoginStatus({ status: false, accessToken: '', displayName: null, userId: null })
        })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.isLoggedIn) vm.$router.push({ name: 'week' })
    })
  },
  mounted() {
    if (location.href.includes('?code=')) {
      const code = location.href.split('?')[1].split('&')[0].split('=')[1]
      const state = '123'
      axios.get(`${process.env.VUE_APP_API_URL}/users?code=${code}&state=${state}`)
        .then(res => {
          const { access_token: accessToken, refresh_token: refreshToken } = res.data
          this.verifyToken(accessToken, refreshToken)
        })
    }
  }
}
</script>

<style scoped>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
  margin-top: 100px;
}
</style>
