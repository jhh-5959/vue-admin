<template>
    <div id="header">
        <div class="icon-menu" @click="toggleMenu"><iconSvg class-name="menu" icon-class="menu" /></div>
        <div class="admin">
            <el-row class="demo-avatar demo-basic">
                <el-col :span="12">
                    <div class="demo-basic--circle">
                        <div class="block">
                            <el-avatar shape="circle" :size="40" :src="squareUrl"></el-avatar>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <span>{{userName}}</span>
        </div>
        <div class="icon-open" @click="logoutClick"><iconSvg class-name="open" icon-class="open" /></div>
    </div>
</template>

<script>
    import "styles/variable.scss";
    import {ref,reactive,computed}from "@vue/composition-api";
    export default {
        name: "InitIndex-header",
        setup(props,{root}){
            const squareUrl=ref(require('../../../assets/headPortrait.jpg'));
            const sizeList=reactive(["small"]);
            const toggleMenu=()=>{
                /*console.log(root.$store);*/
                root.$store.commit("app/CHANGE_COLLAPSE");
               /* root.$store.commit('SETSTATE');
                root.$store.commit('SETSTATE2',{a:100,b:300});*/
                /*root.$store.commit({type:'SETSTATE3',a:100,b:300});*/

            };
            const userName=computed(()=>{
                return root.$store.state.app.userName
            });

            const logoutClick=()=>{
                root.$store.dispatch('app/logout').then(res=>{
                    if (!res.code){
                        root.$message({
                            type:'success',
                            message:res.message
                        });
                    }

                });
                root.$router.replace('/login');
            };


           /* root.$store.getters.fn1;
            root.$store.getters.fn2;
            console.log(root.$store.getters.fn3(10));*/
           /* root.$store.getters.ABC;*/




            return{
                squareUrl,
                sizeList,
                userName,
                toggleMenu,
                logoutClick
            }
        }


    }
</script>

<style scoped lang="scss">
    .open{
        #header{
            left: $menu-changeW;

        }
    }
    #header {
        position: fixed;
        height: $header-h;
        left: $menu-w;
        top: 0;
        right: 0;
        background-color: #fff;
        -webkit-box-shadow: 0 3px 16px 0 rgba(0, 0, 0, .1);
        z-index: 2;
        @include compatibility(transition,all .5s ease);
        .admin{
            position: absolute;
            right: 76px;
            padding: 20px 22px 20px 0;
            height: $header-h;

            border-right: 1px solid #ededed;
            -webkit-box-sizing: border-box;
            >div{
                margin-right: 20px;
                display: inline-block;
                cursor: pointer;
                img{

                }
            }
            >span{
                position: relative;
                top: -50%;
                line-height: $header-h;
                font-size: 14px;
                color: #252525;
                cursor: pointer;

            }
        }
        .icon-menu,.icon-open{
            display: inline-block;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
        }
        .icon-menu{
            width: 22px;
            height: 17px;
            left: 32px;
        }
        .icon-open{
            width: 18px;
            height: 18px;
            right: 29px;
        }
    }
</style>