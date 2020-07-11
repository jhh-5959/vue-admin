import {reactive} from "@vue/composition-api";
//导入渲染表格数据的接口
import { readerTableData } from "../../api/commonApi";
//引入 获取api动态参数的方法
import  { getUserListParams } from "../../api/requestParms";
export function readerTable() {
    const tableData=reactive({
        item:[],
        pageTotal:0,
    });

    const getTable = (params) => {
        let reqData = {
            url: getUserListParams[params.url],
            method: params.method,
            data: params.data
        };
       /* console.log(reqData);*/
        readerTableData(reqData).then(res => {
            let resData = res.data.data.data;
           /* console.log(res.data.data);*/
            tableData.item = resData;
            tableData.pageTotal=res.data.data.total;
            /*if (resData && resData.length > 0) {

            }*/
        }).catch(err => {
            console.log(err);
        });

    };

    return {
        getTable,
        tableData
    }
}
