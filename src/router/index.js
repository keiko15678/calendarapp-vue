import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/'
import axios from 'axios'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () =>
      import(/* webpackChunkName: "calendar" */ '../views/Calendar.vue')
  },
  {
    path: '/main',
    name: 'main',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "main" */ '../views/Main.vue'),
    children: [
      {
        path: 'week',
        name: 'week',
        component: () =>
          import(/* webpackChunkName: "week" */ '../views/Week.vue')
      },
      {
        path: 'day',
        name: 'day',
        component: () =>
          import(/* webpackChunkName: "day" */ '../views/Day.vue')
      },
      {
        path: '*',
        redirect: '/'
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.name === 'Home') {
    if (store.state.isLoggedIn) next(false)
    else next()
  }
  verifyToken(token)
  function verifyToken(accessToken, refreshToken) {
    axios
      .post(`${process.env.VUE_APP_API_URL}/users/verify`, {
        accessToken,
        refreshToken
      })
      .then(res => {
        console.log('login success')
        // login success
        const { accessToken, displayName, userId } = res.data
        store.dispatch('updateLoginStatus', {
          status: true,
          accessToken,
          displayName,
          userId
        })
        next()
      })
      .catch(err => {
        // retry verify after getting new access token
        const {
          status,
          data: { accessToken }
        } = err.response
        if (status === 401) {
          verifyToken(accessToken)
        } else {
          // otherwise, login required
          store.dispatch('updateLoginStatus', {
            status: false,
            accessToken: '',
            displayName: null,
            userId: null
          })
          next(false)
        }
      })
  }
})
export default router
