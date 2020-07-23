<template>
    <div class="sdk-im-text-left">
        <div class="sdk-avatar">
            <Avatar size="large" class="" :src="avatar"/>
        </div>
        <div class="sdk-im-content">
            <div class="sdk-item-top">
                <span>{{ts}}</span>
                <span>{{uname}}</span>
            </div>
            <div class="sdk-item-content">
                <div class="sdk-left-angle"></div>
                <div class="sdk-message sdk-msg-img" @click="showImageModal(url_large)">
                    <img class="sdk-im-image" :src="url_small"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import res_avatar1 from '../assets/img/avatar1.png';

    export default {
        name: 'IMImageLeft',
        data() {
            //return store.state
            return {}
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
            url_small: {
                type: String,
                default() {
                    return '';
                }
            },
            url_large: {
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
        methods: {
            showImageModal(url) {
                this.$store.dispatch('showIMImageModal', {'url': url}).then(null);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped src="../assets/css/im-comp.less"></style>


