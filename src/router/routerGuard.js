import router from "./index";
import {getTaken} from "../tools/handleCookie"

import store from "../store/";

const whiteRouter = ['/login'];

//to 到哪去
//form 从哪里来
//next 回调函数
router.beforeEach((to, from, next) => {
    //token存在
    if (getTaken()) {
        //退回登录页面,不让其返回
        if (to.path === '/login') {
            store.dispatch("app/logout").then(res=>{
                store.commit("power/SET_ROUTES",[]);
                sessionStorage.clear("AddRoutes");
            });
            next({replace:true});
        } else {
            //如果当前登录没有用户权限
            if (store.getters['app/roleData'].length === 0) {
                //调用接口获取到对应的权限
                store.dispatch('power/asyGetUserRole').then(res => {
                        //调用成功之后,获取对应的权限
                       /* console.log(res);*/
                        //角色权限
                        let resRole = res.data.data.role;
                        //按钮权限1(全局方法的形式设置)
                        let resButton = res.data.data.button;
                        //按钮权限2(全局自定义指令的形式设置)
                        let resButtonPower = res.data.data.btnPerm;
                        //修改角色权限
                        //使用mutations中的STORE_ROLES方法,修改store的值
                        store.commit('app/STORE_ROLES',resRole);
                        /*//使用mutations中的STORE_BUTTON方法,修改store的值
                        store.commit('app/STORE_BUTTON',resButton);*/
                        //修改按钮权限
                        store.commit('app/STORE_BUTTON',resButtonPower);
                        /*if (resRole.includes('admin')){
                            store.commit('app/STORE_BUTTON');
                        }*/
                        /*console.log(resRole);*/

                        //调用创建路由的方法
                        store.dispatch('power/createdRoutes',resRole).then(res=>{
                            /*console.log(res);*/
                            //添加进去的路由
                            let AddRoutes=store.getters['power/AddRoutes'];
                            //最终所有的路由
                            let AllRoutes=store.getters['power/AllRoutes'];

                           /* console.log('添加的路由----------------');
                            console.log(AddRoutes);
                            console.log('所有的路由----------------');
                            console.log(AllRoutes);
                            console.log(router);*/

                            sessionStorage.setItem('AddRoutes',JSON.stringify(AddRoutes));
                            //更新所有的路由
                            router.options.routes=AllRoutes;
                            //添加路由
                            router.addRoutes(AddRoutes);

                            /*console.log(`从${from.path}来`);
                            console.log(`去${to.path}`);*/
                            /*console.log(router);*/
                            /*console.log(from.path);*/
                            if (from.path==='/login'){
                                location.reload();
                            }

                            next({...to,replace:true});
                        })
                    });
            } else {
                next({replace:true});
            }
            next({replace:true});
        }
        //Taken不存在
    } else {
        if (whiteRouter.includes(to.path)) {
            next();
        } else {
            next({path: '/login'});

        }
    }
    /*console.log(to);
    console.log(from);
    console.log(next);*/
    next()

});


