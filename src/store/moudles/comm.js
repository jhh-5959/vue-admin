import { getCategoryAll } from "@/api/new"
const state={
    QNYImgUrl:'http://qciihvi1k.bkt.clouddn.com/',
};

const actions={
    /*方式二 使用 vuex 状态管理*/
    readerClass(){
        return new Promise((resolve,reject)=>{
            getCategoryAll({})
                .then( res=>resolve(res.data.data))
                .catch(err=>reject(err))
        })
    }
    
};


export default {
    //使用名命空间
    namespaced:true,
    actions,
    state
}