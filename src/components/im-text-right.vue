<template>
    <div class="sdk-im-text-right">
        <div class="sdk-im-content">
            <div class="sdk-item-top">
                <span>{{ts}}</span>
                <span>{{uname}}</span>
            </div>
            <!--<div class="sdk-item-content">
                &lt;!&ndash;<span class="sdk-message">{{content}}</span>&ndash;&gt;
                <span class="sdk-message">content</span>
                <div class="sdk-right-angle sdk-right-text-angle"></div>
            </div>-->
            <div class="sdk-item-content-right">
                <div class="sdk-message">
                    <span>{{content}}</span>
                </div>
                <div class="sdk-right-angle"></div>
            </div>
        </div>
        <div class="sdk-avatar">
            <Avatar size="large" class="" :src="avatar"/>
        </div>
    </div>
</template>

<script>
    import res_avatar1 from '../assets/img/avatar1.png';

    export default {
        name: 'IMTextRight',
        data() {
            //return store.state
            return {
                //res_avatar1: res_avatar1
            }
        },
        props: {
            /*value: {
                type: Boolean,
                default: false
            },
            username: String*/
            ts: {
                type: String,
                default() {
                    return '00:00:00';
                }
            },
            uname: {
                type: String,
                default() {
                    return '';
                }
            },
            content: {
                type: String,
                default() {
                    return '';
                }
            },
            avatar: {
                type: String,
                default() {
                    return res_avatar1;
                }
            },
            target: {
                type: Number,
                default() {
                    return 0;
                }
            },
        },
        methods: {},
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped src="../assets/css/im-comp.less"></style>



