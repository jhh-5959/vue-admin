
import {postLoginApi} from '@/api/login';

import { setTaken,setUserName,getTaken, getUserName,clearTaken,clearUserName} from '@/tools/handleCookie'

const state={
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
    //true 不展开
    //false 展开
    //注意:  || 遇到 true 就返回
    toKen:getTaken()||'',
    userName:getUserName()||'',

};

const getters={
    //类似于 computed计算属性
    /*ABC(state,getters,rootState){
        console.log(state);
        console.log(getters);
        console.log(rootState);
    }*/
};

const mutations={
    CHANGE_COLLAPSE(state) {
        state.isCollapse = !state.isCollapse;
        sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse));
    },
    SET_TOKEN(state,token){
        state.toKen=token;
    },
    SET_USERNAME(state,username){
        state.userName=username;
    }
};

const actions={
    loginApi(context,payload) {
        console.log(context);
        return new Promise((resolve, reject) => {
            postLoginApi(payload).then((response) => {
                    //获取数据
                    const data=response.data.data;
                    //设置Taken 到 cookie中
                    setTaken(data.token);
                    //设置userName 到 cookie中
                    setUserName(data.username);

                    //设置 Vuex 状态管理的属性
                    context.commit('SET_TOKEN',getTaken());
                    context.commit('SET_USERNAME',getUserName());

                    resolve(response);
                }
            ).catch(err=>{
                reject(err)
            })
        })
    },

    logout(context){
       return new Promise((resolve,reject)=>{
           clearTaken();
           clearUserName();
           context.commit('SET_TOKEN','');
           context.commit('SET_USERNAME','');
           resolve();
       })
    }





};


export default {
    //使用名命空间
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}
