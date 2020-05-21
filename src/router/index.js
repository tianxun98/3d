import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/index',
        name: 'index',
        component: () => import('../old-file/index.vue')
    },
    {
        path: '/',
        name: 'home',
        component: () => import('../views/home.vue')
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
