import Vue from "vue";
import VueCompositionApi from '@vue/composition-api';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router";
import store from "./store";

//引入自定义的全局的svg组件
import "./icons/index";


//引入 路由守卫
import "router/routerGuard"



Vue.config.productionTip = false;
//使用 Element ui框架
Vue.use(ElementUI);
//使用 vue3.0语法
Vue.use(VueCompositionApi);
//创建vue实例
new Vue({
  //绑定路由
  router,
  //vuex状态管理仓库
  store,
  //初始化渲染页面
  render: h => h(App)

}).$mount("#app");
