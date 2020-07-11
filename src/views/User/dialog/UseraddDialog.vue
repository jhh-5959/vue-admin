<template>
    <el-dialog
            :title="data.key.ftcSelectData['type']"
            :visible.sync="data.key.dialogFormVisible"
            append-to-body
            @open="openDialog"
            @close="closeDialog">
        <el-form :model="data.key.form" class="myForm" ref="dialogForm" :rules="rules">
            <!--用户名-->
            <el-form-item label="用户名:" :label-width="data.key.formLabelWidth" prop="username">
                <el-input v-model="data.key.form.username"
                          autocomplete="off"
                          placeholder="请输入内容"></el-input>
            </el-form-item>
            <!--姓名-->
            <el-form-item label="姓名:" :label-width="data.key.formLabelWidth" prop="truename">
                <el-input v-model="data.key.form.truename"
                          autocomplete="off"
                          placeholder="请输入内容"
                ></el-input>
            </el-form-item>
            <!--密码-->
            <el-form-item label="密码:" :label-width="data.key.formLabelWidth" prop="password">
                <el-input v-model="data.key.form.password"
                          autocomplete="off"
                          placeholder="请输入内容"
                          type="password"
                ></el-input>
            </el-form-item>
            <!--手机号-->
            <el-form-item label="手机号:" :label-width="data.key.formLabelWidth" prop="phone">
                <el-input v-model.number="data.key.form.phone"
                          autocomplete="off"
                          placeholder="请输入内容"
                ></el-input>
            </el-form-item>
            <!--地区-->
            <el-form-item label="地区:"
                          :label-width="data.key.formLabelWidth"
                          prop="region">
                <!--地区子组件-->
                <provinces
                        ref="provinces"
                        :ftcProvincesData.sync="data.key.ftcProvincesData"
                        :ftcConfig="ftcConfig"/>
            </el-form-item>
            <!--启用状态-->
            <el-form-item label="是否启用:" :label-width="data.key.formLabelWidth" prop="status">
                <el-radio-group v-model="data.key.form.status">
                    <el-radio :label="'1'">禁用</el-radio>
                    <el-radio :label="'2'">启用</el-radio>
                </el-radio-group>
            </el-form-item>
            <!--角色-->
            <el-form-item label="角色:"
                          :label-width="data.key.formLabelWidth"
                          prop="role">
                <el-checkbox-group
                        v-model="data.key.form.role"
                        :min="0"
                        :max="2">
                    <el-checkbox v-for="role in data.key.form.roles"
                                 :label="role.name"
                                 :key="role.role">{{role.name}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <!--按钮权限-->
            <el-form-item label="按钮:"
                          :label-width="data.key.formLabelWidth">
                <el-checkbox-group
                        v-model="data.key.form.btnPerm">
                    <template v-for="btnPowers in data.key.form.btnPowers">
                        <h4>{{btnPowers.name}}</h4>
                        <div>
                        <template v-for="perm in btnPowers.perm">
                            <el-checkbox :label="perm.value"
                                         :key="perm.value">{{perm.name}}
                            </el-checkbox>
                        </template>
                        </div>
                    </template>
                </el-checkbox-group>
            </el-form-item>
            <!--&lt;!&ndash;按钮权限&ndash;&gt;
            <el-form-item label="按钮:"
                          :label-width="data.key.formLabelWidth">
                <multipleChoiceBox
                        :btnPerm.sync="data.key.form.btnPerm"
                        :btnPerms="data.key.form.btnPowers"/>
            </el-form-item>-->
        </el-form>
        <!--按钮-->
        <div slot="footer" class="dialog-footer">
            <el-button @click="data.key.dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import {ref, reactive, watch} from "@vue/composition-api";
    //地区子组件
    import provinces from "@/components/Provinces";
    //权限按钮子组件
    import multipleChoiceBox from "@/components/multipleChoiceBox";
    //user接口API
    import {getRole, getSystem, getUserBtnPower, userAdd, userEdit} from "../../../api/user";
    //验证工具
    import {stripscript, VerifyUserName, VerifyPass, isNull} from '@/tools/verification'
    //加密工具
    import sha1 from 'sha1';
    //获取地区的数据
    import {getProvincesData} from "../../../components/Provinces/getProvincesData";

    export default {
        name: "UseraddDialog",
        //接收父组件给子组件的数据
        props: {
            ftc: {
                type: Boolean,
                default: false
            },
            ftcSelect: {
                type: Object,
                default: () => {
                },
            }
        },
        setup(props, {root, emit, refs, parent}) {
            //所有数据
            const data = reactive({
                key: {
                    //弹窗按钮
                    dialogFormVisible: false,
                    //form表单数据
                    form: {
                        username: '',
                        truename: '',
                        password: '',
                        phone: '',
                        status: '1',
                        role: [],
                        roles: [],
                        //选中的按钮权限
                        btnPerm: [],
                        //所有按钮权限
                        btnPowers: [],
                    },
                    //label的宽度
                    formLabelWidth: '78px',
                    //传递给"地区"子组件的数据(也是子组件回传的值)
                    ftcProvincesData: {},
                    //父组件'UserList'传给该子组件的数据
                    ftcSelectData: {},
                },

            });

            const {data: provincesData, resetFrom} = getProvincesData();
            //传递给"地区"子组件的配置(传入的值的输入框将被隐藏)
            const ftcConfig = reactive([]);
            //监听父组件给子组件的数据,实时修改dialogFormVisible的值
            watch([
                () => props.ftc,
                () => props.ftcSelect
            ], ([val1, val2]) => {
                data.key.dialogFormVisible = val1;
                data.key.ftcSelectData = JSON.parse(JSON.stringify(val2));
                /*console.log('data.key.ftcSelectData');
                console.log(data.key.ftcSelectData)*/
            },{
                deep:true
            });

            //验证邮箱
            const validateUserName = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error('请输入邮箱'));
                } else if (VerifyUserName(value)) {
                    callback(new Error('邮箱格式错误'));
                } else {
                    callback();
                }
            };
            //验证密码
            const validatePass = (rule, value, callback) => {


                if (data.key.ftcSelectData.type.includes('新增') || data.key.form.password) {
                    data.key.form.password = stripscript(value);
                    value = data.key.form.password;
                    if (value === '') {
                        callback(new Error('请输入密码'));
                    } else if (VerifyPass(value)) {
                        callback(new Error('请输入6-20位数字+字母,混合密码'));
                    } else {
                        callback();
                    }
                } else if (data.key.ftcSelectData.type.includes('编辑')) {
                    callback();
                }
            };
            //声明验证规则
            const rules = reactive({
                //邮箱
                username: [
                    {validator: validateUserName, trigger: 'blur'}
                ],
                //密码
                password: [
                    {validator: validatePass, trigger: 'blur'}
                ],
                //角色
                role: [
                    {required: true, message: '请选择角色', trigger: 'change'}
                ],
            });
            //点击提交按钮
            const addSubmit = () => {
                /* console.log(refs);*/
                /*console.log(parent);*/
                //验证表单
                refs['dialogForm'].validate((valid) => {
                    if (valid) {
                        //提交的参数
                        let resData = JSON.parse(JSON.stringify(data.key.form));
                        //角色
                        resData.role = resData.role.join(',');
                        //地区
                        resData.region = JSON.stringify(data.key.ftcProvincesData);
                        //按钮权限
                        resData.btnPerm=resData.btnPerm.join(',');
                        //删除多余无用的参数
                        delete resData.roles;
                        delete resData.btnPowers;
                        delete resData.type;
                        /*console.log('初始值---------------');
                        console.log(resData);*/
                        if (data.key.ftcSelectData.type.includes('新增')) {
                            //验证成功
                            resData.password = sha1(resData.password);
                            /*console.log('新增--------------------');
                            console.log(resData);*/
                            userAddApi(resData);
                        }
                        if (data.key.ftcSelectData.type.includes('编辑')) {
                            if (resData.password){
                                resData.password = sha1(resData.password);
                            }
                           /* console.log('编辑');
                            console.log(resData);
                            return false;*/
                            userEditApi(resData)
                        }

                    } else {
                        //提交失败
                        console.log('error submit!!');
                        return false;
                    }
                });
            };

            //重置
            const resetFormData = () => {
                /*console.log(provincesData);*/
                refs.dialogForm.resetFields();
                data.key.form.btnPerm=[];
            };
            //打开窗口的时候,
            const openDialog = () => {
                /* /!*系统权限*!/
                 getSystem()
                     .then(res => {
                         console.log(res.data.data);
                         if (data.key.ftcSelectData.type.includes('编辑')) {
                             data.key.form = Object.assign({}, data.key.ftcSelectData);
                             data.key.form.roles = res.data.data;
                             data.key.form.role = data.key.ftcSelectData.role.split(',');
                         } else {
                             data.key.form.roles = res.data.data;
                         }
                     })
                     .catch(err => console.log(err));*/

                //按钮权限
                console.log(data.key.form.btnPowers);
                console.log(data.key.form.roles);
                if (data.key.form.btnPowers.length===0){
                    getUserBtnPower().then(res => data.key.form.btnPowers=res.data.data);
                }

                //角色权限
                getRole()
                    .then(res => {
                        /*console.log(res.data.data);*/
                        if (data.key.ftcSelectData.type.includes('编辑')) {
                            data.key.form = Object.assign({}, data.key.ftcSelectData);
                            data.key.form.roles = res.data.data;
                            data.key.form.role = data.key.ftcSelectData.role.split(',');
                            data.key.form.btnPerm =data.key.ftcSelectData.btnPerm?data.key.ftcSelectData.btnPerm.split(','):[];
                            /*console.log('编辑getRole----------');
                            console.log(data.key.form);*/
                        } else {
                            data.key.form.roles = res.data.data;
                        }
                    })
                    .catch(err => console.log(err));


            };
            //关闭窗口的时候,
            const closeDialog = () => {
                //dialogFormVisible为false
                data.key.dialogFormVisible = false;
                /* //将dialogFormVisible的值传给父组件
                 emit('ctf',dialogFormVisible.value);*/
                //使用是修饰器 直接修改 父组件的值
                emit('update:ftc', data.key.dialogFormVisible);
                emit('update:ftcSelect',{});
                resetFormData();

            };
            //增加用户接口方法
            const userAddApi = (resData) => {
                userAdd(resData).then(res => {
                    /*console.log(res);*/
                    root.$message({
                        type: 'success',
                        message: res.data.message
                    });
                    parent.readerTableDate();
                    data.key.dialogFormVisible = false;
                }).catch(err => console.log(err));
            };
            //编辑用户接口方法
            const userEditApi = (resData) => {
                userEdit(resData).then(res => {
                    /*console.log(res);*/
                    root.$message({
                        type: 'success',
                        message: res.data.message
                    });
                    parent.readerTableDate();
                    data.key.dialogFormVisible = false;
                }).catch(err => console.log(err));
            };

            return {
                //所有的数据
                data, ftcConfig, provincesData,
                //弹窗
                closeDialog, openDialog, addSubmit, resetFormData,
                //校验规则
                rules,
                //验证
                validateUserName, validatePass, resetFrom
            }
        },
        components: {
            provinces,
            multipleChoiceBox
        }

    }
</script>

<style lang="scss" scoped>
    /deep/ .el-dialog {
        width: 576px;
    }

    /deep/ .el-dialog__body {
        padding: 16px 47px 0 32px;
    }

    /deep/ .dialog-footer {
        text-align: center;
    }

    /deep/ .el-form-item {
        margin-bottom: 18px
    }
    /deep/ .el-checkbox-group{
        font-size:15px
    }
</style>

