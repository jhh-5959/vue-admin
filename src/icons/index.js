import Vue from "vue";
//导入 iconsvg 模板文件
import iconsvg from "./iconsvg"

//自定义 component 全局组件
Vue.component('iconSvg',iconsvg);
//解析svg文件
//require.context 读取指定目录的所有文件
// 参数1:指定目录,
// 参数2:是否遍历子目录,
// 参数3:定义遍历的规则
const req = require.context('./svg', false, /\.svg$/);
const requireAll = requireContext => {
    return requireContext.keys().map(requireContext)
};
//将所有的svg文件都映射出来
requireAll(req);
