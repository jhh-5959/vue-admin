import server from "../tools/interceptor";

/*获取角色*/
export function getRole(data={}) {
    return server.request({
        url:'/role/',
        method:'POST',
        data
    });
}
/*获取用户角色权限*/
export function getUserRole(data={}) {
    return server.request({
        url:'/userRole/',
        method:'POST',
        data
    });
}
/*获取按钮权限*/
export function getUserBtnPower(data={}) {
    return server.request({
        url:'/permButton/',
        method:'POST',
        data
    });
}



/*获取系统*/
export function getSystem(data={}) {
    return server.request({
        url:'/system/',
        method:'POST',
        data
    })
}


/*用户添加*/
export function userAdd(data) {
    return server.request({
        url:'/user/add/',
        method:'POST',
        data
    })
}
/*用户删除*/
export function userDelete(data) {
    return server.request({
        url:'/user/delete/',
        method:'POST',
        data
    })
}

/*用户编辑*/
export function userEdit(data) {
    return server.request({
        url:'/user/edit/',
        method:'POST',
        data
    })
}

/*获取用户禁启用状态*/
export function getActives(data) {
    return server.request({
        url:'/user/actives/',
        method:'POST',
        data
    });
}


