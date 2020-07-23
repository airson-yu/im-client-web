import Vue from 'vue'
import Vuex from "vuex";
import logger from "./tools/logger";

Vue.use(Vuex);

//https://blog.csdn.net/mrzhangdulin/article/details/98344743
const getDefaultState = () => {
    return {
        im: {
            65538: {
                id: 65538,
                type: 1,//1个人窗口，2群组窗口
                tg_member:[],//群组成员
                info: {
                    display_name: 'test',
                },
                main_modal_show: true,
                user_list_modal_show: false,
                voice_call_modal_show: false,
                voice_confirm_modal_show: false,
                voice_modal_show: false,
                video_modal_show: false
            }
        },
        im_image_modal_show: false,
        im_image_modal_url: '',
        group_create_modal_show: false,
        cur_dcg_attached_uid: null,
        ptt_confirm_attached: null,
        video: {},
        video_conf: {},
        login_user: {/*id: 68508, img_url: null, display_name: 'testcon'*/},
        voice_call: {
            modal_show: false,
            target: 0,
            uname: '',
            avatar: '',
            status: 0,
            target_info: {},
        },
        voice_confirm: {
            modal_show: false,
            target: 0,
            uname: '',
            avatar: '',
            status: 0,
            target_info: {},
        },
        voice_ptt_confirm: {
            modal_show: false,
            target: 0,
            uname: '',
            avatar: '',
            status: 0,
            target_info: {},
        },
        video_call: {
            /*url_local: null,
            ws_local: null,
            url_remote: null,
            ws_remote: null,*/
            modal_show: false,
            target: 0,
            uname: '',
            is_con: false,
            avatar: '',
            status: 0,
            target_info: {},
        },
        video_confirm: {
            modal_show: false,
            target: 0,
            uname: '',
            avatar: '',
            status: 0,
            target_info: {},
        },
        // old below

        /*user_modal_show: false,
        user: {},
        group_modal_show: false,
        group: {},
        voice_modal_show: false,
        video_modal_show: false*/
    }
}

export default new Vuex.Store({
    state: getDefaultState(),
    getters: {
        /*getUserModalShow: state => {
            return state.user_modal_show;
        }*/
        getCurrentVideoList: state => {
            /*let video  = state.video;
            let uidList = Object.keys(video);*/
            //return _.clone(state.video);
            //return Object.keys(state.video);

            let uidStrList = Object.keys(state.video);
            let uidList = new Array(uidStrList.length);
            if (uidStrList.length > 0) {
                for (let i in uidStrList) {
                    uidList[i] = parseInt(uidStrList[i]);
                }
            }
            return uidList;
        }
    },
    mutations: {
        resetState: (state) => {
            /*window.websdk.vm.$destroy();
            document.getElementById('sdk_webapp').innerHTML = '';*/

            /*for (let im_idx in state.im) {
                Vue.delete(state.im, im_idx);
            }
            for (let video_idx in state.video) {
                Vue.delete(state.video, video_idx);
            }
            for (let vconf_idx in state.video_conf) {
                Vue.delete(state.video_conf, vconf_idx);
            }*/

            let initialState = getDefaultState();
            for (let f in state) {
                Vue.set(state, f, initialState[f])
            }
            Object.assign(state, initialState);

            //https://github.com/vuejs/vuex/issues/1118

            /*
            this.$store.replaceState(Object.assign({}, getDefaultState()));*/

            /*let initialState = getDefaultState();
            for (let f in state) {
                Vue.set(state, f, initialState[f])
            }*/
            /*Object.keys(initialState).forEach(key => {
                Object.assign(state[key], initialState[key])
            })*/
        },
        showIMModal: (state, target) => {
            if (!target) {
                return false;
            }

            // XXX 需要检查窗口是否已经开启，如果已经开启并且不是reload，就略过。
            if (!target.reload) {
                let id = target.id || target.uid;
                /*_.forEach(state.im, function (data, key) {
                    if (data && data.id === id) {
                        logger.debug('showIMModal ignore:{}', id);
                        return;
                    }
                });*/
                let data = state.im[id];
                if (data) {
                    logger.debug('showIMModal ignore:{}', id);
                    return;
                }
            }

            let type = target.im_target_type;
            let init_param_obj = target.init_param_obj;
            if (!init_param_obj) {
                init_param_obj = {'attached': false, 'force_call': false};
            }

            let obj = {
                id: null,
                type: 0,//1个人窗口，2群组窗口, 0未知
                info: null,
                main_modal_show: true,
                user_list_modal_show: false,
                init_param_obj: init_param_obj,
                //voice_call_modal_show: false,
                //voice_confirm_modal_show: false,
                //voice_modal_show: false,
                //video_modal_show: false
            };

            if (target.reload) {
                //let that = this;
                if (type === 1) {
                    let id = target.id || target.uid;
                    window.websdk.request.userRequest.getUserInfo([id], null, function (rsp) {
                        if (!rsp.user_info) {
                            return;
                        }
                        let target = rsp.user_info[0];
                        obj.id = target.uid;
                        obj.name = target.display_name;
                        obj.im_target_type = 1;
                        obj.info = target;
                        let id = obj.id;
                        /*_.forEach(state.im, function (data, key) {
                            if (data && data.id === id) {
                                state.im.splice(key, 1);
                            }
                        });
                        state.im.push(obj);*/
                        //state.im[id] = obj; // Vue 不能检测对象属性的添加或删除
                        Vue.delete(state.im, id);
                        Vue.set(state.im, id, obj);
                    }, 'store_im_req_user_profile');//
                } else if (type === 2) {
                    let id = target.id || target.uid;
                    window.websdk.request.groupRequest.getGroupInfo([id], function (rsp) {
                        if (!rsp.group_info) {
                            return;
                        }
                        let target = rsp.group_info[0];
                        obj.id = target.tgid;
                        obj.name = target.tg_name;
                        obj.im_target_type = 2;
                        obj.info = target;
                        let id = obj.id;
                        /* _.forEach(state.im, function (data, key) {
                             if (data && data.id === id) {
                                 state.im.splice(key, 1);
                             }
                         });
                         state.im.push(obj);*/
                        //state.im[id] = obj; // Vue 不能检测对象属性的添加或删除
                        Vue.delete(state.im, id);
                        Vue.set(state.im, id, obj);
                    }, 'store_im_req_grp_profile');//
                }
            } else {
                obj.id = target.uid;
                obj.name = target.display_name;
                obj.im_target_type = 1;
                obj.info = target;
                if (target.tgid) {
                    obj.id = target.tgid;
                    obj.name = target.tg_name;
                    obj.im_target_type = 2;
                }

                let id = obj.id;
                /*_.forEach(state.im, function (data, key) {
                    if (data && data.id === id) {
                        state.im.splice(key, 1);
                    }
                });
                state.im.push(obj);*/
                //state.im[id] = obj; // Vue 不能检测对象属性的添加或删除
                Vue.delete(state.im, id);
                logger.debug('showIMModal state');
                Vue.set(state.im, id, obj);

            }
        },
        hideIMModal: (state, id) => {
            if (!id) {
                return false;
            }

            /*_.forEach(state.im, function (data, key) {
                if (data && data.id === id) {
                    state.im.splice(key, 1);
                    return;
                }
            });*/

            let data = state.im[id];
            if (data) {
                //delete state.im[id];
                Vue.delete(state.im, id);
            }

            /*let obj = state.im[id];
            obj.main_modal_show = false;
            obj.voice_call_modal_show = false;
            obj.voice_confirm_modal_show = false;
            obj.voice_modal_show = false;
            obj.video_modal_show = false;*/
        },

        showIMImageModal: (state, target) => {
            if (target.url) {
                state.im_image_modal_url = target.url;
            }
            state.im_image_modal_show = true;
        },

        hideIMImageModal: (state) => {
            state.im_image_modal_show = false;
        },

        showVideoModal: (state, target) => {
            if (!target) {
                return false;
            }

            let obj = {
                id: null,
                type: target.type || 0,//1pull，2push, 0未知
                info: null,
                main_modal_show: true,
                url: target.url,
                resolution: target.resolution,
                channel: target.channel,
                playid: target.playid,
            };

            if (target.reload) {
                //let that = this;
                let id = target.id || target.uid;
                window.websdk.request.userRequest.getUserInfo([id], null, function (rsp) {
                    if (!rsp.user_info) {
                        return;
                    }
                    let target = rsp.user_info[0];
                    obj.id = target.uid;
                    obj.name = target.display_name;
                    obj.info = target;
                    let id = obj.id;
                    /*_.forEach(state.video, function (data, key) {
                        if (data && data.id === id) {
                            state.video.splice(key, 1);
                        }
                    });
                    state.video.push(obj);*/
                    //state.video[id] = obj; // Vue 不能检测对象属性的添加或删除
                    //delete state.video[id];
                    Vue.delete(state.video, id);
                    Vue.set(state.video, id, obj);
                }, 'store_video_req_user_profile');//
            } else {
                obj.id = target.uid;
                obj.name = target.display_name;
                obj.info = target;

                let id = obj.id;
                /*_.forEach(state.video, function (data, key) {
                    if (data && data.id === id) {
                        state.video.splice(key, 1);
                    }
                });
                state.video.push(obj);*/
                //state.video[id] = obj; // Vue 不能检测对象属性的添加或删除
                Vue.delete(state.video, id);
                Vue.set(state.video, id, obj);
                //https://cn.vuejs.org/v2/guide/list.html

            }
        },
        setVideoWS: (state, target) => {
            let id = target.id;
            let ws = target.ws;

            /*_.forEach(state.video, function (data, key) {
                if (data && data.id === id) {
                    data.ws = ws;
                }
            });*/

            let data = state.video[id];
            if (data) {
                data.ws = ws;
            }

        },
        hideVideoModal: (state, id) => {
            if (!id) {
                return false;
            }

            /*_.forEach(state.video, function (data, key) {
                if (data && data.id === id) {
                    if (data.ws && data.ws.established) {
                        data.ws.destroy();
                        data.ws = null;
                    }
                    state.video.splice(key, 1);
                    return;
                }
            });*/

            let data = state.video[id];
            if (data) {
                if (data.ws && data.ws.established) {
                    data.ws.destroy();
                    data.ws = null;
                }
                //delete state.video[id];
                Vue.delete(state.video, id);
            }

        },

        updateVideoConf: (state, data) => {
            if (!data) {
                return false;
            }
            // data:{tgid, type}
            let tgid = data.tgid;

            if (data.type == 'start') {
                state.video_conf[tgid] = true;

            } else if (data.type == 'stop') {
                state.video_conf[tgid] = false;
            }
        },

        // eslint-disable-next-line no-unused-vars
        updateVideoStatus: (state, target) => {
            //
        },
        showIMUserListModal: (state, target) => {
            let id = target.id;
            if (!id) {
                return false;
            }
            /*_.forEach(state.im, function (data, key) {
                if (data && data.id === id) {
                    state.im[key].user_list_modal_show = true;
                    state.im[key].oper_type = target.oper_type;
                    return;
                }
            });*/
            let data = state.im[id];
            if (data) {
                data.user_list_modal_show = true;
                data.oper_type = target.oper_type;
                return;
            }
        },
        hideIMUserListModal: (state, id) => {
            if (!id) {
                return false;
            }
            /*_.forEach(state.im, function (data, key) {
                if (data && data.id === id) {
                    state.im[key].user_list_modal_show = false;
                    return;
                }
            });*/
            let data = state.im[id];
            if (data) {
                data.user_list_modal_show = false;
                return;
            }
        },
        // eslint-disable-next-line no-unused-vars
        showGroupCreateModal: (state, target) => {
            state.group_create_modal_show = true;
        },
        // eslint-disable-next-line no-unused-vars
        hideGroupCreateModal: (state, id) => {
            state.group_create_modal_show = false;
        },
        showVoiceConfirmModal: (state, target) => {
            state.voice_confirm.modal_show = true;
            if (!target) {
                return false;
            }
            let id = target.id;
            /*_.forEach(state.im, function (data, key) {
                if (data && data.id === id) {
                    state.voice_confirm.target = id;
                    state.voice_confirm.target_info = data.info;
                    state.voice_confirm.uname = data.info.display_name;
                    state.voice_confirm.avatar = data.info.img_url;
                    state.voice_confirm.status = target.status;
                    state.voice_confirm.modal_show = true;
                    logger.debug('store showVoiceConfirmModal:{}', id);
                    return true;
                }
            });*/

            // check pstn, pstn的uid是虚拟的，只用显示电话号码 2020年4月15日13:53:12
            if (target.pstn_telno) {
                state.voice_confirm.target = id || 0;
                state.voice_confirm.uname = target.pstn_telno;
                state.voice_confirm.status = target.status;
                state.voice_confirm.modal_show = true;
                logger.debug('store pstn showVoiceConfirmModal:{}-{}', id, target.pstn_telno);
                return true;
            }

            let data = state.im[id];
            if (data) {
                state.voice_confirm.target = id;
                state.voice_confirm.target_info = data.info;
                state.voice_confirm.uname = data.info.display_name;
                state.voice_confirm.avatar = data.info.img_url;
                state.voice_confirm.status = target.status;
                state.voice_confirm.modal_show = true;
                logger.debug('store showVoiceConfirmModal:{}', id);
                return true;
            }

            state.voice_confirm.target = id;
            state.voice_confirm.status = target.status;

            window.websdk.request.userRequest.getUserInfo([id], null, function (rsp) {
                if (!rsp.user_info) {
                    return;
                }
                let data = rsp.user_info[0];
                //state.voice_confirm.target = id;
                state.voice_confirm.target_info = data;
                state.voice_confirm.uname = data.display_name;
                state.voice_confirm.avatar = data.img_url;
                //state.voice_confirm.status = target.status;
                state.voice_confirm.modal_show = true;
            }, 'store_voice_confirm_req_user_profile');//

            return false;
        },
        hideVoiceConfirmModal: (state) => {
            state.voice_confirm.modal_show = false;
            state.voice_confirm.status = 0;
        },
        showVoicePttConfirmModal: (state, target) => {
            state.voice_ptt_confirm.modal_show = true;
            if (!target) {
                return false;
            }
            let id = target.id;
            /*_.forEach(state.im, function (data, key) {
                if (data && data.id === id) {
                    state.voice_ptt_confirm.target = id;
                    state.voice_ptt_confirm.target_info = data.info;
                    state.voice_ptt_confirm.uname = data.info.display_name;
                    state.voice_ptt_confirm.avatar = data.info.img_url;
                    state.voice_ptt_confirm.status = target.status;
                    state.voice_ptt_confirm.modal_show = true;
                    logger.debug('store showVoicePttConfirmModal:{}', id);
                    return true;
                }
            });*/
            let data = state.im[id];
            if (data) {
                state.voice_ptt_confirm.target = id;
                state.voice_ptt_confirm.target_info = data.info;
                state.voice_ptt_confirm.uname = data.info.display_name;
                state.voice_ptt_confirm.avatar = data.info.img_url;
                state.voice_ptt_confirm.status = target.status;
                state.voice_ptt_confirm.modal_show = true;
                logger.debug('store showVoicePttConfirmModal:{}', id);
                return true;
            }

            state.voice_ptt_confirm.target = id;
            state.voice_ptt_confirm.status = target.status;

            window.websdk.request.userRequest.getUserInfo([id], null, function (rsp) {
                if (!rsp.user_info) {
                    return;
                }
                let data = rsp.user_info[0];
                //state.voice_ptt_confirm.target = id;
                state.voice_ptt_confirm.target_info = data;
                state.voice_ptt_confirm.uname = data.display_name;
                state.voice_ptt_confirm.avatar = data.img_url;
                //state.voice_ptt_confirm.status = target.status;
                state.voice_ptt_confirm.modal_show = true;
            }, 'store_voice_ptt_confirm_req_user_profile');//

            return false;
        },
        hideVoicePttConfirmModal: (state) => {
            state.voice_ptt_confirm.modal_show = false;
            state.voice_ptt_confirm.status = 0;
        },
        showVoiceCallModal: (state, target) => {
            if (!target) {
                return false;
            }
            let id = target.id;
            /*_.forEach(state.im, function (data, key) {
                if (data && data.id === id) {
                    state.voice_call.target = id;
                    state.voice_call.target_info = data.info;
                    state.voice_call.uname = data.info.display_name;
                    state.voice_call.avatar = data.info.img_url;
                    state.voice_call.status = target.status;
                    state.voice_call.modal_show = true;
                    logger.debug('store showVoiceCallModal:{}', id);
                    return true;
                }
            });*/

            // check pstn, pstn的uid是虚拟的，只用显示电话号码 2020年4月15日13:53:12
            if (target.pstn_telno) {
                state.voice_call.target = id || 0;
                state.voice_call.uname = target.pstn_telno;
                state.voice_call.status = target.status;
                state.voice_call.modal_show = true;
                logger.debug('store pstn showVoiceCallModal:{}-{}', id, target.pstn_telno);
                return true;
            }

            let data = state.im[id];
            if (data) {
                if (state.voice_call.status == 2) {
                    logger.info('voice_call keep ing:{}', id);
                    return true;
                }
                state.voice_call.target = id;
                state.voice_call.target_info = data.info;
                state.voice_call.uname = data.info.display_name;
                state.voice_call.avatar = data.info.img_url;
                state.voice_call.status = target.status;
                state.voice_call.modal_show = true;
                logger.debug('store showVoiceCallModal:{}', id);
                return true;
            }

            state.voice_call.target = id;
            state.voice_call.status = target.status;

            window.websdk.request.userRequest.getUserInfo([id], null, function (rsp) {
                if (!rsp.user_info) {
                    return;
                }
                let data = rsp.user_info[0];
                //state.voice_call.target = id;
                state.voice_call.target_info = data;
                state.voice_call.uname = data.display_name;
                state.voice_call.avatar = data.img_url;
                //state.voice_call.status = target.status;
                state.voice_call.modal_show = true;
            }, 'store_voice_call_req_user_profile');//

            return false;
        },
        hideVoiceCallModal: (state) => {
            state.voice_call.modal_show = false;
            state.voice_call.status = 0;
        },
        updateVoiceCallStatus: (state, status) => {
            state.voice_call.status = status;
        },
        showVideoConfirmModal: (state, target) => {
            state.video_confirm.modal_show = true;
            if (!target) {
                return false;
            }
            let id = target.id;
            /*_.forEach(state.im, function (data, key) {
                if (data && data.id === id) {
                    state.video_confirm.target = id;
                    state.video_confirm.target_info = data.info;
                    state.video_confirm.uname = data.info.display_name;
                    state.video_confirm.avatar = data.info.img_url;
                    state.video_confirm.status = target.status;
                    state.video_confirm.modal_show = true;
                    logger.debug('store showVideoConfirmModal:{}', id);
                    return true;
                }
            });*/
            let data = state.im[id];
            if (data) {
                state.video_confirm.target = id;
                state.video_confirm.target_info = data.info;
                state.video_confirm.uname = data.info.display_name;
                state.video_confirm.avatar = data.info.img_url;
                state.video_confirm.status = target.status;
                state.video_confirm.modal_show = true;
                logger.debug('store showVideoConfirmModal:{}', id);
                return true;
            }

            state.video_confirm.target = id;
            state.video_confirm.status = target.status;

            window.websdk.request.userRequest.getUserInfo([id], null, function (rsp) {
                if (!rsp.user_info) {
                    return;
                }
                let data = rsp.user_info[0];
                //state.video_confirm.target = id;
                state.video_confirm.target_info = data;
                state.video_confirm.uname = data.display_name;
                state.video_confirm.avatar = data.img_url;
                //state.video_confirm.status = target.status;
                state.video_confirm.modal_show = true;
            }, 'store_video_confirm_req_user_profile');//

            return false;
        },
        hideVideoConfirmModal: (state) => {
            state.video_confirm.modal_show = false;
            state.video_confirm.status = 0;
        },
        showVideoCallModal: (state, target) => {
            if (!target) {
                return false;
            }

            if (state.video_call.status === 2) { //正在视频
                return false;
            }

            let id = target.id;
            state.video_call.url_remote = target.url_remote;
            state.video_call.url_self = target.url_self;

            /*_.forEach(state.im, function (data, key) {
                if (data && data.id === id) {
                    state.video_call.target = id;
                    state.video_call.target_info = data.info;
                    state.video_call.uname = data.info.display_name;
                    state.video_call.avatar = data.info.img_url;
                    state.video_call.status = target.status;
                    state.video_call.modal_show = true;
                    logger.debug('store showVideoCallModal:{}', id);
                    return true;
                }
            });*/
            let data = state.im[id];
            if (data) {
                if (state.video_call.status == 2) {
                    logger.info('voice_call keep ing:{}', id);
                    return true;
                }
                state.video_call.target = id;
                state.video_call.target_info = data.info;
                state.video_call.uname = data.info.display_name;
                state.video_call.is_con = data.info.type == 'console';
                state.video_call.avatar = data.info.img_url;
                state.video_call.status = target.status;
                state.video_call.modal_show = true;
                logger.debug('store showVideoCallModal:{}', id);
                return true;
            }

            // XXX 先设置好target和status，防止收到通知时，还未执行回调，造成没有target而无法继续执行通知对应的逻辑
            state.video_call.target = id;
            state.video_call.status = target.status;

            window.websdk.request.userRequest.getUserInfo([id], null, function (rsp) {
                if (!rsp.user_info) {
                    return;
                }
                let data = rsp.user_info[0];
                //state.video_call.target = id;
                state.video_call.target_info = data;
                state.video_call.uname = data.display_name;
                state.video_call.is_con = data.type == 'console';
                state.video_call.avatar = data.img_url;
                //state.video_call.status = target.status;
                state.video_call.modal_show = true;
            }, 'store_video_call_req_user_profile');//

            return false;
        },
        hideVideoCallModal: (state) => {
            state.video_call.modal_show = false;
            state.video_call.status = 0;
        },
        updateVideoCallStatus: (state, status) => {
            state.video_call.status = status;
        },
        updateDcgAttached: (state, uid) => {
            state.cur_dcg_attached_uid = uid;
            logger.debug('fresh-dcg-attached: {}', uid);
            //bus.$emit('fresh-dcg-attached', uid);
        },
        resetDcgAttached: (state, uid) => {
            if (state.cur_dcg_attached_uid === uid) {
                state.cur_dcg_attached_uid = null;
                logger.debug('fresh-dcg-attached: 0');
                //bus.$emit('fresh-dcg-attached', 0);
            }
        },
        pttConfirmAttached: (state, uid) => {
            state.ptt_confirm_attached = uid;
            logger.debug('ptt-confirm-attached: {}', uid);
            //bus.$emit('ptt-confirm-attached', uid);
        },

        cacheLoginUser: (state, user) => {
            if (!user) {
                user = {};
            }
            state.login_user = user;
        },
    },

    actions: {
        resetState(context) {
            context.commit('resetState');
        },
        showIMModal(context, target) {
            //context.state.user_modal_show = user_modal_show;
            logger.debug('commit showIMModal');
            context.commit('showIMModal', target);
        },
        hideIMModal(context, id) {
            context.commit('hideIMModal', id);
        },
        showIMImageModal(context, target) {
            context.commit('showIMImageModal', target);
        },
        hideIMImageModal(context) {
            context.commit('hideIMImageModal');
        },
        showIMUserListModal(context, target) {
            context.commit('showIMUserListModal', target);
        },
        hideIMUserListModal(context, id) {
            context.commit('hideIMUserListModal', id);
        },
        showGroupCreateModal(context, target) {
            context.commit('showGroupCreateModal', target);
        },
        hideGroupCreateModal(context, id) {
            context.commit('hideGroupCreateModal', id);
        },
        showVoiceConfirmModal(context, target) {
            context.commit('showVoiceConfirmModal', target);
        },
        hideVoiceConfirmModal(context) {
            context.commit('hideVoiceConfirmModal');
        },
        showVoicePttConfirmModal(context, target) {
            context.commit('showVoicePttConfirmModal', target);
        },
        hideVoicePttConfirmModal(context) {
            context.commit('hideVoicePttConfirmModal');
        },
        showVoiceCallModal(context, target) {
            context.commit('showVoiceCallModal', target);
        },
        hideVoiceCallModal(context) {
            context.commit('hideVoiceCallModal');
        },
        updateVoiceCallStatus(context, status) {
            context.commit('updateVoiceCallStatus', status);
        },
        showVideoConfirmModal(context, target) {
            context.commit('showVideoConfirmModal', target);
        },
        hideVideoConfirmModal(context) {
            context.commit('hideVideoConfirmModal');
        },
        showVideoCallModal(context, target) {
            context.commit('showVideoCallModal', target);
        },
        hideVideoCallModal(context) {
            context.commit('hideVideoCallModal');
        },
        updateVideoCallStatus(context, status) {
            context.commit('updateVideoCallStatus', status);
        },
        showVideoModal(context, target) {
            context.commit('showVideoModal', target);
        },
        updateVideoConf(context, data) {
            context.commit('updateVideoConf', data);
        },
        setVideoWS(context, target) {
            context.commit('setVideoWS', target);
        },
        hideVideoModal(context, id) {
            context.commit('hideVideoModal', id);
        },
        updateVideoStatus(context, target) {
            context.commit('updateVideoStatus', target);
        },
        updateDcgAttached(context, uid) {
            context.commit('updateDcgAttached', uid);
        },
        // eslint-disable-next-line no-unused-vars
        resetDcgAttached: (context, uid) => {
            context.commit('resetDcgAttached');
        },
        pttConfirmAttached: (context, uid) => {
            context.commit('pttConfirmAttached', uid);
        },

        cacheLoginUser: (context) => {
            context.commit('cacheLoginUser');
        },
    }
});
