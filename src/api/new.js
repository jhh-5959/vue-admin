import server from '@/tools/interceptor';
/*获取分类信息*/

/*/news/getCategory/ （无子级分类）
/news/getCategoryAll/ （有子级分类）*/
export function getCategoryAll(data) {
    return server.request({
        method: 'post',
        url: '/news/getCategoryAll/',
        data
    })
}


/*添加一级分类*/
export function addFirstCategory(data) {
    return server.request({
        method: 'post',
        url: '/news/addFirstCategory/',
        data
    })
}

/*添加二级分类*/
/*	/news/addChildrenCategory/ */
export function addChildrenCategory(data) {
    return server.request({
        method:'post',
        url:'/news/addChildrenCategory/',
        data
    });
}

/*删除一级分类*/
export function deleteCategory(data) {
    return server.request({
        method: 'post',
        url: '/news/deleteCategory/',
        data
    });

}

/*编辑一级分类*/
export function editCategory(data) {
    return server.request({
        method: 'post',
        url: '/news/editCategory/',
        data
    });
}


/*获取信息列表*/
export function getList(data) {
    return server.request({
        method:'post',
        url:'/news/getList/',
        data
    });
}


/*添加信息*/
export function newsAdd(data) {
    return server.request({
        method: 'POST',
        url: '/news/add/',
        data
    });
}

/*删除信息*/
export function deleteInfo(data) {
    return server.request({
        method:'post',
        url:'/news/deleteInfo/',
        data
    });
}
/*编辑信息*/
export function editInfo(data) {
    return server.request({
        method:'post',
        url:'/news/editInfo/',
        data
    })
}
