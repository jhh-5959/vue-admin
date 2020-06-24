<template>
    <div id="login">
        <ul id="title">
            <li v-for="(item,index) in mag" :key="item.id" @click="isActive(index,'ruleForm')"
                :class="{ active:changeIndex==index}">{{ item.text }}
            </li>
        </ul>
        <div id="my-el-form">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                     class="demo-ruleForm" size="medium">
                <!--验证用户名/邮箱-->
                <el-form-item prop="userName">
                    <label for="userName">邮箱</label>
                    <el-input id="userName" type="text" v-model="ruleForm.userName" autocomplete="off"></el-input>
                </el-form-item>
                <!--验证密码-->
                <el-form-item prop="pass">
                    <label for="passWord">密码</label>
                    <el-input id="passWord" type="password" v-model="ruleForm.pass" autocomplete="off" maxlength="20"
                              minlength="6"></el-input>
                </el-form-item>

                <!--确认密码-->
                <el-form-item prop="checkPass" v-show="changeIndex">
                    <label for="checkPassWord">确认密码</label>
                    <el-input id="checkPassWord" type="password" v-model="ruleForm.checkPass"
                              autocomplete="off"></el-input>
                </el-form-item>

                <!--验证码-->
                <el-form-item prop="code">
                    <label for="code">验证码</label>
                    <el-row :gutter="19">
                        <el-col :span="15">
                            <el-input id="code" type="text" v-model="ruleForm.code" class="code"
                                      autocomplete="off"></el-input>
                        </el-col>
                        <el-col :span="5">
                            <el-button type="success" class="btn-success" @click="getCode()"
                                       :disabled="codeBtnStatus.status">{{codeBtnStatus.text}}
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <!--登录按钮-->
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')" class="btn-login"
                               :disabled="loginBtnStatus">{{
                        changeIndex?'注册':'登录'
                        }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    //工具栏
    import {stripscript, VerifyUserName, VerifyPass, VerifyCode, isNullorFormat} from '@/tools/verification'
    //使用Vue3.0语法需要 按需导入 对应的API
    import {reactive, ref, isRef} from '@vue/composition-api';
    //按需调用 login.js 接口文件
    import {postCodeApi, postLoginApi, postRegisterApi} from '@/api/login';
    //加密工具
    import sha1 from 'sha1';

    export default {
        name: "Login",
        /*setup(props, context) {
            console.log(context);
            this.$atts => context.attrs
            this.$slots => context.slots
            this.$parent=> context.parent
            this.$emit=> context.emit
            this.$refs=> context.refs
            this=> context.root
            */

        //Vue3.0语法中的Api
        setup(props, {root, refs}) {
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


            console.log(root.$router);
            console.log(root.$route);

            //1.对象/数组用 reactive()定义
            //声明文本内容
            const mag = reactive([
                {text: '登录'},
                {text: '注册'}
            ]);
            //声明登录验证码按钮的状态
            const codeBtnStatus = reactive({
                status: false,
                text: '获取验证码'
            });
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
            //判断状态用的变量
            const changeIndex = ref(0);
            //登录/注册按钮的状态
            const loginBtnStatus = ref(true);
            //计时器id 清除用
            let timeId = ref('');
            //使用 isRef来判断 是否是ref类型
            /*console.log(isRef(mag)?'是':'否');*/


            //3.methods去除,采用普通方式写方法
            //点击按钮 调用接口获取验证码
            let getCode = () => {
                //判断邮箱/密码是否为空或者格式有问题
                if (!isNullorFormat(ruleForm)) {
                    return;
                }
                //判断是否是注册页面
                if (changeIndex.value) {
                    if (ruleForm.checkPass == '') {
                        root.$message.error('请输入确认密码');
                        return
                    }
                    //校验密码是否一致
                    if (ruleForm.checkPass !== ruleForm.pass) {
                        root.$message.error('两次输入密码不一致!');
                        return;
                    }
                }
                //切换验证码转状态
                changeCodeBtnStatus({status: true, text: '请求中'});
                //定义post 请求的参数
                let data = {
                    username: ruleForm.userName,
                    module: changeIndex.value ? 'register' : 'login'
                    /*0 false login   1 true register*/
                };
                //调用接口,将参数传入
                postCodeApi(data).then(response => {
                        //调用接口成功
                        /*console.log(response);*/
                        //获取接口返回的数据
                        let resDate = response.data;
                        //消息栏弹出对应的消息
                        root.$message({
                            message: resDate.message,
                            type: 'success'
                        });
                        //启用登录按钮
                        loginBtnStatus.value = false;
                        //开启定时器
                        timer();
                    }
                    //调用接口失败
                ).catch(err => {
                        console.log(err);
                        //开启定时器
                        timer();
                    }
                );
            };
            //点击提交(登录/注册)按钮
            const submitForm = (formName) => {
                //验证表单
                refs[formName].validate((valid) => {
                    if (valid) {
                        //验证成功,将表单里的数据打包下
                        let data = {
                            username: ruleForm.userName,
                            password: sha1(ruleForm.pass),
                            code: ruleForm.code,
                        };
                        //页面调用对应的接口
                        changeIndex.value ? register(data, formName) : login(data);
                    } else {
                        //提交失败
                        console.log('error submit!!');
                        return false;
                    }
                });
            };
            //调用注册接口
            const register = (data, formName) => {
                //将打包的数据传入接口
                postRegisterApi(data).then(response => {
                    //调用成功返回对应的数据
                    console.log(response);
                    let resData = response.data;
                    //弹出消息框
                    root.$message({
                        message: resData.message,
                        type: 'success'
                    });
                    isActive(0, formName);
                }).catch(err => {
                    //调用失败,返回对应的错误
                    console.log(err);
                })
            };
            //调用登录接口
            const login = data => {
                //是登录状态,调用登录接口
                root.$store.dispatch("app/loginApi",data).then(response => {
                        //调用成功返回对应的数据
                        let resData = response.data;
                        console.log(response);
                        //弹出消息框
                        root.$message({
                            message: resData.message,
                            type: 'success'
                        });
                        //成功登录路由跳转
                        root.$router.replace('/initIndex');
                    }
                ).catch(err => {
                        //调用失败,返回对应的错误
                        console.log(err);
                    }
                )
            };
            //切换登录/注册按钮状态
            const isActive = (index, formName) => {
                changeIndex.value = index;
                //重置表单的文本内容
                refs[formName].resetFields();
                //清理定时器
                clearInterval(timeId.value);
                //初始化验证码/按钮的状态
                changeCodeBtnStatus({status: false, text: '获取验证码'});
                loginBtnStatus.value = true;
            };
            //定时器
            const timer = () => {
                if (timeId.value) {
                    clearInterval(timeId.value);
                }
                let num = 10;
                //倒计时
                timeId.value = setInterval(() => {
                    num--;
                    //当倒计时结束时候,清空定时器,调整验证码的状态
                    if (num === 0) {
                        clearInterval(timeId.value);
                        codeBtnStatus.status = false;
                        codeBtnStatus.text = '重新发送';
                    } else {
                        //没结束时候,继续倒计时
                        codeBtnStatus.text = `倒计时${num}秒`;
                    }
                }, 1000);
            };
            //切换验证码按钮状态
            const changeCodeBtnStatus = (obj) => {
                codeBtnStatus.status = obj.status;
                codeBtnStatus.text = obj.text;
            };


            //将方法,对象,数组return出去才能用
            return {
                mag,
                ruleForm,
                changeIndex,
                rules,
                loginBtnStatus,
                codeBtnStatus,
                timeId,
                changeCodeBtnStatus,
                register,
                login,
                isActive,
                submitForm,
                getCode,
                timer,

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