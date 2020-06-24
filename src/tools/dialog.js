/*注册全局方法*/
/*
//2.0写法
export default {
    install(Vue,options){
        Vue.prototype.myremove=function () {
            console.log(2222)
        }
    }
}*/
//3.0写法
import {MessageBox} from 'element-ui';
/**
 *
 * @returns {{DelFn: *}}
 *
 *
 *模板
 * DelFn('确定删除此消息','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                });
 */

export function mydialgFn() {
    //单个删除
    const DelFn = (mes, title, optionsObj,sure,cancel) => {
        MessageBox.confirm(mes, title, optionsObj).then(() => {

            sure&&sure();
        }).catch(() => {

            cancel&&cancel();
        });
    };

    return {
        DelFn,
    }

}
