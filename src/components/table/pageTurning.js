import {reactive} from "@vue/composition-api";

export function pageTurning() {

    const pageData = reactive({
        pageSize:10,
        currentPage:1
    });


    //分页
    const handleSizeChange = (val) => {
       /* console.log(`每页 ${val} 条`);*/
        pageData.pageSize=val;
    };
    const handleCurrentChange = (val) => {
       /* console.log(`当前页: ${val}`);*/
        pageData.currentPage=val;
    };



    return {
        pageData,
        handleSizeChange,
        handleCurrentChange
    }
}