//获取系统权限API
import {getUserRole} from "../../api/user";
//引入路由
import {defaultRouter, dynamicRoutes} from "../../router/routes";

function hasPower(roles,router) {
    /*console.log(roles);// ["业务员", "技术员"]   当前用户的权限
    console.log(router.meta.role);// ["业务员"]  路由上权限标识*/
    if (router.meta&&router.meta.role){
       return  roles.some(item=> router.meta.role.indexOf(item)>=0 )
    }

}
const state = {

    //显示页面的所有路由
    AllRoutes: defaultRouter,
    //权限路由
    AddRoutes: [],
};
const getters = {
    AllRoutes: state => state.AllRoutes,
    AddRoutes: state => state.AddRoutes

};
const mutations = {

    //添加对应的路由
    SET_ROUTES(state, payload) {
        state.AddRoutes = payload;
        state.AllRoutes=defaultRouter.concat(payload);
    }


};
const actions = {
    //调用接口 获取对应的权限并存入 到state中
    asyGetUserRole(context) {
        /*console.log(context);*/
        return new Promise((resolve, reject) => {
            getUserRole()
                .then(res => {
                    let resRole = res.data.data.role;
                    //将异步结果返回
                    resolve(res);
                })
                .catch(err => reject(err));
        })
    },
    //创造路由
    createdRoutes(context, resRole) {
        return new Promise((resolve, reject) => {
            //根据权限匹配在动态路由中匹配对应的值
            let addRoutes=[];
            //---如果是超级管理员
            if (resRole.includes('admin')) {
                addRoutes=dynamicRoutes;
            }else{
                //---筛选所有的动态路由,得到对应符合权限的路由
                addRoutes = dynamicRoutes.filter(item => {
                    //获取角色权限的方式
                    if (hasPower(resRole,item)){
                        if (item.children&&item.children.length>0){
                            item.children=item.children.filter(child=>{
                                if (hasPower(resRole,child)){
                                    return child
                                }
                            });
                            return item;
                        }
                        return item;
                    }
                    addRoutes.push(dynamicRoutes[dynamicRoutes.length-1]);
                    /*//获取系统权限的方式
                    //如果有动态路由中的power属性和对应权限相匹配
                    if (resRole.includes(item.meta.power)) {
                        //返回当前的路由
                        return item;
                    }*/
                });
            }
           /* console.log(addRoutes);*/
            context.commit('SET_ROUTES', addRoutes);
            resolve()
        })
    }
};

export default  {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}