<template>
    <div id="menu">
        <img src="../../../assets/logo.png" alt="" class="logo">
        <el-menu default-active="1-4-1"
                 class="el-menu-vertical-demo"
                 :collapse="Collapse"
                 background-color="transparent"
                 text-color="#fafbfb"
                 router>
            <template v-for="(item,index) in routers">
                <el-submenu :index="index.toString()" v-if="item.meta.show" :key="item.id">
                    <!--一级菜单-->
                    <template slot="title">
                        <!--<i class="el-icon-location"></i>-->
                        <iconSvg :iconClass="item.meta.icon" :className="item.meta.icon"/>
                        <span slot="title">{{item.meta.title}}</span>
                    </template>
                    <!--二级菜单-->
                    <el-menu-item-group v-for="(itemChild,indexChild) in item.children" :key="itemChild.id">
                        <el-menu-item
                                :index="itemChild.path">{{itemChild.meta.title}}
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </template>
        </el-menu>
    </div>
</template>

<script>
    //引入 variable 这个scss文件,里面存放着变量
    import "styles/variable.scss";
    // 按需 调用 vue3.0 的api接口
    import {ref, reactive, computed} from "@vue/composition-api";

    export default {
        name: "InitIndex-menu",
        //使用 3.0 中 setup生命周期函数
        setup(props, {root}) {
            //(element ui 中的变量 )控制 一级菜单是否默认展开
            const Collapse = computed(() => {
                return root.$store.state.app.isCollapse;
            });
            //(root.$router 查看vue实例的路由) 将实际的路由的各种参数存放到一个变量中
            const routers = reactive(root.$router.options.routes);
            //console.log(routers);


            return {
                Collapse,
                routers,
            }
        }
    }
</script>

<style scoped lang="scss">
    /*@import "styles/myElementStyle";*/
    .open #menu {
        width: $menu-changeW !important;

        .logo {
            @include compatibility(transform, scale(.7));
            margin: 28px 0 0 !important;
        }
    }

    #menu {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        width: $menu-w;
        background-color: #344a5f;
        font-size: 15px;
        @include compatibility(transition, all .5s ease);

        .logo {
            width: 70px;
            height: 63px;
            margin: 28px 90px 0;
            @include compatibility(transition, all .5s ease);

        }

        /deep/ svg {
            fill: currentColor;
            color: #ffffff;
            position: absolute;
            top: 52%;
            left: 23px;
            transform: translateY(-50%);
        }

        .el-menu {
            border-right: none;
        }

        .el-menu-vertical-demo:not(.el-menu--collapse) {
            width: $menu-w;
            min-height: $menu-w;
        }

        .el-menu--collapse {
            width: 75px;
        }

        /deep/ .el-submenu__title {
            padding-left: 54px !important;

            &:hover {
                background-color: $main-bgc !important;
            }
        }

        /deep/ .el-submenu__title * {
            vertical-align: inherit !important;
        }

        /deep/ .el-menu-item-group__title {
            padding: 0 !important;

        }

        /deep/ .el-menu-item {
            padding-left: 54px !important;
            background-color: $mainThree-bgc !important;

            &.is-active {
                color: $menu-fontC;
                background-color: $mainSecond-bgc !important;
            }
        }

        /deep/ .is-opened {
            &.is-active {
                .el-submenu__title {
                    background-color: $main-bgc !important;
                }
            }
        }

        /deep/ .el-submenu.is-active .el-submenu__title {
            border-bottom-color: transparent !important;
        }


    }

    .el-menu--vertical {


        ::v-deep .el-menu{

        }
        ::v-deep .el-menu--popup{
            padding:0!important;
        }
        ::v-deep .el-menu--popup-right-start{
            margin-left:0!important;
            margin-right:0!important;

        }

        .el-menu-item-group {
            padding: 0 !important;

            ::v-deep .el-menu-item-group__title {
                padding: 0 !important;
            }

            .el-menu-item {
                line-height: 56px !important;
                background-color: $mainThree-bgc !important;
            }

            .el-menu-item:hover {
                background-color: $mainSecond-bgc !important;
            }

            .el-menu-item.is-active {
                color: $main-bgc !important;
            }
        }



    }


</style>