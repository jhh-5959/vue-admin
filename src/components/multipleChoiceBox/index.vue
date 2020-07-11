<template>
    <div>
        <template v-for="item in data.btnOptions">
            <el-checkbox
                    :key="item.name"
                    :label="data.checkAll"
                    :indeterminate="data.isIndeterminate"
                    v-model="data.checkAll"
                    @change="handleCheckAllChange">{{ item.name }}
            </el-checkbox>
                <div style="margin: 5px 0;"></div>
                <el-checkbox-group
                        v-model="data.checkedBtns"
                        @change="handleCheckedCitiesChange">
                    <el-checkbox
                            v-for="btns in item.perm"
                            :label="btns.value"
                            :key="btns.value">{{btns.name}}</el-checkbox>
                </el-checkbox-group>
        </template>
    </div>
</template>

<script>
    import {reactive, ref, watch} from "@vue/composition-api";

    export default {
        name: "multipleChoiceBox",
        props: {
            //选中的按钮权限
            btnPerm: {
                type: Array,
                default: () => [],
            },
            //所有按钮权限
            btnPerms: {
                type: Array,
                default: () => [],
            }
        },
        setup(props, {root}) {
            //外部配置的选项
            /*const btnOptions = ref([]);*/
            const data = reactive({
                btnOptions:[],
                //是否全选
                checkAll: [true],
                //当前默认选中的数组
                checkedBtns: [],
                //跟着外面配置更改
                btns: [],
                //设置 indeterminate 状态，只负责样式控制
                isIndeterminate: true,
            });
            const handleCheckAllChange = (val) => {
                data.isIndeterminate = !data.isIndeterminate;
                console.log(val);

                data.checkedBtns= val ? data.checkedBtns : [];
                console.log(data.checkedBtns);

            };
            const handleCheckedCitiesChange = (value) => {
                console.log(value);

                /*let checkedCount = value.length;
                data.checkAll = checkedCount === data.btns.length;
                data.isIndeterminate = checkedCount > 0 && checkedCount < data.btns.length;*/
            };

            watch([
                () => props.btnPerm,
                () => props.btnPerms,
            ], ([val1, val2]) => {
                /*当前选中的值*/
                /*console.log("当前选中权限的值--------------------------");
                console.log(val1);*/
                /*所有权限的数据*/
                data.btnOptions = val2;
                /*console.log("所有权限的数据 btnOptions--------------------------");
                console.log(data.btnOptions);*/

                /*if (data.btnOptions.length){
                    data.btnOptions.forEach(item=>data.btns.push(item.perm))
                }else{
                    data.btns=[];
                }
                console.log(data.btns);*/

                /*console.log("内部所有权限的数据 data.btns--------------------------");
                console.log(data.btns);*/
            }, {
                immediate: true
            });

            return {
                data,
                handleCheckAllChange, handleCheckedCitiesChange
            }
        }
    }
</script>

<style scoped>

</style>