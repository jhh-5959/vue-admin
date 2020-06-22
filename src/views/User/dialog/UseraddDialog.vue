<template>
    <el-dialog
            title="新增"
            :visible.sync="dialogFormVisible"
            append-to-body
            @close="closeDialog">
        <el-form :model="form" class="myForm">
            <!--用户名-->
            <el-form-item label="用户名:" :label-width="formLabelWidth">
                <el-input v-model="form.username" autocomplete="off" placeholder="请输入内容"></el-input>
            </el-form-item>
            <!--姓名-->
            <el-form-item label="姓名:" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" placeholder="请输入内容"></el-input>
            </el-form-item>
            <!--手机号-->
            <el-form-item label="手机号:" :label-width="formLabelWidth">
                <el-input v-model="form.tel" autocomplete="off" placeholder="请输入内容"></el-input>
            </el-form-item>
            <!--地区-->
            <el-form-item label="地区:" :label-width="formLabelWidth">
                <el-row :gutter="0">
                    <el-col :span="6">
                        <el-select v-model="value1" multiple placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6" style="margin-left: 21px;">
                        <el-select
                                v-model="value2"
                                multiple
                                collapse-tags
                                placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6" style="margin-left: 24px">
                        <el-select
                                v-model="value3"
                                multiple
                                collapse-tags

                                placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>



            </el-form-item>
            <!--启用状态-->
            <el-form-item label="是否启用:" :label-width="formLabelWidth">
                <el-radio-group v-model="form.radio">
                    <el-radio :label="0">禁用</el-radio>
                    <el-radio :label="1">启用</el-radio>
                </el-radio-group>
            </el-form-item>
            <!--角色-->
            <el-form-item label="角色:" :label-width="formLabelWidth">
                <el-checkbox-group
                        v-model="form.checkedroles"
                        :min="0"
                        :max="2">
                    <el-checkbox v-for="role in form.roles" :label="role" :key="role">{{role}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <!--按钮-->
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import {ref, reactive, watch} from "@vue/composition-api"

    export default {
        name: "UseraddDialog",

        //接收父组件给子组件的数据
        props: {
            ftc: {
                type: Boolean,
                default: false
            }
        },

        setup(props, {root, emit}) {
            //弹窗开关
            const dialogFormVisible = ref(true);
            //form表单数据
            const form = reactive({
                username: '',
                name: '',
                tel: '',
                radio: 0,
                checkedroles: [],
                roles: ['系统管理员', '信息管理员', '用户管理员'],
            });
            //地区
            const options = reactive([{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }, {
                value: '选项3',
                label: '蚵仔煎'
            }, {
                value: '选项4',
                label: '龙须面'
            }, {
                value: '选项5',
                label: '北京烤鸭'
            }]);
            const value1 = reactive([]);
            const value2 = reactive([]);
            const value3 = reactive([]);


            //label的宽度
            const formLabelWidth = ref('78px');
            //监听父组件给子组件的数据,实时修改dialogFormVisible的值
            watch(() => props.ftc, (val) => {
                dialogFormVisible.value = val;
            });
            //关闭窗口的时候,
            const closeDialog = () => {
                //dialogFormVisible为false
                dialogFormVisible.value = false;
                /* //将dialogFormVisible的值传给父组件
                 emit('ctf',dialogFormVisible.value);*/
                //使用是修饰器 直接修改 父组件的值
                emit('update:ftc', dialogFormVisible.value);
            };

            return {
                /*弹窗*/
                dialogFormVisible, closeDialog,
                /*表单*/
                form, formLabelWidth,
                /*地区*/
                options, value1, value2,value3
            }
        }

    }
</script>

<style lang="scss">
    .el-dialog {
        width: 576px;
        height: 567px;
    }

    .el-dialog__body {
        padding: 26px 47px 14px 32px;
    }

    .dialog-footer{
        text-align:center;
    }
</style>

