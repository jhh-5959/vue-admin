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
                    <div class="iconBtn" @click.prevent="ck">
                        <iconSvg class-name="add" icon-class="add" class="iconClass"></iconSvg>
                    </div>
                    <!--修改层-->
                    <div class="LevelOne">
                        <div class="shade isHover">
                            <div class="pull-right">
                                <el-button round type="danger" class="editBtn"
                                           @click.prevent="editClass(firstClass.id,firstClass.category_name)">编辑
                                </el-button>
                                <el-button round type="success" class="addChildrenBtn" @click.prevent="">添加子级
                                </el-button>
                                <el-button round class="delBtn" @click.prevent="delClass(firstClass.id)">删除</el-button>
                            </div>
                        </div>
                    </div>
                    <!--二级分类-->
                    <ul v-if="firstClass.children">
                        <li v-for="secondClass in firstClass.children " :key="secondClass.id">{{
                            secondClass.category_name}}
                            <!--修改层-->
                            <div class="shade isHover">
                                <div class="pull-right">
                                    <el-button round type="danger" class="editBtn">编辑</el-button>
                                    <el-button round class="delBtn" @click.prevent="delClass">删除</el-button>
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
                    <div class="dv" v-if="firstIsShow">
                        <label>一级分类名称：</label>
                        <el-input v-model="list.firstClass" placeholder="请输入内容"
                                  :disabled="status.firstClass"></el-input>
                    </div>
                    <div class="dv" v-if="secondIsShow">
                        <label>二级分类名称：</label>
                        <el-input v-model="list.secondClass" placeholder="请输入内容"
                                  :disabled="status.secondClass"></el-input>
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
    import {addFirstCategory, getCategoryAll, deleteCategory, editCategory} from "@/api/new"

    export default {
        name: "InfoClas",
        setup(props, {root, refs}) {
            //调用弹窗方法
            const {DelFn} = mydialgFn();
            //调用公用接口
            const {readerCategory, readerData} = commonApi();

            //测试点击事件
            const ck = () => {
                console.log(123);
            };
            //编辑的表单数据
            const list = reactive({
                firstClass: '',
                secondClass: ''
            });
            //判断一级/二级分类名称隐藏/显示
            const firstIsShow = ref(true);
            const secondIsShow = ref(true);
            //是否显示&&打开一级分类状态
            const isShow = () => {
                secondIsShow.value = !secondIsShow.value;
                status.firstClass = false;
                status.btnDisabled = false;
                type.value = '添加一级分类'
            };
            //表单控件的状态
            const status = reactive({
                btnLoading: false,
                btnDisabled: true,
                firstClass: true,
                secondClass: true,
            });
            //设置确定的类型对应不同的接口
            const type = ref('');
            //存储当前被选中的数据
            const clickNowDate = reactive({
                id: '',
                category_name: '',
            });
            //信息分类动态数据
            const classData = reactive({key: []});

            /*//调用渲染信息分类数据的接口(未封装成公用方法之前)
            const readerCategory = () => {
                //调用接口
                getCategoryAll({}).then(response => {
                    let data = response.data;
                    /!* console.log(data);*!/
                    //渲染信息分类
                    classData.key = data.data;
                    /!* console.log(classData.key);*!/
                }).catch(err => {
                        console.log(err);
                    }
                );
            };*/
            //生命周期函数----挂载完成
            onMounted(() => {
                /*方式一: 调用vue3.0全局方法*/
                readerCategory();
            });

            //添加一级分类+调用接口
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
                    list.firstClass = '';
                    //加载结束
                    status.btnLoading = false;
                }).catch(err => {
                    console.log(err);
                    //加载结束
                    status.btnLoading = false;
                })
            };
            //删除一级分类+调用接口
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
                        let inx = classData.key.findIndex((val) => val.id == id);
                        classData.key.splice(inx, 1);

                    });

                }, function () {
                    root.$message('已经取消删除');
                });
            };
            //编辑一级分类
            const editClass = (id, name) => {
                list.firstClass = name;
                status.firstClass = false;
                status.btnDisabled = false;
                type.value = '编辑一级分类';
                clickNowDate.id = id;
            };
            //监听一级分类接口的数据
            watch([
                    () => list.firstClass,
                    () => readerData.key
                ],
                ([val1, val2]) => {
                    clickNowDate.category_name = val1;
                    classData.key=val2;
                });
            //调用编辑一级分类接口
            const editFirstClass = () => {
                let req = {
                    id: clickNowDate.id,
                    categoryName: clickNowDate.category_name,
                };
                console.log(req);
                editCategory(req).then(res => {
                    let resData = res.data;
                    console.log(resData);
                    root.$message({
                        message: resData.message,
                        type: 'success'
                    });
                    /*过滤渲染数中id相等的的值,然后将源数据的标题重新修改*/
                    let filterdata = classData.key.filter(val => clickNowDate.id == val.id);
                    filterdata[0].category_name = resData.data.data.categoryName;
                    list.firstClass = '';
                }).catch(err => {
                    console.log(err);
                })
            };
            //点击确定按钮
            const mySumit = () => {
                //判断是否为空,
                if (!list.firstClass) {
                    root.$message.error('一级分类不能为空');
                    return
                }
                if (type.value.includes('添加一级分类')) {
                    addClass();
                } else if (type.value.includes('编辑一级分类')) {
                    editFirstClass();
                }
            };


            return {
                list, firstIsShow, secondIsShow, classData, status, type, clickNowDate,
                isShow, ck, readerCategory, editClass, delClass, addClass, editFirstClass, mySumit
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