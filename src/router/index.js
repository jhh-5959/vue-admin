//使用vue模块
import Vue from "vue";
//使用 vue-router 模块
import VueRouter from "vue-router";
//引入 routes  自定义路由地址 文件
import { routes } from "./routes";



//vue使用路由
Vue.use(VueRouter);
//解决 vue-router 在3.0版本以上重复点菜单报错的问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
};


const router = new VueRouter({
    routes,
    /*mode: "history"*/
});

export default router;
