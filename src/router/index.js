import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/index.vue')
    },
    {
        path: '/project',
        name: 'project',
        component: () => import('../views/project-1/index.vue')
    },
    {
        path: '/run',
        name: '/run',
        component: () => import('../views/run-view.vue')
    },
    {
        path: '/run_time',
        name: '/run_time',
        component: () => import('../views/run-time.vue')
    },
    {
        path: '/test',
        name: '/test',
        component: () => import('../views/scene-test.vue')
    },
    {
        path: '/animation',
        name: '/animation',
        component: () => import('../views/project-1/test-animation.vue')
    },
    {
        path: '/mpl',
        name: '/mpl',
        component: () => import('../views/project-1/test-MPL.vue')
    }
];
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
