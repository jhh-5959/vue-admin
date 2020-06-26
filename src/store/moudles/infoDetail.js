const state={
    id:''||sessionStorage.getItem('id'),

    /*title:''||sessionStorage.getItem('title'),*/
};

const getters={
    infoId:state=> state.id,
    infoTitle:state=>state.title
};

const mutations={
    SET_STATE(state,payload){
        state.id=payload.id;
        /*state.title=payload.title;*/
        sessionStorage.setItem('id',payload.id);
        /*sessionStorage.setItem('title',payload.title);*/
    }
};

const actions={

    
};
export default {
    //使用名命空间
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}