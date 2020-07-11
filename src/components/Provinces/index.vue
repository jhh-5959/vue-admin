<template>
    <el-row :gutter="0">
        <el-col v-if="provinceConfig.province" :span="5">
            <el-select
                    v-model="data.province"
                    placeholder="请选择"
                    clearable
                    @change="getProvince">
                <el-option
                        v-for="item in data.provinceData"
                        :key="item.PROVINCE_ID"
                        :label="item.PROVINCE_NAME"
                        :value="item.PROVINCE_NAME">
                </el-option>
            </el-select>
        </el-col>
        <el-col v-if="provinceConfig.city" :span="5" class="margin-left-21">
            <el-select
                    v-model="data.city"
                    collapse-tags
                    placeholder="请选择"
                    @change="getCity">
                <el-option
                        v-for="item in data.cityData"
                        :key="item.CITY_ID"
                        :label="item.CITY_NAME"
                        :value="item.CITY_NAME">
                </el-option>
            </el-select>
        </el-col>
        <el-col v-if="provinceConfig.district" :span="5" class="margin-left-24">
            <el-select
                    v-model="data.district"
                    collapse-tags
                    placeholder="请选择"
                    @change="getDistrict"
            >
                <el-option
                        v-for="item in data.districtData"
                        :key="item.AREA_ID"
                        :label="item.AREA_NAME"
                        :value="item.AREA_NAME">
                </el-option>
            </el-select>
        </el-col>
        <el-col v-if="provinceConfig.street" :span="5" class="margin-left-24">
            <el-select
                    v-model="data.street"
                    collapse-tags
                    placeholder="请选择"
                    @change="getStreet">
                <el-option
                        v-for="item in data.streetData"
                        :key="item.STREET_ID"
                        :label="item.STREET_NAME"
                        :value="item.STREET_NAME">
                </el-option>
            </el-select>
        </el-col>
    </el-row>
</template>

<script>
    import {onBeforeMount,onMounted, watch} from '@vue/composition-api';
    /*获取城市区数据*/
    import {getProvincesData} from "./getProvincesData";

    export default {
        name: "provinces",
        props: {
            ftcProvincesData: {
                type: Object,
                default: () => {
                }
            },
            ftcConfig:{
                type:Array,
                default:()=>[],
            }
        },
        setup(props, {emit}) {
            const {data, getProvince, getCity, getDistrict, getStreet, resetFrom} = getProvincesData();

            //监听传值返回给父组件
            watch(
                () => data, () => {
                    let resData={
                        province:data['province'],
                        city:data['city'],
                        district:data['district'],
                        street:data['street'],
                        provinceCode:data['provinceCode'],
                        cityCode: data['cityCode'],
                        districtCode: data['districtCode'],
                        streetCode: data['streetCode'],
                    };
                    emit("update:ftcProvincesData",resData )
                }, {
                    deep: true
                });
            //监听父组件的值
            watch(
                () => props.ftcProvincesData, (val) => {
                    /*console.log(data);*/
                });






            //初始化配置
            const provinceConfig=({
                province:true,
                city:true,
                district:true,
                street:true
            });
            //处理父组件插入的配置项
            const handleConfig=()=>{
                let ftc=props.ftcConfig;
                ftc.forEach(item=>{
                    provinceConfig[item]=false;
                });
            };
            handleConfig();
            onBeforeMount(() => {getProvince();});



            return {
                data,provinceConfig,
                getProvince, getCity, getDistrict, getStreet, resetFrom,handleConfig
            }
        }
    }
</script>

<style scoped lang="scss">
    /deep/ .el-input--suffix {
        overflow: hidden !important;

        .el-input__inner {
            padding-left: 10px !important;
        }

    }
</style>