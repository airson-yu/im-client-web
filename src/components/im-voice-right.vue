<template>
    <div class="sdk-im-voice-right">
        <div class="sdk-im-content">
            <div class="sdk-item-top">
                <span>{{ts}}</span>
                <span>{{uname}}</span>
            </div>
            <div class="sdk-item-content-right">
                <div @click="togglePlayVoice" class="sdk-message">
                    <div class="sdk-box-right">
                        <div class="sdk-wifi-symbol-right">
                            <div class="sdk-wifi-circle sdk-first"></div>
                            <div v-bind:class="playing ? 'sdk-second-active' : 'sdk-second'" class="sdk-wifi-circle"></div>
                            <div v-bind:class="playing ? 'sdk-third-active' : 'sdk-third'" class="sdk-wifi-circle"></div>
                        </div>
                    </div>
                    <span class="sdk-voice-dur-right">{{duration}}</span>
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
    import bus from '../bus';

    export default {
        name: 'IMVoiceRight',
        data() {
            //return store.state
            return {playing: this.init_playing}
        },
        props: {
            /*value: {
                type: Boolean,
                default: false
            },
            username: String*/
            refid: {
                type: Number,
                default() {
                    return 0;
                }
            },
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
            duration: {
                type: String,
                default() {
                    return '00:00';
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
            init_playing: {
                type: Boolean,
                default() {
                    return false;
                }
            },
        },
        created: function () {
            let that = this;
            let client_id = that.target;
            that.ptt_status_replay_im_right_evt_id = 'ptt-status-replay-im-right-' + client_id;
            if (!client_id) { // XXX 有为0的情况
                return;
            }
            bus.$on(that.ptt_status_replay_im_right_evt_id, (rsp) => {
                let refid = rsp.refid;
                if (refid != that.refid || rsp.tgid != that.target) {
                    return;
                }
                //logger.debug('evt right ptt-status-replay-im-right:{}', that.refid);
                if (rsp.state === 0) {
                    this.playing = true;
                } else {
                    this.playing = false;
                }
            });
        },
        destroyed: function () {
            let that = this;
            //let root = that.$root;
            bus.$off(that.ptt_status_replay_im_right_evt_id);
        },
        methods: {
            togglePlayVoice() {
                if (!this.init_playing) {
                    let state = 0;
                    if (this.playing) {
                        state = 1;
                    }
                    this.playing = !this.playing;
                    // TODO req_ptt_replay
                    let tgid = this.target;
                    let refid = this.refid;
                    //refid = 170393064;
                    window.websdk.request.voiceRequest.pttReplay(tgid, refid, state, function (rsp) {
                        //logger.debug('req_ptt_replay_right result:{}', rsp);
                    }, 'req_ptt_replay_right');//

                    // 全局统一监听 notice_ptt_replay
                    // 在store中全局缓存voice_list，然后更新对应的条目的playing状态

                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped src="../assets/css/im-comp.less"></style>




