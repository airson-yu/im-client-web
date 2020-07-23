<template>
    <Modal v-model="im_image_modal_show" class="sdk-user-modal sdk-im-image-modal" draggable scrollable width="auto" title="图片浏览窗口"
           :z-index=2000 :footer-hide=true>
        <div class="sdk-im-image-modal">
            <img :src="url" style="max-width: 800px;max-height: 700px;"/>
        </div>
    </Modal>
</template>

<script>
    import {mapActions} from 'vuex'; //注册 action 和 state

    export default {
        name: 'IMImageModal',
        data() {
            return {
                //res_avatar1: res_avatar1
            }
        },
        props: {
            url: {
                type: String,
                default() {
                    return '';
                }
            },
        },
        methods: {
            on_hide_modal() {// XXX 当modal窗口发起$emit事件通知窗口关闭时，这里继续通知App.vue窗口已经关闭
                this.hideIMImageModal();
            },

            ...mapActions([
                'hideIMImageModal'
            ]),
        },
        computed: {
            im_image_modal_show: {
                get() {
                    return this.$store.state.im_image_modal_show;
                },
                set(value) {
                    if (value) {
                        this.$store.dispatch('showIMImageModal', {'url': this.url}).then(null);
                    } else {
                        this.$store.dispatch('hideIMImageModal').then(null);
                    }
                }
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped src="../assets/css/im-comp.less"></style>



