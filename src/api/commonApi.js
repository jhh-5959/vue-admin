import { getCategoryAll } from "./new"
import {reactive} from "@vue/composition-api";
import server from '@/tools/interceptor';
//创建公共方法 方式1: vue3.0
export function commonApi() {
    //声明一个变量存放数据
    const readerData=reactive({
        key:[]
    });
    const readerCategory=()=>{
        getCategoryAll({}).then(response => {
            let data = response.data;
            /* console.log(data);*/
            //渲染信息分类
             readerData.key=data.data;
            /*console.log(readerData.key);*/
        }).catch(err => {
                console.log(err);
            }
        );
    };
    return{
        readerCategory,
        readerData
    }
}

/*获取七牛云toKen*/
export function uploadImgToken(data) {
    return server.request({
        url:'/uploadImgToken/',
        method:'post',
        data
    });
}