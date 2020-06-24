<template>
    <div>
        <el-row :gutter="8">
            <!--关键字-->
            <el-col :span="3" class="myEl-col keyword">
                <label>关键字:</label>
                <el-select v-model="data.key.keyWordVal" placeholder="请选择" style="width:101px" clearable>
                    <el-option
                            v-for="item in data.key.keyWordOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <!--搜索框-->
            <el-col :span="3" class="myEl-col search">
                <el-input v-model="data.key.searchVal" placeholder="请输入内容" ></el-input>
            </el-col>
            <el-col :span="1" class="myEl-col searchBtn">
                <el-button type="danger">搜索</el-button>
            </el-col>
            <!--新增按钮-->
            <el-col :span="5" class="myEl-col addBtn">
                <el-button type="danger" @click="open">新增</el-button>
            </el-col>
        </el-row>
        <!--空白占位-->
        <div class="blank1"></div>
        <!--表格-->
        <el-table
                :data="data.key.tableData"
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
                    prop="userName"
                    label="邮箱/用户名"
            >
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="真实姓名"
                    width="204">
            </el-table-column>
            <el-table-column
                    prop="tel"
                    label="手机号码"
                    width="240">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="地区"
                    width="200">

            </el-table-column>
            <el-table-column
                    prop="role"
                    label="角色"
                    width="238">
            </el-table-column>
            <el-table-column
                    label="禁启用状态"
                    width="110">
                <template slot-scope="scope">
                    <el-switch
                            v-model="data.key.statusValue"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                    </el-switch>
                </template>
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
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="data.key.currentPage"
                :page-sizes="data.key.pageSizes"
                :page-size="data.key.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="data.key.total"
                style="float: right">
        </el-pagination>
        <!--添加弹窗子组件-->
        <UseraddDialog :ftc.sync="data.key.ftcData" /><!--@ctf="ctfFn"-->
    </div>
</template>

<script>
    //使用vue3.0api
    import {reactive, ref} from "@vue/composition-api"
    //引入子组件 addDialog
    import UseraddDialog from "./dialog/UseraddDialog";
    //引入vue3.0的全局方法
    import {mydialgFn} from "../../tools/dialog"
    export default {
        name: "UserLIst",
        setup(props, {root}) {
            //声明全局方法
            const {DelFn} = mydialgFn();
            //所有数据
            const data=reactive({key:{
                //Select选择器(关键字)
                   keyWordOptions: [{
                       value: 1,
                       label: '手机号'
                   }, {
                       value: 2,
                       label: '姓名'
                   }],
                    keyWordVal:'',
                    //搜索
                    searchVal:'',
                    //表格
                    tableData:[{
                        userName: '409019683@qq.com',
                        name: '张三',
                        tel: 13588888888,
                        address: '广东省 深圳市 南山区',
                        role:'超管'
                    },{
                        userName: '409019683@qq.com',
                        name: '张三',
                        tel: 13588888888,
                        address: '广东省 深圳市 南山区',
                        role:'信息管理'
                    },{
                        userName: '409019683@qq.com',
                        name: '张三',
                        tel: 13588888888,
                        address: '广东省 深圳市 南山区',
                        role:'用户管理'
                    },{
                        userName: '409019683@qq.com',
                        name: '张三',
                        tel: 13588888888,
                        address: '广东省 深圳市 南山区',
                        role:'信息管理'
                    }],
                    //分页
                    currentPage:1,
                    pageSizes:[10, 20, 30, 40],
                    pageSize:10,
                    total:100,
                    //新增按钮开关
                    ftcData:false,
                    //权限状态
                    statusValue:true,
                    //选择框
                    multipleSelection:[]

                }});
            //表格中方法
            const handleSelectionChange = (val) => {
                data.key.multipleSelection = val;
            };
            const handleEdit = (index, row) => {
                console.log(index, row);
                open();
            };
            const handleDelete = (index, row) => {
                console.log(index, row);
                //单个删除方法
                DelFn('确定删除此消息','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                });
            };
            // 表头样式设置
            const headClass = () => {
                return 'text-align: center;'
            };
            // 表格样式设置
            const rowClass = () => {
                return 'text-align: center;'
            };
            //新增按钮
            const open = () => {
                data.key.ftcData=true;
            };
            //全部删除方法
            const AllDelFn=()=>{
                DelFn('确定要全部删除','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                },function () {
                    console.log(123);
                });
            };
            /*//子组件给父组件传值所调用的方法
            const ctfFn=(val)=>{
                ftcData.value=val;
            };*/
            //分页
            const handleSizeChange=(val)=>{
                console.log(`每页 ${val} 条`);
            };
            const handleCurrentChange=(val)=> {
                console.log(`当前页: ${val}`);
            };
            return {
                data,
                //表格
                handleSelectionChange, handleEdit, handleDelete, headClass, rowClass,
                //添加按钮
                open,
                //全部删除按钮
                AllDelFn,
                /*//子组件给父组件传值
                ctfFn*/
                //分页
                handleSizeChange,handleCurrentChange
            }
        },
        components: {
            UseraddDialog
        },
        onMounted() {
        },
    }
</script>

<style scoped lang="scss">
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
            width: 98px;
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
</style>