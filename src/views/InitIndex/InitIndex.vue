<template>
    <div id="initIndex" :class="{ open:isOpen}">
        <initHeader/>
        <initMain/>
        <initMenu/>
    </div>
</template>

<script>
    import initMenu from "./components/InitIndex-menu";
    import initHeader from "./components/InitIndex-header";
    import initMain from "./components/InitIndex-main"

    import { computed } from "@vue/composition-api"
    export default {
        name: "InitIndex",
        components:{
            initHeader,
            initMain,
            initMenu
        },
        setup(props,{root}){
            const isOpen=computed(()=>root.$store.state.app.isCollapse);
            return {
                isOpen
            }
        }

    }
</script>

<style scoped lang="scss">

</style>