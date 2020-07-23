<template>
    <div id="app">
        <!--<img alt="Vue logo" src="./assets/logo.png">-->
        <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
        <IMModal v-show="true" :id="1" :im_target_type="1" :init_param_obj="{}"></IMModal>
    </div>
</template>

<script>
    //import im from './components/im.vue'
    import IMModal from "./views/im-modal.vue";

    export default {
        name: 'app',
        components: {
            IMModal
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        position: absolute;
        bottom: 0px;
        left: 24%;
    }
</style>
