import {postLoginApi, postLogoutApi} from '@/api/login';

import {setTaken, setUserName, getTaken, getUserName, clearTaken, clearUserName} from '@/tools/handleCookie'

const state = {
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
    //true 不展开
    //false 展开
    //注意:  || 遇到 true 就返回
    toKen: getTaken() || '',
    userName: getUserName() || '',
    //对应的权限
    roleData: [],
    //对应按钮权限
    buttonPower: [],

};

const getters = {
    //类似于 computed计算属性
    /*ABC(state,getters,rootState){
        console.log(state);
        console.log(getters);
        console.log(rootState);
    }*/
    roleData: state => state.roleData,
    buttonPower: state => state.buttonPower,
};

const mutations = {
    CHANGE_COLLAPSE(state) {
        state.isCollapse = !state.isCollapse;
        sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse));
    },

    SET_TOKEN(state, token) {
        state.toKen = token;
    },
    SET_USERNAME(state, username) {
        state.userName = username;
    },

    //存储自己对应的权限
    STORE_ROLES(state, payload) {
        state.roleData = payload;
    },
    //存储自己对应的按钮权限
    STORE_BUTTON(state, payload) {
        state.buttonPower = payload;
        /* console.log(state.buttonPower)*/
    },
};

const actions = {
    loginApi(context, payload) {
        /*console.log(context)*/
        return new Promise((resolve, reject) => {
            postLoginApi(payload).then((response) => {
                    //获取数据
                    const data = response.data.data;
                    //设置Taken 到 cookie中
                    setTaken(data.token);
                    //设置userName 到 cookie中
                    setUserName(data.username);
                    //设置 Vuex 状态管理的属性
                    context.commit('SET_TOKEN', getTaken());
                    context.commit('SET_USERNAME', getUserName());
                    resolve(response);
                }
            ).catch(err => {
                reject(err)
            })
        })
    },

    logout(context) {
        return new Promise((resolve, reject) => {
            postLogoutApi().then(res => {
                    clearTaken();
                    clearUserName();
                    context.commit('SET_TOKEN', '');
                    context.commit('SET_USERNAME', '');
                    context.commit('STORE_ROLES', []);
                    context.commit('STORE_BUTTON', []);
                    resolve(res.data);
                }
            );
        })
    }


};


export default {
    //使用名命空间
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
