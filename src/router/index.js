import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    children: [
      {
        path: '/calender',
        component: () =>
          import(/* webpackChunkName: "calender" */ '../views/Calender.vue')
      }
    ]
  },
  {
    path: '/app',
    name: 'app',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "app" */ '../views/About.vue'),
    children: [
      {
        path: 'week',
        component: () =>
          import(/* webpackChunkName: "week" */ '../views/Week.vue')
      },
      {
        path: 'day',
        component: () =>
          import(/* webpackChunkName: "day" */ '../views/Day.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
