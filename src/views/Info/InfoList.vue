<template>
    <div class="myInfoList">
        <!--筛选器-->
        <el-row :gutter="8">
            <!--类别-->
            <el-col :span="4" class="myEl-col type">
                <label>类别:</label>
                <el-select v-model="typeSelectVal" placeholder="请选择" style="width: 160px" clearable>
                    <el-option
                            v-for="item in typeData.key"
                            :key="item.id"
                            :label="item.category_name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            <!--日期-->
            <el-col :span="8" class="myEl-col data">
                <label>日期:</label>
                <el-date-picker
                        v-model="dateVal"
                        type="datetimerange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        style="width: 400px"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH-mm-ss"
                >
                </el-date-picker>
            </el-col>
            <!--关键字-->
            <el-col :span="3" class="myEl-col keyword">
                <label>关键字:</label>
                <el-select v-model="keyWordVal" placeholder="请选择" style="width:101px">
                    <el-option
                            v-for="item in keyWordOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <!--搜索-->
            <el-col :span="3" class="myEl-col search">
                <el-input v-model="searchVal" placeholder="请输入内容"></el-input>
            </el-col>
            <el-col :span="1" class="myEl-col searchBtn">
                <el-button type="danger" @click="readerTable">搜索</el-button>
            </el-col>
            <!--添加按钮-->
            <el-col :span="5" class="myEl-col addBtn">
                <el-button type="danger" @click="open">添加</el-button>
            </el-col>
        </el-row>
        <!--空白占位-->
        <div class="blank1"></div>
        <!--表格-->
        <el-table
                v-loading="loading"
                :data="tableData.key"
                :cell-style="rowClass"
                :header-cell-style="headClass"
                border
                @selection-change="handleSelectionChange"
                style="width: 100%;">
            <el-table-column
                    width="45"
                    type="selection">
            </el-table-column>
            <el-table-column
                    prop="title"
                    label="标题"
            >
            </el-table-column>
            <el-table-column
                    prop="categoryId"
                    label="类别"
                    width="130"
                    :formatter="toType">
            </el-table-column>
            <el-table-column
                    prop="createDate"
                    label="日期"
                    width="237"
                    :formatter="toDate">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="管理人"
                    width="115">

            </el-table-column>
            <el-table-column
                    label="操作"
                    width="186">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                    <el-button
                            size="mini"
                            type="success"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--空白占位-->
        <div class="blank2"></div>
        <!--批量删除-->
        <el-button plain size="small" @click="AllDelFn">批量删除</el-button>
        <!--分页-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pull-right"
                background>
        </el-pagination>
        <!--添加弹窗子组件-->
        <addDialog :ftc.sync="ftcData"
                   :ftcType="typeData.key"
                   :ftcTitle="titleData"
                   :ftcForm="formDate.key"/><!--@ctf="ctfDataFn"-->
    </div>
</template>

<script>
    //使用vue3.0api
    import {reactive, ref, onMounted, watch} from "@vue/composition-api"
    //引入子组件 addDialog
    import addDialog from "./dialog/addDialog";
    //引入vue3.0的全局方法
    import {mydialgFn} from "../../tools/dialog"
    //引入接口
    import {getList, deleteInfo} from "../../api/new";
    import {isNull} from "../../tools/verification";
    import {timestampToTime} from "../../tools/comm";

    export default {
        name: "Info",
        setup(props, {root}) {
            //声明全局方法
            const {DelFn, AllDel} = mydialgFn();

            //Select选择器(类型)
            const typeData = reactive({key: []});
            const typeSelectVal = ref('');
            //获取分类列表(vuex 获取公共方法)
            const getType = () => {
                root.$store.dispatch('comm/readerClass').then(res => {
                    typeData.key = res;
                    /*console.log(typeData.key);*/
                }).catch(err => {
                    console.log(err);
                })
            };

            //Select选择器(关键字)
            const keyWordOptions = reactive([{
                value: 1,
                label: 'ID'
            }, {
                value: 2,
                label: '标题'
            }]);
            const keyWordVal = ref(2);

            //日期
            const pickerOptions = reactive({
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            });
            const dateVal = ref([]);

            //搜索栏
            const searchVal = ref('');
            const searchInfo = () => {
                let req = {
                    pageNumber: currentPage.value,
                    pageSize: pageSize.value,
                };
                /*类别*/
                if (typeSelectVal.value) {
                    req.categoryId = Number(typeSelectVal.value)
                }
                /*日期*/
                if (dateVal.value.length > 0) {
                    req.startTiem = dateVal.value[0];
                    req.endTime = dateVal.value[1];
                }
                /*搜索关键字*/
                if (searchVal.value) {
                    req.title = searchVal.value
                }
                return req;
            };

            //表格
            const loading = ref(false);
            const tableData = reactive({key: []});
            const multipleSelection = reactive({key: []});
            const handleSelectionChange = (val) => {
                multipleSelection.key = val;
            };
            const idArray = reactive([]);
            //---配合 :formatter 属性 转化格式的方法
            const toDate = (row) => {
                return timestampToTime(row.createDate)
            };
            const toType = (row) => {
                /*console.log(row.categoryId);
                console.log(typeData.key);*/
                let name = typeData.key.filter(value => value.id === row.categoryId)[0].category_name;
                return name;
            };
            //----编辑按钮
            const formDate=reactive({key:{}});
            const titleData = ref('');
            const handleEdit = (index, row) => {
                /*console.log(index, row);*/
                titleData.value = '编辑:';
                ftcData.value = true;
                formDate.key=row;
            };
            //----单个删除按钮
            const handleDelete = (index, row) => {
                /* console.log(index, row);*/
                //单个删除方法
                DelFn('确定删除此消息', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }, function () {
                    //验证是否选中
                    if (!isNull(multipleSelection.key, '未选中当前行')) {
                        return
                    }
                    if (row.id !== multipleSelection.key[0].id || multipleSelection.key.length !== 1) {
                        root.$message.error('未选中当前对应的行');
                        return;
                    }
                    //将选择中的id 加入到 数组中
                    idArray.push(row.id);
                    let req = {
                        id: idArray
                    };
                    //调用删除接口
                    delInfoApi(req);
                }, function () {
                    root.$message({
                        type: "success",
                        message: '取消删除'
                    })
                });
            };
            //批量删除按钮
            const AllDelFn = () => {
                if (!isNull(multipleSelection.key, '未选中行')) {
                    return
                }
                DelFn('确定要删除选中行', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }, function () {
                    //将选择中的id 加入到 数组中
                    multipleSelection.key.forEach(value => {
                        idArray.push(value.id);
                    });
                    let req = {
                        id: idArray
                    };
                    delInfoApi(req);
                }, function () {
                    root.$message({
                        type: "success",
                        message: '取消删除'
                    })
                });
            };
            //调用删除信息的接口
            const delInfoApi = (req) => {
                deleteInfo(req).then(res => {
                    let resData = res.data;
                    /* console.log(resData.data.data);*/
                    root.$message({
                        type: 'success',
                        message: resData.message
                    });
                    /*  console.log(tableData.key);*/

                    //过滤单个id
                    /* tableData.key=tableData.key.filter((val)=>val.id!=resData.data.data[0]);*/

                    //不调用接口渲染页面(filter+some)
                    /*tableData.key=tableData.key.filter(filterVal=>!resData.data.data.some(someVal=>someVal===filterVal.id));
                    idArray.length=0;*/

                    //用接口渲染页面
                    readerTable();
                }).catch(err => {
                    root.$message.error('删除失败');
                });
            };
            //调用接口渲染表格数据
            const readerTable = () => {
                let req = searchInfo();
                loading.value = true;
                getList(req).then(res => {
                    /*console.log(res.data.data);*/
                    let data = res.data.data;
                    tableData.key = data.data;
                    total.value = data.total;
                    loading.value = false;
                }).catch(err => {
                    loading.value = false;
                    console.log(err);
                })
            };
            // 表头样式设置
            const headClass = () => {
                return 'text-align: center;'
            };
            // 表格样式设置
            const rowClass = () => {
                return 'text-align: center;'
            };

            //添加按钮
            const ftcData = ref(false);
            const open = () => {
                titleData.value = '新增:';
                ftcData.value = true;
            };
            /*const ctfDataFn=(ctfData)=>{
                ftcData.value=ctfData;
            };*/

            //分页数据
            const total = ref(40);
            const currentPage = ref(1);
            const pageSize = ref(10);
            const handleSizeChange = (val) => {
                console.log(`每页 ${val} 条`);
                pageSize.value = val;

            };
            const handleCurrentChange = (val) => {
                console.log(`当前页: ${val}`);
                currentPage.value = val;
            };
            //挂载完成后
            onMounted(() => {
                //获取类型的数据
                getType();
                //获取表格数据，并且渲染
                readerTable();

            });

            //监听分页的改变渲染页面
            watch([
                () => currentPage.value,
                () => pageSize.value,
            ], ([val1, val2]) => {
                readerTable();
            });

            return {
                //Select选择器(类型+关键字)
                getType,
                typeData,
                typeSelectVal,
                keyWordOptions,
                keyWordVal,
                //日期
                pickerOptions,
                dateVal,
                //搜索栏
                searchInfo,
                searchVal,
                //表格
                multipleSelection,
                tableData,
                idArray,
                titleData,
                loading,
                formDate,
                handleSelectionChange,
                handleEdit,
                handleDelete,
                delInfoApi,
                headClass,
                rowClass,
                readerTable,
                toDate,
                toType,
                //添加按钮
                ftcData,
                open, /*ctfDataFn*/
                //全部删除按钮
                AllDelFn,
                //分页
                handleSizeChange,
                handleCurrentChange,
                total,
                currentPage,
                pageSize,
            }
        },
        components: {
            addDialog
        },
        onMounted({root}) {
            root.SearchList = root.SearchStates.map(item => {
                console.log(123);
                return {value: `value:${item}`, label: `label:${item}`};
            })
        },


    }
</script>

<style scoped lang="scss">
    .myInfoList {
        /*overflow:scroll;*/
        .blank1 {
            height: 10px;
        }

        .blank2 {
            height: 30px;
        }

        .myEl-col {
            &.type {
                @include labelLayout(60, 38);
            }

            &.data {
                @include labelLayout(60, 38);
            }

            &.keyword {
                @include labelLayout(70, 38);

            }

            &.searchBtn,
            &.addBtn {
                height: 40px;
                width: 98px;

                .el-button {
                    padding: 0 !important;
                }

                button {
                    height: 100% !important;
                    width: 100%;

                    /deep/ > span {
                        font-size: 15px;
                    }
                }

            }

            &.addBtn {
                width: 208px;
                float: right;
            }

        }


        .el-row {
            margin-bottom: 20px;

            &:last-child {
                margin-bottom: 0;
            }
        }

        .el-col {
            border-radius: 4px;
        }

        .bg-purple-dark {
            background: #99a9bf;
        }

        .bg-purple {
            background: #d3dce6;
        }

        .bg-purple-light {
            background: #e5e9f2;
        }

        .grid-content {
            border-radius: 4px;
            min-height: 36px;
        }

        .row-bg {
            padding: 10px 0;
            background-color: #f9fafc;
        }

        ::v-deep .el-button--primary {
            background-color: $main-bgc !important;
        }
    }

</style>