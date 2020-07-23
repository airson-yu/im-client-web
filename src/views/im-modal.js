/* eslint-disable no-unused-vars,no-empty */
/*import _ from "lodash";
import moment from 'moment';
import logger from "../tools/logger";
import bus from '../bus';
import Vue from 'vue'*/
import {mapActions, mapState, mapGetters} from 'vuex'; //注册 action 和 state
import IMTextRight from "../components/im-text-right.vue";
import IMTextLeft from "../components/im-text-left.vue";
import IMVoiceRight from "../components/im-voice-right.vue";
import IMVoiceLeft from "../components/im-voice-left.vue";
import IMImageRight from "../components/im-image-right.vue";
import IMImageLeft from "../components/im-image-left.vue";
import IMFileRight from "../components/im-file-right.vue";
import IMFileLeft from "../components/im-file-left.vue";
import res_avatar1 from '../assets/img/avatar1.png';
import res_file1 from '../assets/audio/alert.wav';

export default {
    name: 'IMModal',
    components: {
        IMTextRight, IMTextLeft, IMVoiceRight, IMVoiceLeft, IMImageRight, IMImageLeft, IMFileRight, IMFileLeft
    },
    data() {
        //return store.state
        return {
            main_modal_show: true,
            uname: "hello",
            my_name: '',
            my_avatar: res_avatar1,
            target_name: '',
            target_avatar: res_avatar1,
            res_avatar1: res_avatar1,
            res_file1: res_file1,
            im_split: 0.38,
            name_edit: false,
            im_type: 1,//1:voice,2text
            oper_type: 1,//1:折叠，2打开
            oper_panel: 1,
            text_content: '',
            im_list: [],
            tg_mem_list: [],
            ptt_on: false,
            ptt_send_ing: false,
            ptt_receive_ing: false,
            ptt_receive_uname: '',
            ptt_receive_avatar: '',
            ts_s: '',
            ts_r: '',
            ts_s_num: 0,
            cur_tgid: null,
            dcg: null,
            target: null,
            target_info: {},
            dcg_attached: false,
            dcg_attach_loading: false,
            tg_attached: false,
            tg_attached_uids: {},
            refid_obj: {},
            upload_param: '',
            video_conf_on: false,
            video_conf_on_not_join: false,
            video_conf_share_uid: null,
            //uname: this.username
        }
    },
    props: {
        /*value: {
            type: Boolean,
            default: false
        },*/
        //username: String
        id: {
            type: Number,
            default: 0
        },
        im_target_type: {
            type: Number,
            default: 0
        },
        init_param_obj: {
            type: Object,
            default: {}
        },

    },
    created: function () {
        //let that = this;
    },
    mounted: function () {
        //let that = this;
    },

    destroyed: function () {
        //let that = this;
    },

    methods: {
        on_hide_modal() {

        },
        on_visible_change() {

        },
        toggleEditName() {

        },
        toggleOperType() {

        },
        reqCallPTT() {

        },
        reqCall() {

        },
        reqPullVideoCall() {

        },
        justNoticeLocation() {

        },
        reqVideoCall() {

        },
        showIMModalUser() {

        },
        forceEnterGroup() {

        },
        forceLeaveGroup() {

        },
        toggleVideoConf() {

        },
        toggleType(){

        },
        sendIMMsg(){

        },
        reqPttOn(){

        },
        reqPttOff(){

        },
        showGrpMemAdd(){

        },
        showGrpMemRem(){

        },





        ...mapActions([
            'showIMModal', 'hideIMModal', 'showIMUserListModal', 'hideIMUserListModal', 'showVideoModal', 'hideVideoModal', 'updateVideoConf',
            'showVoiceConfirmModal', 'hideVoiceConfirmModal', 'showVoiceCallModal', 'hideVoiceCallModal',
            'showVideoCallModal', 'hideVideoCallModal', 'updateDcgAttached', 'resetDcgAttached'
        ]),
        // 使用对象展开运算符将 getter 混入 computed 对象中
        ...mapGetters([
            // ...
        ])
    },
    computed: {

        // 使用对象展开运算符将此对象混入到外部对象中
        ...
            mapState([
                // 映射 this.user_modal_show 为 store.state.user_modal_show
                //'user_modal_show'
            ]),
    },
    watch: {}
}