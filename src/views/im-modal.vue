<template>
    <Modal v-model="main_modal_show" class="sdk-user-modal" draggable scrollable :title=uname :width=1000 :z-index=1000
           :footer-hide=true v-on:on-cancel=on_hide_modal v-on:on-visible-change=on_visible_change><!--:width=510-->
        <div class="sdk-im-split">
            <Split v-model="im_split" min="150" max="300">

                <!-- im-left-user -->
                <div v-if="im_target_type==1" slot="left" class="sdk-left">
                    <div class="sdk-left-top"></div>
                    <div>
                        <Avatar class="ivu-avatar-largest" :src="res_avatar1" style="border: 1px solid #7e7f80;"/>
                    </div>
                    <div class="sdk-uname-div">
                        <div v-show="!name_edit" @click="toggleEditName" class="sdk-pointer">
                            <span class="sdk-uname-txt">{{ uname }}</span>
                            <!--<span class="sdk-uname-edit"><Icon type="md-create"/></span>-->
                        </div>
                        <div v-show="name_edit" class="sdk-pointer">
                            <Input v-model="uname" @on-blur="toggleEditName" style="width: 100%"/>
                        </div>
                    </div>
                    <div class="sdk-touch-div">
                        <i-switch v-model="dcg_attached" :loading=dcg_attach_loading size="large" @on-change="reqCallPTT" title="强呼"/>
                    </div>
                    <div class="sdk-left-bottom">
                        <div class="sdk-oper-toggle-div">
                            <div class="sdk-oper-toggle">
                                <Icon v-show="oper_type==1" @click="toggleOperType" type="md-arrow-dropup" class="sdk-oper-toggle-icon"/>
                                <Icon v-show="oper_type==2" @click="toggleOperType" type="md-arrow-dropdown" class="sdk-oper-toggle-icon"/>
                            </div>
                        </div>
                        <div class="sdk-oper-div">
                            <div v-show="oper_panel==1" class="sdk-oper-panel">
                                <div class="sdk-oper-item" title="语音通话">
                                    <Icon @click="reqCall" type="ios-call-outline" class="sdk-icon-btn"/>
                                </div>
                                <!--<div class="sdk-oper-item" title="视频通话">
                                    <Icon @click="reqVideoCall" type="ios-videocam-outline" class="sdk-icon-btn"/>
                                </div>-->
                                <!--theme_blue-->
                                <div class="sdk-oper-item" title="拉取视频">
                                    <Icon @click="reqPullVideoCall" type="ios-videocam-outline" class="sdk-icon-btn"/>
                                </div>
                                <div class="sdk-oper-item" title="定位">
                                    <Icon @click="justNoticeLocation" type="ios-locate-outline" class="sdk-icon-btn"/>
                                </div>
                                <div class="sdk-oper-item" title="发送图片">
                                    <!--<Upload :action=upload_url :max-size=102400 :format="['jpg','jpeg','bmp','gif','png']"
                                            :show-upload-list=false :paste=true :on-progress=onUploadProgressImg
                                            :on-success=onUploadSuccessImg :on-format-error=onUploadFormatErrorImg
                                            :on-error=onUploadErrorImg :on-exceeded-size=onUploadExceededSizeImg>
                                        <Icon type="ios-image-outline" class="sdk-icon-btn"/>
                                    </Upload>-->
                                </div>
                                <div v-show="oper_type==2">
                                    <div class="sdk-oper-item" title="发送文件">
                                        <!--<Upload :action=upload_url :max-size=102400
                                                :show-upload-list=false :paste=true :on-progress=onUploadProgressFile
                                                :on-success=onUploadSuccessFile :on-format-error=onUploadFormatErrorFile
                                                :on-error=onUploadErrorFile :on-exceeded-size=onUploadExceededSizeFile>
                                            <Icon type="ios-folder-outline" class="sdk-icon-btn"/>
                                        </Upload>-->
                                    </div>
                                    <div class="sdk-oper-item" title="视频通话">
                                        <Icon @click="reqVideoCall" type="ios-videocam-outline" class="sdk-icon-btn"/>
                                    </div>
                                    <!--<div>
                                        <Icon @click="switchOperPanel(1)" type="md-remove" size="30" color="#2b85e4" class="sdk-icon-btn"/>
                                        <Icon @click="switchOperPanel(2)" type="md-remove" size="30" color="#000" class="sdk-icon-btn"/>
                                    </div>-->
                                </div>
                            </div>
                            <!--<div v-show="oper_panel==2" class="sdk-oper-panel">
                                <div v-show="oper_type==2">
                                    <div>
                                        <Icon @click="switchOperPanel(1)" type="md-remove" size="30" color="#000" class="sdk-icon-btn"/>
                                        <Icon @click="switchOperPanel(2)" type="md-remove" size="30" color="#2b85e4" class="sdk-icon-btn"/>
                                    </div>
                                </div>
                            </div>-->
                        </div>
                    </div>
                </div>

                <!-- im-left-group -->
                <div v-if="im_target_type==2" slot="left" class="sdk-left">
                    <div class="sdk-tg-member-list">
                        <div v-bind:key="item.uid" v-for="item in tg_mem_list">
                            <div class="sdk-left-mem-item">
                                <div @click="showIMModalUser(item.uid)" class="sdk-left-mem-avatar">
                                    <Avatar :src="res_avatar1" style="border: 1px solid #7e7f80;"/>
                                </div>
                                <div v-if="item.online" class="sdk-left-mem-name sdk-online">
                                    {{item.display_name}}
                                </div>
                                <div v-if="!item.online" class="sdk-left-mem-name">
                                    {{item.display_name}}
                                </div>
                                <!--<Icon v-show="!video_conf_on && !item.video_ing" @click="reqPlayVideo(item.uid)"
                                      type="ios-videocam" class="sdk-left-mem-video sdk-icon-btn"/>
                                <Icon v-show="!video_conf_on && item.video_ing" @click="reqStopVideo(item.uid)"
                                      type="md-videocam" :size=22 class="sdk-left-mem-video sdk-icon-btn sdk-icon-btn-on"/>-->
                                <!--<Dropdown v-show="video_conf_on" v-on:on-click=operateVideo
                                          trigger="click" placement="bottom-start" class="sdk-left-mem-video-div">
                                    <Icon v-show="!item.video_ing" type="ios-videocam" class="sdk-left-mem-video sdk-icon-btn"/>
                                    <Icon v-show="item.video_ing" type="md-videocam" :size=22 class="sdk-left-mem-video sdk-icon-btn sdk-icon-btn-on"/>
                                    <DropdownMenu slot="list">
                                        <DropdownItem v-show="!item.video_ing" :name="'playVideo_'+item.uid">启动视频</DropdownItem>
                                        <DropdownItem v-show="item.video_ing" :name="'stopPlayVideo_'+item.uid">停止视频</DropdownItem>
                                        <DropdownItem v-show="!item.video_share_ing" :name="'shareVideo_'+item.uid" divided>分享视频</DropdownItem>
                                        <DropdownItem v-show="item.video_share_ing" :name="'stopShareVideo_'+item.uid" divided>停止分享</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>-->
                            </div>
                        </div>
                    </div>

                    <div class="sdk-left-bottom">
                        <div class="sdk-oper-toggle-div">
                            <div class="sdk-oper-toggle">
                                <Icon v-show="oper_type==1" @click="toggleOperType" type="md-arrow-dropup" class="sdk-oper-toggle-icon"/>
                                <Icon v-show="oper_type==2" @click="toggleOperType" type="md-arrow-dropdown" class="sdk-oper-toggle-icon"/>
                            </div>
                        </div>
                        <div class="sdk-oper-div">
                            <div v-show="oper_panel==1" class="sdk-oper-panel">
                                <div>
                                    <div class="sdk-oper-item" title="强拉">
                                        <Icon @click="forceEnterGroup" type="ios-contract" class="sdk-icon-btn"/>
                                    </div>
                                    <div class="sdk-oper-item" title="强拆">
                                        <Icon @click="forceLeaveGroup" type="ios-expand" class="sdk-icon-btn"/>
                                    </div>
                                    <div class="sdk-oper-item" title="视频会商">
                                        <Icon @click="toggleVideoConf" v-bind:class="{'icon-btn-on': video_conf_on}" type="ios-desktop" class="sdk-icon-btn"/>
                                        <!--<Icon type="md-desktop" /><Icon type="ios-easel-outline" /><Icon type="ios-desktop-outline" />-->
                                    </div>
                                    <div class="sdk-oper-item" title="发送图片">
                                        <!--<Upload :action=upload_url :max-size=102400 :format="['jpg','jpeg','bmp','gif','png']"
                                                :show-upload-list=false :paste=true :on-progress=onUploadProgressImg
                                                :on-success=onUploadSuccessImg :on-format-error=onUploadFormatErrorImg
                                                :on-error=onUploadErrorImg :on-exceeded-size=onUploadExceededSizeImg>
                                            <Icon type="ios-image-outline" class="sdk-icon-btn"/>
                                        </Upload>-->
                                    </div>
                                </div>
                                <div v-show="oper_type==2">
                                    <div class="sdk-oper-item" title="发送文件">
                                        <!--<Upload :action=upload_url :max-size=102400
                                                :show-upload-list=false :paste=true :on-progress=onUploadProgressFile
                                                :on-success=onUploadSuccessFile :on-format-error=onUploadFormatErrorFile
                                                :on-error=onUploadErrorFile :on-exceeded-size=onUploadExceededSizeFile>
                                            <Icon type="ios-folder-outline" class="sdk-icon-btn"/>
                                        </Upload>-->
                                    </div>
                                    <div class="sdk-oper-item" title="添加组成员">
                                        <Icon @click="showGrpMemAdd" type="md-person-add" class="sdk-icon-btn"/>
                                    </div>
                                    <div class="sdk-oper-item" title="移除组成员">
                                        <Icon @click="showGrpMemRem" type="md-person" class="sdk-icon-btn"/>
                                    </div>
                                    <!--<div>
                                        <Icon @click="switchOperPanel(1)" type="md-remove" size="30" color="#2b85e4" class="sdk-icon-btn"/>
                                        <Icon @click="switchOperPanel(2)" type="md-remove" size="30" color="#000" class="sdk-icon-btn"/>
                                    </div>-->
                                </div>
                            </div>
                            <!--<div v-show="oper_panel==2" class="sdk-oper-panel">
                                <div v-show="oper_type==2">
                                    <div>
                                        <Icon @click="switchOperPanel(1)" type="md-remove" size="30" color="#000" class="sdk-icon-btn"/>
                                        <Icon @click="switchOperPanel(2)" type="md-remove" size="30" color="#2b85e4" class="sdk-icon-btn"/>
                                    </div>
                                </div>
                            </div>-->
                        </div>
                    </div>
                </div>

                <div slot="right" class="sdk-im-panel">
                    <Spin size="large" fix v-if="!tg_attached && im_target_type==2">
                        <Icon type="ios-loading" size=18 class="sdk-demo-spin-icon-load"></Icon>
                        <div>正在连接...</div>
                    </Spin>
                    <div v-show="video_conf_on_not_join" @click="toggleVideoConf" class="sdk-video-conf-tip-div">
                        <Alert type="error" class="sdk-video-conf-tip">群组中正在进行视频会商，点击加入</Alert>
                    </div>
                    <div id="sdk_im_div" class="sdk-im-div">
                        <div v-bind:key="item.id" v-for="item in im_list">
                            <IMVoiceRight v-if="item.type === 'voice_send'" :uname="my_name" :avatar="my_avatar" :ts="item.ts"
                                          :duration="item.duration" :refid="item.refid" :target="item.target"></IMVoiceRight>
                            <IMVoiceLeft v-if="item.type === 'voice_receive'" :uname="item.uname" :avatar="item.avatar" :ts="item.ts"
                                         :duration="item.duration" :refid="item.refid" :target="item.target"></IMVoiceLeft>
                            <IMTextRight v-if="item.type === 'text_send'" :uname="my_name" :avatar="my_avatar" :ts="item.ts" :target="item.target"
                                         :content="item.content"></IMTextRight>
                            <IMTextLeft v-if="item.type === 'text_receive'" :uname="item.uname" :avatar="item.avatar" :ts="item.ts" :target="item.target"
                                        :content="item.content"></IMTextLeft>
                            <IMImageRight v-if="item.type === 'image_send'" :uname="my_name" :avatar="my_avatar" :ts="item.ts" :target="item.target"
                                          :url_small="item.url_small" :url_large="item.url_large"></IMImageRight>
                            <IMImageLeft v-if="item.type === 'image_receive'" :uname="item.uname" :avatar="item.avatar" :ts="item.ts" :target="item.target"
                                         :url_small="item.url_small" :url_large="item.url_large"></IMImageLeft>
                            <IMFileRight v-if="item.type === 'file_send'" :uname="my_name" :avatar="my_avatar" :ts="item.ts" :target="item.target"
                                         :content="item.content" :file_name="item.file_name"></IMFileRight>
                            <IMFileLeft v-if="item.type === 'file_receive'" :uname="item.uname" :avatar="item.avatar" :ts="item.ts" :target="item.target"
                                        :content="item.content" :file_name="item.file_name"></IMFileLeft>
                        </div>

                        <div v-show="ptt_receive_ing && im_target_type == 1">
                            <IMVoiceLeft :uname="target_name" :avatar="target_avatar" :init_playing="true" :ts="ts_r"></IMVoiceLeft>
                        </div>
                        <div v-show="ptt_receive_ing && im_target_type == 2">
                            <IMVoiceLeft :uname="ptt_receive_uname" :avatar="ptt_receive_avatar" :init_playing="true" :ts="ts_r"></IMVoiceLeft>
                        </div>
                        <div v-show="ptt_send_ing">
                            <IMVoiceRight :uname="my_name" :avatar="my_avatar" :init_playing="true" :ts="ts_s"></IMVoiceRight>
                        </div>


                    </div>
                    <div class="sdk-im-bottom">
                        <div v-show="im_type==1">
                            <div class="sdk-im-bottom-icon-div">
                                <Icon @click="toggleType" type="ios-keypad-outline" size="36" class="sdk-icon-btn" color="#000"/>
                            </div>
                            <div class="sdk-im-bottom-voice">
                                <Button v-show="!ptt_on" style="width:100%;" @click="reqPttOn">
                                    <Icon type="ios-microphone-outline" size="26" color="#000"/>
                                    <span style="font-size: larger;">按下通话</span>
                                </Button>
                                <Button v-show="ptt_on" style="width:100%" @click="reqPttOff">
                                    <Icon type="ios-microphone-outline" size="26" color="#19be6b"/>
                                    <span style="font-size: larger;color:#19be6b">正在录音...</span>
                                </Button>
                            </div>
                        </div>
                        <div v-show="im_type==2">
                            <div class="sdk-im-bottom-icon-div">
                                <Icon @click="toggleType" type="ios-microphone-outline" size="36" class="sdk-icon-btn" color="#000"/>
                            </div>
                            <div class="sdk-im-bottom-text1">
                                <Input v-model="text_content" style="width: 100%"/>
                            </div>
                            <div class="sdk-im-bottom-text2">
                                <Button @click="sendIMMsg" type="primary" style="width:100%;">
                                    <span style="font-size: larger;">发送</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Split>
        </div>
    </Modal>
</template>

<script src="./im-modal.js"></script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped src="../assets/css/user-group-modal.less"></style>
