<template>
    <div id="main">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"/>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"/>
    </div>
</template>

<script>
    import "styles/variable.scss";

    export default {
        name: "InitIndex-main"
    }
</script>

<style scoped lang="scss">
    .open #main {
        left: $menu-changeW;
    }

    #main {
        position: fixed;
        left: $menu-w;
        top: $header-h;
        bottom: 0;
        right: 0;
        border: 30px solid #f7f7f7;
        border-bottom: none;
        padding: 30px;
        @include compatibility(box-sizing, border-box);
        @include compatibility(transition, all .5s ease);
    }
</style>