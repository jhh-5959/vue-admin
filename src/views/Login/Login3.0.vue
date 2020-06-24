<template>
    <div id="login">
        <ul id="title">
            <li v-for="(item,index) in mag" :key="item.id" @click="isActive(index)"
                :class="{ active:changeIndex==index}">{{ item.text }}
            </li>
        </ul>
        <div id="my-el-form">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                     class="demo-ruleForm" size="medium">
                <!--验证用户名/邮箱-->
                <el-form-item prop="userName">
                    <label>邮箱</label>
                    <el-input type="text" v-model="ruleForm.userName" autocomplete="off"></el-input>
                </el-form-item>
                <!--验证密码-->
                <el-form-item prop="pass">
                    <label>密码</label>
                    <el-input type="text" v-model="ruleForm.pass" autocomplete="off" maxlength="20"
                              minlength="6"></el-input>
                </el-form-item>

                <!--确认密码-->
                <el-form-item prop="checkPass" v-show="changeIndex">
                    <label>确认密码</label>
                    <el-input type="text" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>

                <!--验证码-->
                <el-form-item prop="code">
                    <label>验证码</label>
                    <el-row :gutter="19">
                        <el-col :span="15">
                            <el-input type="text" v-model="ruleForm.code" class="code" autocomplete="off"></el-input>
                        </el-col>
                        <el-col :span="5">
                            <el-button type="success" class="btn-success">获取验证码</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <!--登录按钮-->
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')" class="btn-login">{{ changeIndex?'注册':'登录'
                        }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {stripscript, VerifyUserName, VerifyPass, VerifyCode} from '@/tools/verification'
    //使用Vue3.0语法需要 按需导入 对应的API
    import {reactive, ref, isRef} from '@vue/composition-api'

    export default {
        name: "Login",
        setup(props, context) {

            //自定义函数名的形式
            /*验证邮箱*/
            let validateUserName = (rule, value, callback) => {
                /*let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;*/
                if (value === "") {
                    callback(new Error('请输入邮箱'));
                } else if (VerifyUserName(value)) {
                    callback(new Error('邮箱格式错误'));
                } else {
                    callback();
                }
            };
            /*验证密码*/
            let validatePass = (rule, value, callback) => {
                ruleForm.pass = stripscript(value);
                value = ruleForm.pass;
                /* let reg = /^(?!\D+$)(?! [^a-zA-Z]+$)\S{6,20}$/;*/
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if (VerifyPass(value)) {
                    callback(new Error('请输入6-20位数字+字母,混合密码'));
                } else {
                    callback();
                }
            };
            /*确认密码*/
            let validatePass2 = (rule, value, callback) => {
                if (changeIndex.value === 0) {
                    callback();
                }
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            /*验证码*/
            let validateCode = (rule, value, callback) => {
                ruleForm.code = stripscript(value);
                value = ruleForm.code;
                if (value === '') {
                    callback(new Error('请输入验证码'));
                } else if (VerifyCode(value)) {
                    callback(new Error('请输入6位验证码'));
                } else {
                    callback();
                }
            };


            //1.对象/数组用 reactive()定义
            //声明文本内容
            const mag = reactive([
                {text: '登录'},
                {text: '注册'}
            ]);
            //声明双向交互数据
            const ruleForm = reactive({
                userName: '',
                pass: '',
                checkPass: '',
                code: '',
            });
            //声明验证规则
            const rules = reactive({
                /*邮箱*/
                userName: [
                    {validator: validateUserName, trigger: 'blur'}
                ],
                /*密码*/
                pass: [
                    {validator: validatePass, trigger: 'blur'}
                ],
                /*确认密码*/
                checkPass: [
                    {validator: validatePass2, trigger: 'blur'}
                ],
                /*验证码*/
                code: [
                    {validator: validateCode, trigger: 'blur'}
                ]
            });


            //2.普通数据类型用 ref()定义
            const changeIndex = ref(0);
            //使用 isRef来判断 是否是ref类型
            /*console.log(isRef(mag)?'是':'否');*/


            //3.methods去除,采用普通方式写方法
            const isActive = (index) => {
                changeIndex.value = index;
            };
            /*登录按钮*/
            const submitForm = (formName) => {
                context.refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            };


            return {
                mag,
                ruleForm,
                changeIndex,
                rules,
                isActive,
                submitForm,
            }

        },

    }
</script>

<style scoped lang="scss">
    #login {
        background-color: #344a5f;
        height: 100vh;
        width: 100%;
        padding-top: 1px;
        margin: 0 auto;

        > ul {
            margin-top: 250px;
            width: 100%;
            display: inline-block;
            text-align: center;
            color: #ffffff;

            > li {
                width: 88px;
                height: 36px;
                display: inline-block;
                line-height: 36px;

                &.active {
                    background-color: #2f4255;
                }
            }

        }

        #my-el-form {
            margin: 0 auto;

            > .el-form {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                margin-left: -50px;
                display: inline-block;

                > .el-form-item {
                    margin-bottom: 20px;

                    label {
                        color: #eeeeee;
                        display: block;
                    }

                    .el-input {
                        display: block;
                        width: 329px;
                        height: 40px;

                        /deep/ .el-input__inner {
                            height: 100%;
                        }

                    }


                    .code {
                        width: 212px;
                    }

                    .el-row {
                        margin-bottom: 0;
                    }

                    .btn-success {
                        width: 106px;
                        height: 40px;
                    }

                    .btn-login {
                        margin-top: 12px;
                        width: 329px;
                        background-color: #fab6b6;
                        border-color: #fab6b6;
                    }

                }
            }
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

</style>