/**
 * createRouter 这个为创建路由的方法
 * createWebHashHistory 这个就是vue2中路由的模式，
 *                      这里的是hash模式，这个还可以是createWebHistory等
 * RouteRecordRaw 这个为要添加的路由记录，也可以说是routes的ts类型
 */
import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
// 路由记录，这个跟vue2中用法一致，就不做过多解释了
const routes:Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HelloWorld',
    component: () => import("@/components/HelloWorld.vue"),
    alias: '/helloWorld',
    meta: {
      title: 'HelloWorld页面'
    }
  },
  {
    path: '/gantt',
    name: 'frappeGantt',
    component: () => import("@/components/FrappeGantt/index.vue"),
    alias: '/frappeGantt',
    meta: {
      title: 'frappeGantt页面'
    }
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});
export default router;
