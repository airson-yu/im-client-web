<template>
    <div class="sdk-im-text-right">
        <div class="sdk-im-content">
            <div class="sdk-item-top">
                <span>{{ts}}</span>
                <span>{{uname}}</span>
            </div>
            <div class="sdk-item-content-right">
                <div class="sdk-message sdk-msg-file-right">
                    <div class="sdk-im-file-icon-div-right">
                        <div class="sdk-im-file-icon">
                            <Icon :size=40 type="ios-folder-outline"/>
                        </div>
                    </div>
                    <div class="sdk-im-file-name-div-right">
                        <div class="sdk-im-file-name-right"><a :href=content :download=file_name class="sdk-im-file-name" target="_blank">{{file_name}}</a>
                        </div>
                    </div>
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
        name: 'IMFileRight',
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
            file_name: {
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
            /*downloadFile(url) {
                this.$store.dispatch('showIMImageModal', {'url': url}).then(null);
            }*/
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped src="../assets/css/im-comp.less"></style>



