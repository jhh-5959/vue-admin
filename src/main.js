import Vue from "vue";
import VueCompositionApi from '@vue/composition-api';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router";
import store from "./store";

//引入自定义的全局的svg组件
import "./icons/index";

/*//引入自定义的全局的方法
import dialogFn from "./tools/dialog"
Vue.use(dialogFn);*/
import {buttonPower} from "./tools/buttonPower";

//引入 路由守卫
import "router/routerGuard"


Vue.config.productionTip = false;
//使用 Element ui框架
Vue.use(ElementUI);
//使用 vue3.0语法
Vue.use(VueCompositionApi);

/*
//使用自定义的全局的方法(按钮权限)
Vue.prototype.btnPower=buttonPower;
*/

//全局组件方式
Vue.directive('btnPower', {
    //bind生命周期
    bind: (el, binding) => {
        /* console.log(el);*/
        if (binding.def.buttonPower(binding.value)) {
            el.classList.value += " btn-isShow";
        }
    },
    //inserted生命周期
    inserted: (el) => {
    },
    buttonPower: (val) => {
        let role = store.getters['app/roleData'];
        if (role.includes('admin')) {
            return true
        }
        let btnPower = store.getters['app/buttonPower'];
        return btnPower.indexOf(val) !== -1
    }
});


//创建vue实例
new Vue({
    //绑定路由
    router,
    //vuex状态管理仓库
    store,
    //初始化渲染页面
    render: h => h(App)

}).$mount("#app");
