import { createRouter, createWebHistory } from 'vue-router'
import { useStoreUser } from '@/stores'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/user/patient',
      component: () => import('@/views/User/PatientPage.vue'),
      meta: { title: '家庭档案' }
    },
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: { title: '首页' }
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: { title: '健康百科' }
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: { title: '消息通知' }
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: { title: '个人中心' }
        }
      ]
    }
  ]
})
// 改变动画颜色的插件
NProgress.configure({
  showSpinner: false
})

const wihteList = ['/login']

router.beforeEach((to, from, next) => {
  // 开启动画
  NProgress.start()
  const store = useStoreUser()
  //没有token && 没有登录页就跳转登录页
  if (!store.user?.token && !wihteList.includes(to.path)) {
    next('/login')
  } else {
    next()
  }
})
router.afterEach((to) => {
  // 动态设置标题
  document.title = `优医问诊-${to.meta.title || ''}`
  // 结束动画
  NProgress.done()
})

export default router
