<template>
    <div>
        <el-upload
                class="avatar-uploader"
                action="http://up.qiniup.com"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :data="data.QNY">
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
    import {reactive, ref, onMounted, watch} from "@vue/composition-api";
    import {uploadImgToken} from "../../api/commonApi";

    export default {
        /*思路:
        * 1.父组件传入imgurl地址
        * 2.子组件修改这个imgurl地址 并且返回给父亲重新渲染
        *
        * */
        name: "imgUpload",
        props: {
            ftcimgUrl: {
                type: String,
                default: ''
            },
            ftcOptions: {
                type: Object,
                default: {}
            }
        },
        setup(props, {root, emit}) {
            //所有的基础数据
            const data = reactive({
                QNY: {
                    token: '',
                    key: ''
                },
            });
            //from表单数据
            const form = reactive({
                imageUrl: '',
                options: {},
            });

            //调用获取获取七牛云toKen接口
            const getQNYtoken = () => {
                let res = {
                    accesskey: props.ftcOptions['accesskey'],//小写的accesskey
                    secretkey: props.ftcOptions['secretkey'],//小写的secretkey
                    buckety: props.ftcOptions['buckety']
                };
                uploadImgToken(res).then(req => {
                    let reqData = req.data.data;
                    /*console.log(reqData);*/
                    data.QNY['token'] = reqData.token;
                }).catch(err => {
                    console.log(err);
                })
            };
            //上传图片
            const handleAvatarSuccess = (res, file) => {
               /* console.log(res);*/
                /*this.imageUrl = URL.createObjectURL(file.raw);*/
                form.imageUrl = `${root.$store.state.comm.QNYImgUrl}${res.key}`;
                emit('update:ftcimgUrl', form.imageUrl);
            };
            const beforeAvatarUpload = (file) => {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    root.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    root.$message.error('上传头像图片大小不能超过 2MB!');
                }
                //文件名转码
                let suffix = file.name;
                let key = encodeURI(`${suffix}`);
                data.QNY['key'] = key;
                return isJPG && isLt2M;
            };


            watch(() => props.ftcimgUrl,(val) => {form.imageUrl = val;});
            watch(() => props.ftcOptions, (val) => {form.options = val;});
           /* console.log(props.ftcOptions);*/
            //挂载完成后
            onMounted(() => {
                getQNYtoken();
            });

            return {
                data, form,
                getQNYtoken, handleAvatarSuccess, beforeAvatarUpload
            }
        }
    }
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>