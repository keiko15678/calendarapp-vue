import Vue from 'vue'
import VueRouter from 'vue-router'

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

export default router
