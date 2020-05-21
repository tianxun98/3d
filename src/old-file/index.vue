<template>
    <div class="index">
    </div>
</template>

<script>
    import {init} from "./init"
    export default {
        name: 'Home',
        data() {
            return{

            }
        },
        mounted() {
            init();
        }
    }
</script>
<style>
    .menu-item{
        padding: 10px !important;
    }
</style>
