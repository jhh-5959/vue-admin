<template>
    <div class="addDialog">
        <el-dialog :title="data.title"
                   :visible.sync="data.dialogFormVisible"
                   append-to-body="append-to-body"
                   @close="closeDialog"
                   @open="openDialog"
                   width="576px">
            <el-form :model="data.form" ref="dialogForm">
                <el-form-item label="类型:" :label-width="data.formLabelWidth">
                    <el-select v-model="data.form.id" placeholder="请选择">
                        <el-option
                                v-for=" item  in data.typeData"
                                :key="item.id"
                                :label="item.category_name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标题:" :label-width="data.formLabelWidth">
                    <el-input v-model="data.form.title" autocomplete="off" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="概况:" :label-width="data.formLabelWidth">
                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="data.form.textarea"
                            id="myTextarea">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="data.dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDialog">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {ref, reactive, watch} from "@vue/composition-api";
    import {newsAdd} from "@/api/new";
    import { isNull } from "../../../tools/verification";

    export default {
        name: "addDialog",
        //父组件传入子组件的值
        props: {
            ftc: {
                type: Boolean,
                default: false
            },
            ftcType: {
                type: Array
            },
            ftcTitle:{
                type:String,
            }

        },
        setup(props, {root, emit,parent}) {
            //所有数据
            const data = reactive({
                //是否弹窗开关按钮
                dialogTableVisible: false,
                dialogFormVisible: false,
                //表单的数据
                form: {
                    id: '',
                    title: '',
                    textarea: ''
                },
                //表单宽度
                formLabelWidth: '120px',
                //类型的渲染数据
                typeData: [],
                //弹窗的标题
                title:'',
            });
            //时时监听 父组件传入子组件的 数据
            watch([
                () => props.ftc,
                /*()=>data.form*/
                ()=>props.ftcTitle,
            ], ([val1,val2]) => {
                data.dialogFormVisible = val1;
               /* data.form=val2;*/
                data.title=val2;

            });
            //关闭弹窗使用的回调函数
            const closeDialog = () => {
                data.dialogFormVisible = false;
                /* emit('ctf',dialogFormVisible.value);*/
                emit('update:ftc', data.dialogFormVisible);

            };
            //打开弹窗使用的回调函数
            const openDialog = () => {
                data.typeData = props.ftcType;
                /*console.log(data.typeData);*/
            };

            //点击确定按钮
            const submitDialog = () => {
                //验证表单
                if(!isNull(data.form['id'],'请选择类型')){
                    return
                }
                if(!isNull(data.form['title'],'请输入标题')){
                    return
                }
                if(!isNull(data.form['textarea'],'请输入内容')){
                    return
                }
                //传入数据
                let resData = {
                    categoryId: data.form.id,
                    title: data.form.title,
                    imgUrl: "http://!********",
                    createDate: "2020-02-02 12:00:00",
                    content: data.form.textarea,
                };
                //调用接口
                newsAdd(resData).then(res => {
                    console.log(res);
                    root.$message({
                        type:'success',
                        message:res.data.message
                    });
                    data.form['id']='';
                    data.form['title']='';
                    data.form['textarea']='';
                    parent.readerTable();
                }).catch(err => {
                    console.log(err);
                });
                /* refs['dialogForm'].resetFields();*/
                data.dialogFormVisible = false
            };


            return {
                data,
                closeDialog,
                openDialog,
                submitDialog

            }
        }
    }
</script>

<style scoped lang="scss">
    .el-dialog__wrapper {
        ::v-deep .el-dialog {
            height: 489px !important;
        }
    }

    ::v-deep #myTextarea {
        min-height: 151px !important;
    }

    ::v-deep .el-dialog__body {
        padding: 30px 47px 14px 44px;
    }

    ::v-deep .el-dialog__footer {
        text-align: center;
    }

    ::v-deep .el-form-item__label {
        width: 58px !important;
        text-align: left !important;
    }

    ::v-deep .el-form-item__content {
        margin-left: 58px !important;
    }
</style>