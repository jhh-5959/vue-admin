/*import login from "../views/Login/Login";
import initIndex from "../views/InitIndex/InitIndex";
import console from "../views/Console/Console";
import infoClass from "../views/Info/InfoClass";
import infoList from "../views/Info/InfoList";
import userList from "../views/User/UserLIst"*/
/*路由懒加载*/
const login = () => import("../views/Login/Login");
const initIndex = () => import("../views/InitIndex/InitIndex");
const console = () => import("../views/Console/Console");
const infoClass = () => import("../views/Info/InfoClass");
const infoList = () => import("../views/Info/InfoList");
const infoDetail = () => import("../views/Info/infoDetail");
const userList = () => import("../views/User/UserLIst");
const page404 = () => import("../views/page404");


/*角色管理
* 业务员,技术员,部门经理
*
* */

/*默认路由---初始化都有的路由*/
export const defaultRouter = [
    // 根目录 默认重定向至/login 页面
    {
        path: "/",
        redirect: "/login",
        show: false,
        meta: {
            title: "根目录",
        }
    },
    //路径/login 使用 login组件
    {
        path: "/login",
        component: login,
        show: false,
        meta: {
            title: "登录",
        }
    },
    //  路径 /initIndex
    //  重定向至  子路由 /initIndex/console 页面
    //  使用 linitIndex组件
    {
        path: "/initIndex",
        component: initIndex,
        redirect: "/console",
        meta: {
            title: "控制台",
            show: true,
            icon: "console",
        },
        //子路由
        children: [
            {
                path: "/console",
                component: console,
                meta: {
                    title: "首页",
                    show:true,
                }
            }
        ],

    },
]
;


//配置路由
export const routes = defaultRouter;

/*动态路由---不同权限不同路由*/
export const dynamicRoutes = [
    //信息
    {
        //相同的父路由
        //不同的子路由
        //子路由放置在 InitIndex-main 的 <router-view/> 中
        /*path: "/initIndex",*/
        path: "/info",
        component: initIndex,
        redirect: '/infoList',
        meta: {
            title: "信息管理",
            show: true,
            icon: "info",
            power: "infoSystem",
            role: ['业务员', '技术员'],
            keepAlive: true,
        },
        children: [
            {
                path: "/infoList",
                component: infoList,
                meta: {
                    title: "信息列表",
                    show: true,
                    role: ['业务员', '技术员'],
                    keepAlive: true,
                }
            },
            {
                path: "/infoClass",
                component: infoClass,
                meta: {
                    title: "信息分类",
                    show: true,
                    role: ['业务员', '技术员'],
                    keepAlive: true,
                }
            },
            {
                path: "/infoDetail",
                /*name: "infoDetail",*/
                component: infoDetail,
                meta: {
                    title: "信息详情",
                    show: false,
                    role: ['业务员', '技术员'],
                    keepAlive: true,
                }
            }

        ],
    },


    //用户
    {
        path: "/user",
        redirect: '/userList',
        component: initIndex,
        meta: {
            title: "用户管理",
            show: true,
            icon: "user",
            power: "userSystem",
            role: ['技术员'],
            keepAlive: true,
        },
        children: [
            {
                path: "/userList",
                component: userList,
                meta: {
                    title: "用户分类",
                    show: true,
                    role: ['技术员'],
                    keepAlive: true,
                }
            }
        ],
    },

    // 404页面
    {
        path: '*',
        reactive: '/404',
        meta: {
            title: "404",
            show:false,
            icon: "console",
        },
        component:page404
    },
    ];


