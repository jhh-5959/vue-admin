import server from '@/tools/interceptor';
/*获取验证码*/
export function postCodeApi(data) {
    // 发送 POST 请求
    return server.request({
        method: 'post',
        url: '/getSms/',
        data
        /*键名 和 参数名一样 可以简写成一个名字*/
    });

}

/*登录接口*/
export function postLoginApi(data) {
    return server.request({
        method: 'post',
        url:'/login/',
        data
    })
}
/*登录接口*/
export function postLogoutApi(data) {
    return server.request({
        method: 'post',
        url:'/logout/',
        data
    })
}


/*注册接口*/
export function postRegisterApi(data) {
    return server.request({
        method: 'post',
        url:'/register/',
        data
    })
}






