<template>
    <div>
        <el-row :gutter="8">
            <!--关键字-->
            <el-col :span="3">
                <keyWordSelect :ftcSelectConfig="selectConfig"
                               :ftcNowSelect.sync="data.nowSelect"/>
            </el-col>
            <!--搜索框-->
            <el-col :span="3" class="myEl-col search">
                <el-input v-model="data.key.searchVal" placeholder="请输入内容"></el-input>
            </el-col>
            <el-col :span="1" class="myEl-col searchBtn">
                <el-button type="danger" @click="handleSearch">搜索</el-button>
            </el-col>
            <!--新增按钮-->
            <el-col :span="5" class="myEl-col addBtn">
                <el-button type="danger" @click="open">添加用户</el-button>
            </el-col>
        </el-row>
        <!--空白占位-->
        <div class="blank1"></div>
        <!--表格-->
        <tableVue ref="ctfReaderTable"
                  :ftcTableConfig="tableConfig"
                  :ftcUpdateData.sync="data.key.updateObject">
            <!--switchSlot插槽-->
            <template v-slot:switchSlot="slotData">
                <el-switch
                        @change="handleActive(slotData.slotData)"
                        v-model="slotData.slotData.status"
                        active-value="2"
                        inactive-value="1"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                </el-switch>
            </template>
            <!--optionSlot插槽-->
            <template v-slot:optionSlot="slotData">
                <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(slotData.slotData)">删除
                </el-button>
                <el-button
                        size="mini"
                        type="success"
                        @click="handleEdit(slotData.slotData)">编辑
                </el-button>
            </template>
            <!---->
        </tableVue>
        <!--批量删除-->
        <el-button plain size="small" @click="AllDelFn">批量删除</el-button>
        <!--弹窗子组件-->
        <UseraddDialog
                :ftc.sync="data.key.ftcData"
                :ftcSelect.sync="data.ftcSelect"
        /><!--@ctf="ctfFn"-->
    </div>
</template>

<script>
    //使用vue3.0api
    import {reactive, ref, watch} from "@vue/composition-api"
    //引入子组件 addDialog,
    import UseraddDialog from "./dialog/UseraddDialog"
    //引入子组件 关键字
    import keyWordSelect from "@/components/keyWordSelect"
    //引入子组件 表格
    import tableVue from "@/components/table"
    //引入vue3.0的全局方法
    import {mydialgFn} from "../../tools/dialog"
    //调用user API接口
    import {userDelete, getActives, getUserBtnPower} from "../../api/user";

    export default {
        name: "UserLIst",
        setup(props, {root, refs}) {
            //声明全局方法
            const {DelFn} = mydialgFn();
            //所有数据
            const data = reactive({
                key: {
                    //搜索
                    searchVal: '',
                    //新增按钮开关
                    ftcData: false,
                    //获取子组件传递的数据
                    updateObject: {}
                },
                //数据传输给弹窗子组件
                ftcSelect: {},
                //节流阀
                handleActiveStatus: true,
                //当前选中的值,由子组件keyWordSelect 回传
                nowSelect: {}
            });
            //关键字的相关配置
            const selectConfig = reactive({
                //---下拉选项
                options: ['phone', 'truename', 'username'],
                //---默认选中的关键字
                selectVal: 'truename'
            });
            //表格的相关配置
            const tableConfig = reactive({
                //表头
                tHead: [
                    {label: '邮箱/用户名', prop: 'username'},
                    {label: '真实姓名', prop: 'truename', width: "204"},
                    {label: '手机号码', prop: 'phone', width: "240"},
                    {label: '地区', prop: 'region', width: "200"},
                    {label: '系统', prop: 'role', width: "238"},
                    {label: '禁启用状态', width: "110", type: 'slot', slotName: 'switchSlot'},
                    {label: '操作', width: "186", type: 'slot', slotName: 'optionSlot'},
                ],
                //是否需要选中框
                isSelect: true,
                //渲染页面传入的接口参数
                apiParams: {
                    url: "getUserList",
                    method: 'post',
                    data: {
                        username: "",
                        truename: "",
                        phone: "",
                        /*//分页功能的相关配置(已配置无效)
                        pageNumber: 1,
                        pageSize: 100,*/
                    }
                },
                //分页功能的相关配置
                pageSizes: [3, 5, 7, 9],
                currentPage: 1,
                pageSize: 3,
            });

            //点击添加按钮
            const open = () => {
                data.key.ftcData = true;
                data.ftcSelect.type = '新增';
            };
            //---编辑
            const handleEdit = (row) => {
                /*console.log('row-----------');
                console.log(row);*/
                data.key.ftcData = true;
                data.ftcSelect = Object.assign({}, row);
                data.ftcSelect.type = '编辑';
                getBtnPower.then(res=>data.ftcSelect.btnPowers=res.data.data);
            };
            //调用获取所有按钮用户权限
            const getBtnPower = new Promise((resolve)=>{
                getUserBtnPower().then(res=> resolve(res));
            });

            //---单个删除
            const handleDelete = (row) => {
                //单个删除方法
                DelFn('确定删除此消息', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }, () => {
                    delApi({id: [row.id]});
                }, () => {
                    root.$message({
                        type: 'success',
                        message: '取消删除',
                    })
                });
            };
            //批量删除方法
            const AllDelFn = () => {
                let updateObject = data.key.updateObject;
                if (!updateObject.id || !updateObject.id.length) {
                    root.$message.error('请勾选对应的选择框');
                    return false
                }
                DelFn('确定要全部删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }, () => {
                    let resData = {id: updateObject.id};
                    delApi(resData);
                }, () => {
                    root.$message({
                        type: 'success',
                        message: '取消删除',
                    })
                });
            };
            /*//子组件给父组件传值所调用的方法
            const ctfFn=(val)=>{
                ftcData.value=val;
            };*/
            //改变用户禁启用状态
            const handleActive = (slotData) => {
                //节流阀
                if (data.handleActiveStatus) {
                    data.handleActiveStatus = false;
                    getActives({id: slotData.id, status: slotData.status})
                        .then(res => {
                            root.$message({
                                type: 'success',
                                message: res.data.message
                            });
                            data.handleActiveStatus = true;
                        })
                        .catch(err => {
                            console.log(err);
                            data.handleActiveStatus = true;
                        });
                }


            };

            //调用删除接口
            const delApi = (resData) => {
                //调用删除接口
                userDelete(resData)
                    .then(res => {
                        /* console.log(res.data);*/
                        root.$message({
                            type: 'success',
                            message: res.data.message,
                        });
                        readerTableDate();
                    })
                    .catch(err => console.log(err));
            };
            //调用子组件中刷新页面方法
            const readerTableDate = () => {
                refs.ctfReaderTable.initReaderTable();
            };
            //搜索按钮
            const handleSearch = () => {
                // 合并 关键字和搜索内容
                let resData = {};
                for (let key in data.nowSelect) {
                    resData[key] = data.key.searchVal;
                }
                refs.ctfReaderTable.searchTable(resData);
                /*console.log(data.nowSelect);
                console.log(data.key.searchVal);*/
                data.key.searchVal = '';

            };



            return {
                data, selectConfig, tableConfig,
                //添加按钮
                open,
                //全部删除按钮
                AllDelFn, delApi,
                /*//子组件给父组件传值
                ctfFn*/
                //分页
                handleEdit, handleDelete,
                //调用子组件中刷新页面方法
                readerTableDate,
                //改变用户禁启用状态
                handleActive,
                //搜索按钮
                handleSearch,
                getBtnPower,
            }
        },
        components: {
            UseraddDialog,
            keyWordSelect,
            tableVue
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