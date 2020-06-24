<template>
    <div class="infoClass">
        <!--添加一级分类-->
        <el-row>
            <el-col>
                <el-button type="danger" class="intOneBtn" @click="isShow">添加一级分类</el-button>
            </el-col>
        </el-row>
        <!--水平线-->
        <hr class="myhr">
        <!--内容区-->
        <el-row :gutter="38">
            <!--一级/二级分类-->
            <el-col :span="8">
                <div class="leftBox" v-for="firstClass in classData.key" :key="firstClass.id">
                    <h4>{{ firstClass.category_name }}</h4>
                    <div class="iconBtn" @click.prevent="ckIcon(firstClass)">
                        <iconSvg class-name="add" icon-class="add" class="iconClass" v-if="firstClass.isShow"></iconSvg>
                        <iconSvg class-name="subtract" icon-class="subtract" class="iconClass" v-if="!firstClass.isShow"></iconSvg>
                    </div>
                    <!--修改层-->
                    <div class="LevelOne">
                        <div class="shade isHover">
                            <div class="pull-right">
                                <el-button round type="danger" class="editBtn"
                                           @click.prevent="editClass(firstClass.id,firstClass.category_name)">编辑
                                </el-button>
                                <el-button round type="success" class="addChildrenBtn"
                                           @click.prevent="addChildClass(firstClass.id,firstClass.category_name)">
                                    添加子级
                                </el-button>
                                <el-button round class="delBtn" @click.prevent="delClass(firstClass.id)">删除</el-button>
                            </div>
                        </div>
                    </div>
                    <!--二级分类-->
                    <ul v-if="firstClass.children">
                        <li
                            v-show="!firstClass.isShow"
                            :pId="secondClass.parent_id"
                            v-for="secondClass in firstClass.children "
                            :key="secondClass.id">{{
                            secondClass.category_name}}
                            <!--修改层-->
                            <div class="shade isHover">
                                <div class="pull-right">
                                    <el-button round type="danger" class="editBtn"
                                               @click.prevent="editChildClass(secondClass.id,secondClass.category_name,firstClass.category_name)">
                                        编辑
                                    </el-button>
                                    <el-button round class="delBtn" @click.prevent="delClass(secondClass.id)">删除
                                    </el-button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </el-col>
            <!--一级分类编辑-->
            <el-col :span="16">
                <div class="rightBox">
                    <h4>一级分类编辑</h4>
                    <div class="dv" v-if="data.key.firstIsShow">
                        <label>一级分类名称：</label>
                        <el-input v-model="list.firstClass" placeholder="请输入内容"
                                  :disabled="status.firstClass" clearable></el-input>
                    </div>
                    <div class="dv" v-if="data.key.secondIsShow">
                        <label>二级分类名称：</label>
                        <el-input v-model="list.secondClass" placeholder="请输入内容"
                                  :disabled="status.secondClass" clearable></el-input>
                    </div>
                    <el-button type="danger" class="sureBtn" @click="mySumit" :loading="status.btnLoading"
                               :disabled="status.btnDisabled">确定
                    </el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {ref, reactive, onMounted, watch} from "@vue/composition-api";
    //引入全局弹窗方法
    import {mydialgFn} from "@/tools/dialog";
    //引入全局公用接口方法
    import {commonApi} from "../../api/commonApi";
    //引入use接口
    import {addFirstCategory, deleteCategory, editCategory, addChildrenCategory} from "@/api/new"

    export default {
        name: "InfoClas",
        setup(props, {root, refs}) {
            //调用弹窗方法
            const {DelFn} = mydialgFn();
            //调用公用接口
            const {readerCategory, readerData} = commonApi();
            //部分数据
            const data = reactive({
                key: {
                    //判断一级/二级分类名称隐藏/显示
                    firstIsShow: true,
                    secondIsShow: true,
                    //设置确定的类型对应不同的接口
                    type: '',
                    //存储当前被选中的数据
                    clickNowDate: {
                        id: '',
                        category_name: '',
                    },
                    liIsShow:true,

                }
            });
            //编辑的表单数据
            const list = reactive({
                    firstClass: '',
                    secondClass: ''
            });
            //表单控件的状态
            const status = reactive({
                btnLoading: false,
                btnDisabled: true,
                firstClass: true,
                secondClass: true,
            });
            //点击icon图标事件
            const ckIcon = (item) => {
                //当前对象中不存在isShow属性
                if (!item.isShow){
                    //用$set 添加这个属性设置值为false
                    root.$set(item,'isShow',false);
                    //切换isShow这个属性值
                    item.isShow=!item.isShow;
                }else{
                    //当前对象中存在isShow属性
                    //切换isShow这个属性值
                    item.isShow=!item.isShow;
                }
            };
            //信息分类动态数据
            const classData = reactive({key: []});
            //生命周期函数----挂载完成
            onMounted(() => {
                /*方式一: 调用vue3.0全局方法*/
                readerCategory();
            });
            //监听一级分类接口的数据
            watch([
                    () => list.firstClass,
                    () => readerData.key,
                ],
                ([val1,val2]) => {
                    data.key.clickNowDate.category_name = val1;
                    classData.key = val2;
                });
            watch([
                    () => list.secondClass,
                ],
                ([val1]) => {
                    data.key.clickNowDate.category_name = val1;
                });

            //点击添加一级分类按钮
            const isShow = () => {
                //清空输入框
                clearFrom();
                data.key.secondIsShow = false;
                status.firstClass = false;
                status.btnDisabled = false;
                data.key.type = '添加一级分类'
            };
            //调用点击添加一级分类接口
            const addClass = () => {
                //调用 添加一级分类的接口
                //请求的数据
                let request = {
                    categoryName: list.firstClass
                };
                //请求中
                status.btnLoading = true;
                //调用接口
                addFirstCategory(request).then(response => {
                    let data = response.data;
                    if (data.resCode === 0) {
                        root.$message({
                            message: data.message,
                            type: 'success'
                        });
                        //添加到动态数据里
                        classData.key.push(data.data);
                    }
                    //清空输入框
                    clearFrom();
                    //加载结束
                    status.btnLoading = false;
                }).catch(err => {
                    console.log(err);
                    //加载结束
                    status.btnLoading = false;
                })
            };
            //点击删除一级分类按钮+调用接口
            const delClass = (id) => {
                DelFn('确定删除此分类?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }, function () {
                    let req = {
                        categoryId: id
                    };
                    deleteCategory(req).then(rep => {
                        /* console.log(rep);*/
                        root.$message({
                            message: rep.data.message,
                            type: 'success'
                        });
                        /*//刷新页面
                        root.$router.go(0);*/
                        /*let inx = classData.key.findIndex((val) => val.id == id);
                        classData.key.splice(inx, 1);*/
                        readerCategory();
                        clearFrom();
                    });

                }, function () {
                    root.$message('已经取消删除');
                });
            };
            //点击编辑一级分类按钮
            const editClass = (id, name) => {
                list.firstClass = name;
                data.key.secondIsShow = false;
                status.firstClass = false;
                status.secondClass = true;
                status.btnDisabled = false;
                data.key.type = '编辑一级分类';
                data.key.clickNowDate.id = id;
                data.key.clickNowDate.category_name = list.firstClass;
            };
            //调用编辑分类接口
            const editFirstClass = () => {
                let req = {
                    id: data.key.clickNowDate.id,
                    categoryName: data.key.clickNowDate.category_name,
                };
                /* console.log(req);*/
                editCategory(req).then(res => {
                    let resData = res.data;
                    /* console.log(resData);*/
                    root.$message({
                        message: resData.message,
                        type: 'success'
                    });
                    /* /!*过滤渲染数中id相等的的值,然后将源数据的标题重新修改*!/
                     let filterdata = classData.key.filter(val => data.key.clickNowDate.id == val.id);
                     filterdata[0].category_name = resData.data.data.categoryName;*/
                    readerCategory();
                    clearFrom();
                }).catch(err => {
                    console.log(err);
                })
            };
            //点击添加二级分类按钮
            const addChildClass = (id, name) => {
                //清空输入框
                list.secondClass = '';
                list.firstClass = name;
                data.key.secondIsShow = true;
                status.firstClass = true;
                status.secondClass = false;
                status.btnDisabled = false;
                data.key.type = '添加二级分类';
                data.key.clickNowDate.id = id;
            };
            //调用添加二级分类接口
            const addChildClassApi = () => {
                let reqData = {
                    categoryName: list.secondClass,
                    parentId: data.key.clickNowDate.id,
                };
                addChildrenCategory(reqData).then(res => {
                    /* console.log(res);*/
                    root.$message({
                        message: res.data.message,
                        type: 'success'
                    });
                    readerCategory();
                    list.secondClass = '';
                }).catch(err => {
                    console.log(err);
                });
            };
            //点击编辑二级分类按钮
            const editChildClass = (id, childName, fatherName) => {
                list.firstClass = fatherName;
                list.secondClass = childName;
                data.key.secondIsShow = true;
                status.firstClass = true;
                status.secondClass = false;
                status.btnDisabled = false;
                data.key.type = '编辑二级分类';
                data.key.clickNowDate.id = id;
                data.key.clickNowDate.category_name = list.secondClass;
            };
            //点击确定按钮
            const mySumit = () => {
                //判断是否为空,
                if (!list.firstClass) {
                    root.$message.error('一级分类不能为空');
                    return
                }
                if (data.key.type.includes('添加一级分类')) {
                    addClass();
                } else if (data.key.type.includes('编辑一级分类')) {
                    editFirstClass();
                } else if (data.key.type.includes('添加二级分类')) {
                    //判断是否为空,
                    if (!list.secondClass) {
                        root.$message.error('二级分类不能为空');
                        return
                    }
                    addChildClassApi();
                } else if (data.key.type.includes('编辑二级分类')) {
                    //判断是否为空,
                    if (!list.secondClass) {
                        root.$message.error('二级分类不能为空');
                        return
                    }
                    editFirstClass();
                }

            };
            //清空表单
            const clearFrom = () => {
                list.firstClass = '';
                list.secondClass = '';
            };
            //重置状态
            const resetStatus = () => {
                status.btnLoading = false;
                status.btnDisabled = true;
                status.firstClas = true;
                status.secondClas = true;
                clearFrom();
            };
            return {
                data,
                classData, list, status,
                isShow, ckIcon, mySumit, resetStatus, clearFrom,
                editClass, delClass, addClass, editFirstClass,
                addChildClass, addChildClassApi, editChildClass
            }
        }

    }
</script>

<style scoped lang="scss">
    .infoClass {
        font-size: 14px;
        color: #344a5f;


        .intOneBtn {
            height: 40px;
            width: 158px;
            font-size: 15px;
            margin-bottom: 59px;
        }


        .myhr {
            position: absolute;
            top: 90px;
            left: 0;
            width: 100%;
            background-color: #e9e9e9;
            height: 1px;
            border: 0;
        }

        .leftBox {
            position: relative;
            /*height: 327px;*/
            .shade {
                display: none;
                @include compatibility(box-sizing, border-box);
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background-color: transparent;
                font-size: 12px;

                .pull-right {
                    margin-right: 28px;

                    ::v-deep button {
                        padding: 0;

                        span {
                            text-align: center;
                        }
                    }

                    .editBtn,
                    .delBtn {
                        width: 54px;
                        height: 28px;
                    }

                    .addChildrenBtn {
                        width: 76px;
                        height: 28px;
                    }

                    .delBtn {

                    }

                }


            }


            .LevelOne {
                width: 475px;
                height: 44px;
                line-height: 44px;

                &:hover {
                    background-color: #f3f3f3;

                    .isHover {
                        display: block;
                    }
                }
            }

            .iconBtn,
            h4 {
                position: absolute;
                top: 20px;
                margin: 0;
                padding: 0;
                @include compatibility(transform, translateY(-50%));
            }

            .iconBtn {
                left: 0;
                z-index: 2;

                .iconClass {
                    margin-left: 14px;
                    width: 13px;
                    height: 13px;
                }
            }

            h4 {
                left: 38px;
            }

            ul {
                @include compatibility(box-sizing, border-box);
                width: 475px;
                line-height: 44px;


                li {
                    @include compatibility(box-sizing, border-box);
                    position: relative;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    padding-left: 60px;

                    &:hover {
                        background-color: #f3f3f3;

                        .isHover {
                            display: block;
                        }
                    }

                    &:after {
                        content: "";
                        position: absolute;
                        top: 50%;
                        left: 24px;
                        border: 1px dashed #344a5f;
                        display: block;
                        width: 33px;
                        @include compatibility(transform, translateY(-50%));

                    }

                    &:before {
                        content: "";
                        position: absolute;
                        border: 1px dashed #344a5f;
                        display: block;
                        top: -17px;
                        left: 20px;
                        height: 70px; //li的个数+1*40
                        z-index: 2;
                    }

                }


            }
        }

        .rightBox {
            > h4 {
                height: 43px;
                line-height: 43px;
                padding-left: 22px;
                background-color: #f3f3f3;
            }

            .dv {
                margin: 25px 0 25px 22px;
                @include labelLayout(120, 40);

                .el-input {
                    width: 265px;
                }
            }

            .sureBtn {
                margin-left: 142px;
            }
        }


    }

</style>