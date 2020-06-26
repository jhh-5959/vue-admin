/*import login from "../views/Login/Login";
import initIndex from "../views/InitIndex/InitIndex";
import console from "../views/Console/Console";
import infoClass from "../views/Info/InfoClass";
import infoList from "../views/Info/InfoList";
import userList from "../views/User/UserLIst"*/
/*路由懒加载*/
const login =()=>import("../views/Login/Login");
const initIndex=()=>import("../views/InitIndex/InitIndex");
const console=()=>import("../views/Console/Console");
const infoClass=()=>import("../views/Info/InfoClass");
const infoList=()=>import("../views/Info/InfoList");
const infoDetail=()=>import("../views/Info/infoDetail");
const userList=()=>import("../views/User/UserLIst");

//配置路由
export const routes = [
    {
        // 根目录 默认重定向至/login 页面
        path: "/",
        redirect: "/login",
        show: 0,
        meta: {
            title: "根目录"
        }
    },
    {
        //  路径/login 使用 login组件
        path: "/login",
        component: login,
        show: 0,
        meta: {
            title: "登录"
        }
    },
    {
        //  路径 /initIndex
        //  重定向至  子路由 /initIndex/console 页面
        //  使用 linitIndex组件
        path: "/initIndex",
        component: initIndex,
        redirect: "/console",
        //子路由
        children: [
            {
                path: "/console",
                component: console,
                meta: {
                    title: "首页",
                    show: 1,
                }
            }
        ],
        meta: {
            title: "控制台",
            show: 1,
            icon:"console"
        }
    },
    {
        //相同的父路由
        //不同的子路由
        //子路由放置在 InitIndex-main 的 <router-view/> 中
        path: "/initIndex",
        component: initIndex,
        children: [
            {
                path: "/infoList",
                component: infoList,
                meta: {
                    title: "信息列表",
                    show: 1,
                }
            },
            {
                path: "/infoClass",
                component: infoClass,
                meta: {
                    title: "信息分类",
                    show: 1
                }
            },
            {
                path: "/infoDetail",
                name:"infoDetail",
                component: infoDetail,
                meta: {
                    title: "信息详情",
                    show: 0,
                }
            }

        ],
        meta: {
            title: "信息管理",
            show: 1,
            icon:"info"
        }
    },
    {
        //相同的父路由
        //不同的子路由
        //子路由放置在 InitIndex-main 的 <router-view/> 中
        path: "/initIndex",
        component: initIndex,
        children: [
            {
                path: "/userList",
                component: userList,
                meta: {
                    title: "用户分类",
                    show: 1,
                }
            }
        ],
        meta: {
            title: "用户管理",
            show: 1,
            icon:"user"
        }
    },
];