<template>
        <svg :class="svgClass" aria-hidden="true">
            <use :xlink:href="iconName"></use>
        </svg> 
</template>

<script>
    import {ref, computed} from "@vue/composition-api"

    export default {
        name: "iconsvg",
        props: {
            iconClass: {
                type: String,
                default: '',
            },
            className: {
                type: String,
                default: ''

            }
        },
        /*props:['iconClass','className'],*/
        setup(props) {
            const msg = ref('你好');

            const iconName = computed(() => `#icon-${props.iconClass}`);
            const svgClass = computed(() => {
                if (props.className) {
                    return `svg-icon ${props.iconClass}`
                } else {
                    return `svg-icon`
                }
            });

            return {
                msg,
                iconName,
                svgClass
            }
        }
    }
</script>

<style scoped lang="scss">
        .svg-icon {
            width: 1em;
            height: 1em;
            font-size: 20px;
        }

</style>