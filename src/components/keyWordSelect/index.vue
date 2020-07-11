<template>
    <div class="keyword">
        <label>关键字:</label>
        <el-select v-model="data.keyWordVal"
                   placeholder="请选择"
                   style="width:101px"
                   @change="handleChange(data.keyWordVal)">
            <el-option
                    v-for="item in data.initOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    import {reactive, onBeforeMount} from "@vue/composition-api";
    import { isNull } from "../../tools/verification";

    export default {
        name: "keyWordSelect",
        props: {
            ftcSelectConfig: {
                type: Object,
                default: () => {},
            },
            ftcNowSelect:{
                type: Object,
                default: () => {},
            }
        },
        setup(props, {emit}) {
            const data = reactive({
                //Select选择器(关键字),总的关键字,供筛选用
                keyWordOptions: [
                    {value: 'phone',label: '手机号'},
                    {value: 'truename',label: '姓名'},
                    {value: 'username',label: '邮箱'},
                    {value: 'id',label: 'ID'},
                    {value: 'title',label: '标题'},
                    ],
                keyWordVal: '',
                //筛选后结果存放处,用来渲染页面
                initOptions:[]
            });
            //初始化关键字
            const initSelect = () => {
                //获取父组件传入的配置项
                let options= props.ftcSelectConfig.options;
                //获取父组件传入的默认选中项
                let defaultVal=props.ftcSelectConfig.selectVal;
                //存放筛选过后的配置
                let optionArr=[];
                //验证数据(如果传入一个空的配置项)
                if(!isNull(options,'传入的下拉选项为空')){
                    return false
                }
                options.forEach((item)=>{
                    let newArr=data.keyWordOptions.filter((val)=>{ return val.value==item;});
                    if (newArr.length>0){
                        optionArr.push(newArr[0]);
                    }
                });
                //验证数据(如果传入错误的配置项)
                if(!isNull(optionArr,'传入的下拉选项不符合')){
                    return false
                }
                //渲染下拉选项
                data.initOptions=optionArr;
                if (optionArr.some((item)=> item.value==defaultVal)){
                    data.keyWordVal=defaultVal;
                    handleChange(defaultVal);
                }
            };
            //当选项框改变的时候
            const handleChange=(val)=>{
                if (val){
                    let obj={[val]:'',};
                    emit('update:ftcNowSelect',obj)
                }
            };
            onBeforeMount(() => {
                initSelect();
            });

            return {
                data,
                initSelect,
                handleChange
            }
        }
    }

</script>

<style scoped lang="scss">
    .keyword {
        @include labelLayout(70, 38);

    }
</style>


<!--
1.组件目录:src > components > table

2.引用组件: import keyWordSelect from "@/components/keyWordSelect"

3.模板: <keyWordSelect :ftcSelectConfig="selectConfig" />

4.配置设置: ftcSelectConfig: { Object }

4.1参数
    ftcSelectConfig:{
        //---下拉选项
        options: { Array }
       //---默认选中的关键字
        selectVal: { String }
     }
-->
