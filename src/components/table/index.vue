<template>
    <div>
        <el-table
                :data="data.tableConfig.tableData"
                :cell-style="rowClass"
                :header-cell-style="headClass"
                border
                @selection-change="handleSelectionChange"
                style="width: 100%;">
            <!--多选框-->
            <el-table-column v-if="data.tableConfig.isSelect" type="selection" width="45"></el-table-column>
            <template v-for="item in data.tableConfig.tHead">
                <!--普通的页面-->
                <el-table-column
                        v-if="!item.type"
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label"
                        :width="item.width">
                </el-table-column>
                <!--插槽-->
                <el-table-column
                        v-else-if="item.type==='slot'"
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label"
                        :width="item.width">
                    <template slot-scope="scope">
                        <slot :name="item.slotName" :slotData="scope.row"></slot>
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <!--分页-->
        <div style="height: 30px"></div>
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="data.tableConfig.currentPage"
                :page-sizes="data.tableConfig.pageSizes"
                :page-size="data.tableConfig.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="data.tableConfig.total"
                style="float: right">
        </el-pagination>
    </div>
</template>

<script>
    import {reactive, onBeforeMount, watch} from "@vue/composition-api"
    // 引入 vue3.0方法 渲染表格功能
    import {readerTable} from "./readerTable";
    //引入 vue3.0方法 翻页功能
    import { pageTurning } from "./pageTurning";

    export default {
        name: "tableVue",
        props: {
            ftcTableConfig: {
                type: Object,
            },
            ftcUpdateData:{
                type: Object,
                default:()=>{}
            }
        },
        setup(props, {emit}) {
            //渲染页面功能
            const {getTable, tableData} = readerTable();
            //翻页功能
            const { handleSizeChange,handleCurrentChange,pageData }= pageTurning();
            //数据集合
            const data = reactive({
                tableConfig: {
                    tHead: [],
                    tableData: [],
                    isSelect: true,
                    apiParams: {},
                    pageSizes:[],
                    currentPage:pageData.currentPage,
                    pageSize:pageData.pageSize,
                },
            });
            //选择框
            const handleSelectionChange = (val) => {
                let resData={
                    id:val.map((item)=>item.id),
                    data:val
                };
                emit('update:ftcUpdateData',resData);
            };
            // 表头样式设置
            const headClass = () => {
                return 'text-align: center;'
            };
            // 表格样式设置
            const rowClass = () => {
                return 'text-align: center;'
            };
            //获取参数渲染用
            const getParamas=()=>{
                let params=data.tableConfig.apiParams;
                let tabConfig=data.tableConfig;
                //翻页
                params.data.pageNumber=tabConfig.currentPage;
                params.data.pageSize=tabConfig.pageSize;
                //翻页
                handleSizeChange(tabConfig.pageSize);
                handleCurrentChange(tabConfig.currentPage);
                return params
            };

            //初始渲染页面
            const initReaderTable=()=>{
                let params=getParamas();
                /*console.log(params.data);*/
               /* console.log(params);*/
                getTable(params);
            };
            //搜索刷新页面
            const searchTable=(resData)=>{
                let paramsData=Object.assign({},getParamas().data,resData);
                /*console.log(paramsData);*/
                let res={
                    url:data.tableConfig.apiParams['url'],
                    method:data.tableConfig.apiParams['method'],
                    data:paramsData
                };

                getTable(res);
            };

            //匹配传输的规则
            onBeforeMount(() => {
                let ftcDate = props.ftcTableConfig;
                //组件内有的所有key值
                let keys = Object.keys(data.tableConfig);
                //浅拷贝
                for (let key in ftcDate) {
                    if (keys.includes(key)) {
                        data.tableConfig[key] = ftcDate[key];
                    }
                }
                initReaderTable();
            });
            //父组件传入子组件的值(用来匹配规则)
            watch(() => props.ftcTableConfig, (val) => props.ftcTableConfig = val);
            /*console.log(props.ftcTableConfig);*/

            //监听渲染表格功能(业务逻辑拆分)
            watch([
                () => tableData.item,
                () => tableData.pageTotal,
            ], ([val1,val2]) => {
                data.tableConfig.tableData = val1;
                data.tableConfig.total = val2;
            });

            //监听翻页功能(业务逻辑拆分)
            watch([
                ()=>pageData.currentPage,
                ()=>pageData.pageSize,
            ],([va1,va2])=>{
                data.tableConfig.currentPage=va1;
                data.tableConfig.pageSize=va2;
                //监听翻页修改api参数(业务逻辑拆分)
                data.tableConfig.apiParams.data['pageNumber']=data.tableConfig.currentPage;
                data.tableConfig.apiParams.data['pageSize']=data.tableConfig.pageSize;
                let params=data.tableConfig.apiParams;
                /*console.log(params);*/
                getTable(params);
            });
            return {
                data,
                handleSelectionChange, headClass, rowClass,initReaderTable,searchTable,
                //翻页
                handleSizeChange,handleCurrentChange
            }
        }
    }
</script>

<style scoped>

</style>


<!--
1.组件的文件位置  src->components->table

2.引用 import tableVue from "@/components/table"

3.模板 <tableVue :ftcTableConfig="tableConfig"/>

4.配置： tableConfig:{ Object }

4.1参数：

//表头
tHead:{ Array },
//表格内容数据
tableData:{ Array }
//是否需要选中框
isSelect:{ Boolean },





-->