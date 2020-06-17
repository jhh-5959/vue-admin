import router from "./index";
import {getTaken} from "../tools/handleCookie"

import store from "../store/";

const whiteRouter = ['/login'];


router.beforeEach((to, from, next) => {
    //to 到哪去
    //form 从哪里来
    //next 回调函数
    /*console.log(`from ====从 ${from.path} 来`);
    console.log(`to====到 ${to.path} 去`);*/
    if (getTaken()) {
        /*console.log('Taken存在');*/
        if (to.path === '/login') {
            store.dispatch("app/logout");
            next();
        } else {
            next();
        }
    } else {
        /*console.log('Taken不存在');*/
        if (whiteRouter.includes(to.path)) {
            next();
            console.log("到if里");
        } else{
            next({path: '/'});
            console.log("到else里");
        }
    }
    /*console.log(to);
    console.log(from);
    console.log(next);*/
    next()

});

