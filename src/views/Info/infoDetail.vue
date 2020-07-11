<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px" v-loading="data.loading">
            <el-form-item label="信息分类:">
                <el-select v-model="form.typeSelectVal" placeholder="请选择" style="width: 167px" clearable>
                    <el-option
                            v-for="item in form.typeData"
                            :key="item.id"
                            :label="item.category_name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="新闻标题:">
                <el-input v-model="form.title" style="width: 369px;"></el-input>
            </el-form-item>
            <el-form-item label="略缩图:">
                <imgUpload :ftcimgUrl.sync="form.imageUrl" :ftcOptions="imgUpOptions"/>
            </el-form-item>
            <el-form-item label="发布时间">
                <el-date-picker
                        v-model="form.createDate"
                        type="datetime"
                        placeholder="选择日期"
                        disabled>
                </el-date-picker>
            </el-form-item>
            <el-form-item label="详细内容">
                <quillEditor v-model="form.content" ref="myQuillEditor" :options="data.editorOption"/>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="onSubmit" :loading="data.btnLoading">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>


<script>
    import {ref, reactive, onMounted,onActivated, watch} from "@vue/composition-api"
    //引入富文本编辑器
    import {quillEditor} from "vue-quill-editor";
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    //调用接口
    import {getList} from "../../api/new";
    //调用公共方法
    import {timestampToTime, nowDatetoHour24} from "../../tools/comm";
    import {editInfo} from "../../api/new";
    //引入自定义图片上传组件
    import imgUpload from '@/components/imgUpload';

    export default {
        name: "infoDetail",
        setup(props, {root}) {
            //所有的基础数据
            const data = reactive({
                id: root.$store.getters['infoDetail/infoId'],
                editorOption: {},
                tableData: [],
                loading: false,
                btnLoading: false,
            });
            //from表单数据
            const form = reactive({
                typeSelectVal: '',
                typeData: [],
                title: '',
                createDate: '',
                content: '',
                imageUrl: '',
            });
            //imgUpload的配置
            const imgUpOptions = reactive({
                accesskey: 'OJJqqPkGDqCF1TrRuZbZvjXVByhFYaAx1DqHZ5V_',
                secretkey: 'eB3vd2NRX2tQME1-bDnsVpZRzhChShW_3_XQT7Qa',
                buckety: 'jin-room'

            });

            //获取分类列表(vuex 获取公共方法)
            const getType = () => {
                root.$store.dispatch('comm/readerClass').then(res => {
                    form.typeData = res;
                    /*console.log(typeData.key);*/
                }).catch(err => {
                    console.log(err);
                })
            };
            //调用接口渲染数据
            const readerTable = () => {
                let req = {
                    categoryId: '',
                    startTiem: '',
                    endTime: '',
                    title: '',
                    id: data.id,
                    pageNumber: 1,
                    pageSize: 10
                };
                data.loading = true;
                getList(req).then(res => {
                    let resData = res.data.data;
                    //存储数据
                    data.tableData = resData.data[0];
                    data.loading = false;
                    /*console.log(resData);*/
                    //渲染页面
                    form.typeSelectVal = data.tableData.categoryId;
                    form.title = data.tableData.title;
                    form.createDate = timestampToTime(data.tableData.createDate);
                    form.content = data.tableData.content;
                    form.imageUrl = data.tableData.imgUrl;
                    /*console.log(data.tableData)*/
                }).catch(err => {
                    data.loading = false;
                    console.log(err);
                })
            };

            //点击确定按钮
            const onSubmit = () => {
                //调用编辑接口
                let resData = {
                    id: data['id'],
                    categoryId: form['typeSelectVal'],
                    title: form['title'],
                    updateDate: nowDatetoHour24(),
                    content: form['content'],
                    imgUrl: form['imageUrl'],
                };
                editInfo(resData).then(res => {
                    root.$message({
                        type: 'success',
                        message: res.data.message
                    });
                    data.btnLoading = false;
                    readerTable();
                }).catch(err => {
                        root.$message.error(err);
                        console.log(err);
                        data.btnLoading = false;
                    }
                )
            };

            //挂载完成后
            onMounted(() => {
                getType();
                /*readerTable();*/
            });
            //keep-alive
            onActivated(()=>{
                data.id=root.$store.getters['infoDetail/infoId'];
                readerTable();
            });

            return {
                form, data, imgUpOptions,
                onSubmit, getType, readerTable,
            }
        },
        components: {
            quillEditor,
            imgUpload
        }
    }
</script>

<style>

</style>