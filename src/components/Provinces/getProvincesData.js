import {getCityPicker} from "../../api/commonApi";
import {reactive, onMounted} from '@vue/composition-api';
export function getProvincesData() {
    /*所有的数据*/
    const data = reactive({
        //地区
        /*下拉的所有数据*/
        provinceData: [],
        cityData: [],
        districtData: [],
        streetData: [],
        /*当前选中的值*/
        province: '',
        city: '',
        district: '',
        street: '',
        /*值对应的code*/
        provinceCode: '',
        cityCode: '',
        districtCode: '',
        streetCode: '',

    });
    /*获取省*/
    const getProvince = (val) => {
        resetFrom('city');
        getCityPicker({type: 'province'})
            .then(res => {
                let resProvince = res.data.data.data;
                data.provinceData = resProvince;
                if (data.province) {
                    let currentProvince = resProvince.filter((item) => {
                        return item.PROVINCE_NAME == data.province
                    });
                    data.provinceCode = currentProvince[0].PROVINCE_CODE;
                    getCity();
                }
            })
            .catch(err => console.log(err));
    };
    /*获取市*/
    const getCity = () => {
        resetFrom('district');
        getCityPicker({type: 'city', province_code: data.provinceCode})
            .then(res => {
                let resCity = res.data.data.data;
                data.cityData = resCity;
                if (data.city) {
                    let currentCity = resCity.filter((item) => {
                        return item.CITY_NAME == data.city
                    });
                    data.cityCode = currentCity[0].CITY_CODE;
                    getDistrict();
                }
            })
            .catch(err => console.log(err));
    };
    /*获取区*/
    const getDistrict = () => {
        resetFrom('street');
        getCityPicker({type: 'area', city_code: data.cityCode})
            .then(res => {
                let resDistrict = res.data.data.data;
                data.districtData = resDistrict;
                if (data.district) {
                    let currentDistrict = resDistrict.filter((item) => {
                        return item.AREA_NAME == data.district
                    });
                    data.districtCode = currentDistrict[0].AREA_CODE;
                    getStreet();
                }
            })
            .catch(err => console.log(err));
    };
    /*获取街道*/
    const getStreet = () => {
        getCityPicker({type: 'street', area_code: data.districtCode})
            .then(res => {
                let resStreet = res.data.data.data;
                data.streetData = resStreet;
                if (data.street) {
                    let currentDistrict = resStreet.filter((item) => {
                        return item.STREET_NAME == data.street
                    });
                    data.streetCode = currentDistrict[0].STREET_CODE;
                }
            })
            .catch(err => console.log(err));
    };
    /*重置表单*/
    const resetFrom=(val)=>{
        const valJson={
            all:['province','city','district','street'],
            city:['city','district','street'],
            district:['district','street'],
            street:['street'],
        };
        valJson[val].forEach(item=>data[item]='');
    };

    return{
        data,
        getProvince,
        getCity,
        getDistrict,
        getStreet,
        resetFrom
    }
}