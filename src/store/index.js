import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
import app  from './moudles/App';
export default new Vuex.Store({
    state: {
       /* abc:123*/
    },
    getters: {
        /*fn1(state){
            console.log(state);
        },
        fn2(state,getters){
            console.log(state);
            console.log(getters);

        },
        fn3(state){
            return (number)=>{
                return state.abc+number;
            }
        }*/

    },
    mutations: {
      /*  SETSTATE(state){
            state.abc+=10;
            console.log(state.abc);
        },
        SETSTATE2(state,payload){
            console.log(payload);

        },
        SETSTATE3(state,payload){
            console.log(payload);
            state.abc+=payload.a;
            console.log(state.abc);
        }*/
    },
    actions: {},
    modules: {
        app
    }
});
